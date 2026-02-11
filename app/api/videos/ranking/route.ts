import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const segment = searchParams.get('segment') || 'total';
        const tag = searchParams.get('tag');

        // ViewingLogから動画ごとの統計を集計
        const viewingLogs = await prisma.viewingLog.findMany({
            include: {
                content: {
                    select: {
                        id: true,
                        title: true,
                        thumbnailUrl: true,
                        duration: true,
                        viewCount: true,
                    },
                },
                user: {
                    select: {
                        tags: true,
                    },
                },
            },
        });

        // タグフィルター適用
        let filteredLogs = viewingLogs;
        if (segment === 'tag' && tag) {
            filteredLogs = viewingLogs.filter((log) =>
                log.user.tags.includes(tag)
            );
        }

        // 動画ごとに集計
        const videoStats = new Map<string, {
            id: string;
            title: string;
            thumbnailUrl: string | null;
            duration: number | null;
            viewCount: number;
            totalWatchTime: number;
            completionCount: number;
            viewerCount: number;
        }>();

        filteredLogs.forEach((log) => {
            const videoId = log.content.id;
            if (!videoStats.has(videoId)) {
                videoStats.set(videoId, {
                    id: log.content.id,
                    title: log.content.title,
                    thumbnailUrl: log.content.thumbnailUrl,
                    duration: log.content.duration,
                    viewCount: log.content.viewCount,
                    totalWatchTime: 0,
                    completionCount: 0,
                    viewerCount: 0,
                });
            }

            const stats = videoStats.get(videoId)!;
            stats.totalWatchTime += log.watchTime;
            stats.viewerCount += 1;

            // 完走判定（視聴時間が動画の90%以上）
            if (log.content.duration && log.watchTime >= log.content.duration * 0.9) {
                stats.completionCount += 1;
            }
        });

        // 完走率を計算してランキング作成
        const ranking = Array.from(videoStats.values())
            .map((stats) => ({
                id: stats.id,
                title: stats.title,
                thumbnailUrl: stats.thumbnailUrl,
                duration: stats.duration,
                viewCount: stats.viewCount,
                completionRate: stats.viewerCount > 0
                    ? (stats.completionCount / stats.viewerCount) * 100
                    : 0,
                averageWatchTime: stats.viewerCount > 0
                    ? Math.round(stats.totalWatchTime / stats.viewerCount)
                    : 0,
                completionCount: stats.completionCount,
                viewerCount: stats.viewerCount,
            }))
            .sort((a, b) => b.completionRate - a.completionRate);

        return NextResponse.json({
            ranking,
            segment,
            tag: segment === 'tag' ? tag : null,
        });
    } catch (error) {
        console.error('Error fetching video ranking:', error);
        return NextResponse.json(
            { error: '動画ランキングの取得に失敗しました' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videoId, watchTime, userTags } = body;

        if (!videoId || !watchTime) {
            return NextResponse.json(
                { error: 'videoIdとwatchTimeは必須です' },
                { status: 400 }
            );
        }

        // TODO: 実際のユーザーIDを取得（認証実装後）
        // 現在はモックユーザーIDを使用
        const mockUserId = 'mock-user-id';

        // ViewingLogを更新または作成
        const viewingLog = await prisma.viewingLog.upsert({
            where: {
                userId_contentId: {
                    userId: mockUserId,
                    contentId: videoId,
                },
            },
            update: {
                watchTime: {
                    increment: watchTime,
                },
                updatedAt: new Date(),
            },
            create: {
                userId: mockUserId,
                contentId: videoId,
                watchTime: watchTime,
            },
        });

        // 動画の視聴回数を更新（初回視聴時のみ）
        if (viewingLog.watchTime === watchTime) {
            await prisma.content.update({
                where: { id: videoId },
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
        }

        return NextResponse.json({
            success: true,
            watchTime: viewingLog.watchTime,
        });
    } catch (error) {
        console.error('Video tracking error:', error);
        return NextResponse.json(
            { error: '視聴データの記録に失敗しました' },
            { status: 500 }
        );
    }
}

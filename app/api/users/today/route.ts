import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tag = searchParams.get('tag');

        // 今日の日付の開始と終了を取得
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // クエリ条件
        const whereCondition: any = {
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        };

        // タグフィルター
        if (tag && tag !== 'all') {
            whereCondition.tags = {
                has: tag,
            };
        }

        // 今日登録されたユーザーを取得
        const users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                displayName: true,
                lineId: true,
                tags: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            users,
            count: users.length,
        });
    } catch (error) {
        console.error('Error fetching today users:', error);
        return NextResponse.json(
            { error: '本日の登録者の取得に失敗しました' },
            { status: 500 }
        );
    }
}

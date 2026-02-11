import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ users: [] });
        }

        // ユーザーを検索（名前、LINE ID、タグで検索）
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        displayName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lineId: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tags: {
                            has: query,
                        },
                    },
                ],
            },
            select: {
                id: true,
                displayName: true,
                lineId: true,
                tags: true,
            },
            take: 10, // 最大10件
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('User search error:', error);
        return NextResponse.json(
            { error: 'ユーザー検索に失敗しました' },
            { status: 500 }
        );
    }
}

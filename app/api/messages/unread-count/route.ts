import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
    try {
        // TODO: 実際のMessageテーブルから未読メッセージ数を取得
        // 現在はモックデータを返す
        const unreadCount = Math.floor(Math.random() * 10);

        return NextResponse.json({
            unreadCount,
            unreadUsers: unreadCount,
        });
    } catch (error) {
        console.error('Unread count error:', error);
        return NextResponse.json(
            { error: '未読数の取得に失敗しました' },
            { status: 500 }
        );
    }
}

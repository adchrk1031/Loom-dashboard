import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const tag = searchParams.get('tag');

        // ユーザーデータを取得
        let users;
        if (tag && tag !== '総合') {
            users = await prisma.user.findMany({
                where: {
                    tags: {
                        has: tag,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        } else {
            users = await prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }

        // CSVヘッダー
        const headers = ['名前', 'LINEユーザーID', '登録日', '流入経路', 'タグ'];

        // CSVデータ行
        const rows = users.map((user) => {
            const name = user.displayName || '未設定';
            const lineId = user.lineId;
            const createdAt = new Date(user.createdAt).toLocaleDateString('ja-JP');
            const source = user.source || '不明';
            const tags = user.tags.join(', ') || '未分類';

            return [name, lineId, createdAt, source, tags];
        });

        // CSV文字列を生成
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        // BOM付きUTF-8でエンコード（Excelで文字化け防止）
        const bom = '\uFEFF';
        const csvWithBom = bom + csvContent;

        return new NextResponse(csvWithBom, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="users_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('CSV export error:', error);
        return NextResponse.json(
            { error: 'CSV出力に失敗しました' },
            { status: 500 }
        );
    }
}

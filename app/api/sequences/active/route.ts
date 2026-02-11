import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // 実行中のシーケンスを取得
        // nameでグループ化して、各シーケンスのステップ数を計算
        const sequences = await prisma.sequence.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                stepNumber: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // nameでグループ化
        const sequenceMap = new Map<string, any>();
        sequences.forEach((seq) => {
            if (!sequenceMap.has(seq.name)) {
                sequenceMap.set(seq.name, {
                    id: seq.id,
                    name: seq.name,
                    stepCount: 0,
                    updatedAt: seq.updatedAt,
                });
            }
            const current = sequenceMap.get(seq.name);
            current.stepCount = Math.max(current.stepCount, seq.stepNumber);
        });

        // 最新10件に制限
        const activeSequences = Array.from(sequenceMap.values())
            .slice(0, 10)
            .map((seq) => ({
                ...seq,
                // TODO: 実際の対象者数を計算（SequenceProgressテーブルから）
                targetCount: Math.floor(Math.random() * 500) + 50, // モックデータ
                status: 'active' as const,
            }));

        return NextResponse.json({
            sequences: activeSequences,
            count: activeSequences.length,
        });
    } catch (error) {
        console.error('Error fetching active sequences:', error);
        return NextResponse.json(
            { error: '実行中シーケンスの取得に失敗しました' },
            { status: 500 }
        );
    }
}

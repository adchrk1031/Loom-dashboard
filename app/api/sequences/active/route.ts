import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // 実行中のシーケンスを取得
        // TODO: Sequenceテーブルにstatusカラムを追加後、WHERE status = 'ACTIVE' でフィルター
        const sequences = await prisma.sequence.findMany({
            select: {
                id: true,
                name: true,
                steps: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 10, // 最新10件
        });

        // シーケンスごとの統計を計算
        const activeSequences = sequences.map((seq) => {
            // stepsはJSON配列なので、パースして件数を取得
            let stepCount = 0;
            try {
                const stepsArray = Array.isArray(seq.steps) ? seq.steps : JSON.parse(seq.steps as any);
                stepCount = stepsArray.length;
            } catch (e) {
                stepCount = 0;
            }

            return {
                id: seq.id,
                name: seq.name,
                stepCount,
                // TODO: 実際の対象者数を計算（SequenceEnrollmentテーブルなどから）
                targetCount: Math.floor(Math.random() * 500) + 50, // モックデータ
                status: 'active' as const,
                updatedAt: seq.updatedAt,
            };
        });

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

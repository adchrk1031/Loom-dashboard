import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PublishedData } from '@/types/editor';

// GET /api/funnels/[id] - ファンネルデータを取得
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const funnel = await prisma.funnel.findUnique({
            where: { id: params.id },
        });

        if (!funnel) {
            return NextResponse.json(
                { error: 'Funnel not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: funnel.id,
            name: funnel.name,
            slug: funnel.slug,
            isPublished: funnel.isPublished,
            publishedData: funnel.publishedData,
        });
    } catch (error) {
        console.error('Error fetching funnel:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/funnels/[id] - ファンネルデータを更新
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { publishedData } = body as { publishedData: PublishedData };

        if (!publishedData) {
            return NextResponse.json(
                { error: 'publishedData is required' },
                { status: 400 }
            );
        }

        const funnel = await prisma.funnel.update({
            where: { id: params.id },
            data: {
                publishedData: publishedData as any, // Prisma JsonValue
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            id: funnel.id,
            name: funnel.name,
            slug: funnel.slug,
            isPublished: funnel.isPublished,
            publishedData: funnel.publishedData,
        });
    } catch (error) {
        console.error('Error updating funnel:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

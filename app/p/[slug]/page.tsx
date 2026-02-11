import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Block } from '@/types/editor';
import PublicHeadingBlock from '@/components/public/PublicHeadingBlock';
import PublicVideoBlock from '@/components/public/PublicVideoBlock';
import PublicButtonBlock from '@/components/public/PublicButtonBlock';
import TrackingProvider from '@/components/TrackingProvider';

export default async function PublicLandingPage({
    params,
}: {
    params: { slug: string };
}) {
    // データベースからファンネルを取得
    const funnel = await prisma.funnel.findUnique({
        where: { slug: params.slug },
    });

    // 存在しないか非公開の場合は404
    if (!funnel || !funnel.isPublished) {
        notFound();
    }

    const publishedData = funnel.publishedData as any;
    const blocks: Block[] = publishedData?.blocks || [];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackingProvider>
                <div className="min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        <div className="space-y-8">
                            {blocks.map((block) => {
                                switch (block.type) {
                                    case 'heading':
                                        return <PublicHeadingBlock key={block.id} block={block} />;
                                    case 'video':
                                        return <PublicVideoBlock key={block.id} block={block} />;
                                    case 'button':
                                        return <PublicButtonBlock key={block.id} block={block} />;
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </TrackingProvider>
        </Suspense>
    );
}

// 静的生成の設定（オプション）
export const dynamic = 'force-dynamic'; // 常に最新データを取得

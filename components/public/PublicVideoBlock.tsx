'use client';

import { useState } from 'react';
import type { VideoBlock } from '@/types/editor';
import RelatedVideosList from '@/components/RelatedVideosList';
import { ExternalLink, Share2, ThumbsUp } from 'lucide-react';

interface PublicVideoBlockProps {
    block: VideoBlock;
    relatedVideos?: Array<{
        id: string;
        title: string;
        thumbnail: string;
        duration: string;
        views: number;
        uploadedAt: Date;
    }>;
    onVideoChange?: (videoId: string) => void;
}

export default function PublicVideoBlock({
    block,
    relatedVideos = [],
    onVideoChange
}: PublicVideoBlockProps) {
    const [showDescription, setShowDescription] = useState(false);

    const aspectRatioClass =
        block.props.aspectRatio === '16:9'
            ? 'aspect-video'
            : block.props.aspectRatio === '4:3'
                ? 'aspect-[4/3]'
                : 'aspect-square';

    if (!block.props.url) return null;

    return (
        <div className="w-full">
            {/* デスクトップ: 左右2カラムレイアウト */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_400px] lg:gap-6">
                {/* 左側: メインコンテンツ */}
                <div>
                    {/* 動画プレイヤー */}
                    <div className={`w-full ${aspectRatioClass} bg-gray-900 rounded-2xl overflow-hidden mb-4`}>
                        <iframe
                            src={block.props.url}
                            title={block.props.title}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>

                    {/* タイトル */}
                    {block.props.title && (
                        <h1 className="text-2xl font-black text-black mb-4">
                            {block.props.title}
                        </h1>
                    )}

                    {/* アクションボタン */}
                    <div className="flex items-center gap-3 mb-6">
                        <button className="ios-button px-6 py-3 bg-blue-600 text-white flex items-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            公式LINE追加
                        </button>
                        <button className="ios-button px-4 py-3 bg-gray-100 text-gray-700 flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button className="ios-button px-4 py-3 bg-gray-100 text-gray-700 flex items-center gap-2">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 概要欄 */}
                    <div className="ios-card p-6">
                        <button
                            onClick={() => setShowDescription(!showDescription)}
                            className="w-full text-left"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-black">概要</h3>
                                <span className="text-sm text-gray-600">
                                    {showDescription ? '閉じる' : '展開'}
                                </span>
                            </div>
                        </button>

                        {showDescription && (
                            <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                                この動画では、副業で月収30万円を達成するための具体的な方法を解説しています。

                                【目次】
                                0:00 イントロダクション
                                1:30 副業の選び方
                                5:00 実践的なステップ
                                10:00 まとめ

                                公式LINEに登録すると、さらに詳しい情報をお届けします！
                            </div>
                        )}
                    </div>
                </div>

                {/* 右側: 関連動画 */}
                <div>
                    {relatedVideos.length > 0 && (
                        <RelatedVideosList
                            videos={relatedVideos}
                            onVideoClick={(videoId) => {
                                if (onVideoChange) {
                                    onVideoChange(videoId);
                                }
                            }}
                        />
                    )}
                </div>
            </div>

            {/* モバイル: 縦並びレイアウト */}
            <div className="lg:hidden">
                {/* 動画プレイヤー */}
                <div className={`w-full ${aspectRatioClass} bg-gray-900 rounded-2xl overflow-hidden mb-4`}>
                    <iframe
                        src={block.props.url}
                        title={block.props.title}
                        className="w-full h-full"
                        allowFullScreen
                    />
                </div>

                {/* タイトル */}
                {block.props.title && (
                    <h1 className="text-xl font-black text-black mb-4 px-4">
                        {block.props.title}
                    </h1>
                )}

                {/* アクションボタン */}
                <div className="flex items-center gap-2 mb-6 px-4">
                    <button className="ios-button flex-1 py-3 bg-blue-600 text-white flex items-center justify-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        公式LINE追加
                    </button>
                    <button className="ios-button px-4 py-3 bg-gray-100 text-gray-700">
                        <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button className="ios-button px-4 py-3 bg-gray-100 text-gray-700">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* 概要欄 */}
                <div className="ios-card p-6 mx-4 mb-6">
                    <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="w-full text-left"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-black">概要</h3>
                            <span className="text-sm text-gray-600">
                                {showDescription ? '閉じる' : '展開'}
                            </span>
                        </div>
                    </button>

                    {showDescription && (
                        <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                            この動画では、副業で月収30万円を達成するための具体的な方法を解説しています。
                        </div>
                    )}
                </div>

                {/* 関連動画 */}
                {relatedVideos.length > 0 && (
                    <div className="px-4">
                        <RelatedVideosList
                            videos={relatedVideos}
                            onVideoClick={(videoId) => {
                                if (onVideoChange) {
                                    onVideoChange(videoId);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

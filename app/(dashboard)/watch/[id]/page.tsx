'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Share2, Eye, Calendar } from 'lucide-react';
import VideoPlayer from '@/components/video/video-player';
import RelatedVideos from '@/components/video/related-videos';
import BannerAd from '@/components/ads/banner-ad';

interface Video {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    viewCount: number;
    duration?: number;
    visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
    createdAt: string;
}

export default function WatchPage({ params }: { params: { id: string } }) {
    const [video, setVideo] = useState<Video | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // モックデータ（後でAPIから取得）
        const mockVideo: Video = {
            id: params.id,
            title: 'Loomプラットフォーム完全ガイド',
            description: 'Loomの使い方を徹底解説します。この動画では、基本的な機能から高度な使い方まで、すべてをカバーしています。',
            thumbnailUrl: 'https://placehold.co/640x360/6B8CAE/white?text=Video+1',
            viewCount: 1234,
            duration: 600,
            visibility: 'PUBLIC',
            createdAt: new Date().toISOString(),
        };

        const mockRelatedVideos: Video[] = [
            {
                id: '2',
                title: 'マーケティング自動化の基礎',
                description: '効率的なマーケティング戦略を学びます',
                thumbnailUrl: 'https://placehold.co/640x360/8FA88E/white?text=Video+2',
                viewCount: 856,
                duration: 450,
                visibility: 'PUBLIC',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: '3',
                title: 'LINE配信の最適化テクニック',
                description: '開封率を上げるためのノウハウ',
                thumbnailUrl: 'https://placehold.co/640x360/D4A574/white?text=Video+3',
                viewCount: 542,
                duration: 720,
                visibility: 'UNLISTED',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
            {
                id: '4',
                title: 'データ分析で成果を最大化',
                description: 'KPIの見方と改善方法',
                thumbnailUrl: 'https://placehold.co/640x360/B87C7C/white?text=Video+4',
                viewCount: 321,
                duration: 540,
                visibility: 'PUBLIC',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
            },
            {
                id: '5',
                title: 'コンバージョン率を上げる方法',
                description: 'CVR改善のための実践的なテクニック',
                thumbnailUrl: 'https://placehold.co/640x360/A8B5C8/white?text=Video+5',
                viewCount: 678,
                duration: 480,
                visibility: 'PUBLIC',
                createdAt: new Date(Date.now() - 345600000).toISOString(),
            },
        ];

        setTimeout(() => {
            setVideo(mockVideo);
            setRelatedVideos(mockRelatedVideos);
            setLoading(false);
        }, 500);
    }, [params.id]);

    const formatViewCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading || !video) {
        return (
            <div className="max-w-[1800px] mx-auto px-8 py-12">
                <div className="animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-2xl mb-6" />
                    <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1800px] mx-auto px-8 py-12">
            <div className="flex gap-8">
                {/* メインコンテンツエリア */}
                <div className="flex-1">
                    {/* 動画プレイヤー */}
                    <div className="mb-6">
                        <VideoPlayer videoId={video.id} title={video.title} />
                    </div>

                    {/* 動画タイトル */}
                    <h1 className="text-2xl font-black text-gray-900 mb-4">
                        {video.title}
                    </h1>

                    {/* 動画メタ情報とアクション */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{formatViewCount(video.viewCount)}回視聴</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(video.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-colors duration-200">
                                <ThumbsUp className="w-4 h-4" />
                                いいね
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-colors duration-200">
                                <Share2 className="w-4 h-4" />
                                共有
                            </button>
                        </div>
                    </div>

                    {/* 動画説明 */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h2 className="font-bold text-gray-900 mb-2">説明</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {video.description || '説明はありません'}
                        </p>
                    </div>
                </div>

                {/* サイドバー（関連動画） */}
                <div className="w-[400px] flex-shrink-0">
                    {/* バナー広告 */}
                    <div className="mb-6">
                        <BannerAd />
                    </div>

                    {/* 関連動画 */}
                    <div>
                        <h2 className="font-bold text-gray-900 mb-4">関連動画</h2>
                        <RelatedVideos videos={relatedVideos} currentVideoId={video.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

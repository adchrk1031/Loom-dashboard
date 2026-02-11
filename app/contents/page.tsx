'use client';

import { useState, useEffect } from 'react';
import { Play, Eye, Calendar, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

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

// スケルトンローディングコンポーネント
function VideoCardSkeleton() {
    return (
        <div className="group">
            <div className="bg-white rounded-2xl overflow-hidden">
                {/* サムネイルスケルトン */}
                <div className="relative aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />

                {/* 情報スケルトン */}
                <div className="p-4 space-y-3">
                    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg w-3/4" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg w-1/2" />
                </div>
            </div>
        </div>
    );
}

export default function ContentsPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVisibility, setFilterVisibility] = useState<string>('ALL');

    useEffect(() => {
        // モックデータ（後でAPIから取得）
        const mockVideos: Video[] = [
            {
                id: '1',
                title: 'Loomプラットフォーム完全ガイド',
                description: 'Loomの使い方を徹底解説します',
                thumbnailUrl: 'https://placehold.co/640x360/6B8CAE/white?text=Video+1',
                viewCount: 1234,
                duration: 600,
                visibility: 'PUBLIC',
                createdAt: new Date().toISOString(),
            },
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
        ];

        // ローディングシミュレーション
        setTimeout(() => {
            setVideos(mockVideos);
            setLoading(false);
        }, 800);
    }, []);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViewCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '今日';
        if (diffDays === 1) return '昨日';
        if (diffDays < 7) return `${diffDays}日前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
        return `${Math.floor(diffDays / 30)}ヶ月前`;
    };

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterVisibility === 'ALL' || video.visibility === filterVisibility;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            {/* シマーアニメーション用CSS */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* ヘッダー */}
                <div className="mb-10 flex items-center justify-between">
                    <h1 className="page-title">
                        動画管理
                    </h1>
                    <Link
                        href="/contents/new"
                        className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        <Plus className="w-5 h-5" />
                        新しい動画を追加
                    </Link>
                </div>

                {/* 検索とフィルター */}
                <div className="mb-10 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="動画を検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-5 py-4 bg-white/80 backdrop-blur-md border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-300 ease-in-out font-semibold text-gray-800 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={filterVisibility}
                            onChange={(e) => setFilterVisibility(e.target.value)}
                            className="pl-14 pr-10 py-4 bg-white/80 backdrop-blur-md border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-300 ease-in-out appearance-none font-semibold text-gray-800"
                        >
                            <option value="ALL">すべて</option>
                            <option value="PUBLIC">公開</option>
                            <option value="UNLISTED">限定公開</option>
                            <option value="PRIVATE">非公開</option>
                        </select>
                    </div>
                </div>

                {/* 動画グリッド（YouTube Premium風） */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <VideoCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVideos.map((video) => (
                            <Link
                                key={video.id}
                                href={`/contents/${video.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2">
                                    {/* サムネイル */}
                                    <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                        {video.thumbnailUrl ? (
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <Play className="w-16 h-16 text-gray-400" />
                                            </div>
                                        )}
                                        {/* 再生時間 */}
                                        {video.duration && (
                                            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                                                {formatDuration(video.duration)}
                                            </div>
                                        )}
                                        {/* ホバーオーバーレイ */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 ease-out flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <Play className="w-16 h-16 text-white drop-shadow-2xl" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 動画情報 */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 text-base leading-snug">
                                            {video.title}
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <span>{formatViewCount(video.viewCount)}回視聴</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{formatDate(video.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {filteredVideos.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <Play className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-lg font-semibold text-gray-500">動画が見つかりませんでした</p>
                    </div>
                )}
            </div>
        </>
    );
}

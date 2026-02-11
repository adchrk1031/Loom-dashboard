'use client';

import { SlideOver } from '@/components/SlideOver';
import { Play, Eye, Clock } from 'lucide-react';
import Image from 'next/image';

interface VideoRanking {
    id: string;
    title: string;
    thumbnail: string;
    completionRate: number;
    views: number;
    avgWatchTime: string;
    tag?: string;
}

interface VideoRankingSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    videos: VideoRanking[];
    selectedTag?: string;
}

export default function VideoRankingSlideOver({
    isOpen,
    onClose,
    videos,
    selectedTag
}: VideoRankingSlideOverProps) {
    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={selectedTag ? `動画完了率ランキング（${selectedTag}）` : '動画完了率ランキング'}
        >
            <div className="space-y-4">
                {videos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        動画がありません
                    </div>
                ) : (
                    videos.map((video, index) => (
                        <div
                            key={video.id}
                            className="ios-card p-6 hover:shadow-xl transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                {/* ランキング番号 */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black ${index === 0
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                        : index === 1
                                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                            : index === 2
                                                ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>

                                {/* サムネイル */}
                                <div className="relative flex-shrink-0 w-32 h-[72px] rounded-xl overflow-hidden bg-gray-200">
                                    {video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* 動画情報 */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-black line-clamp-2 mb-2">
                                        {video.title}
                                    </h4>

                                    {/* タグ */}
                                    {video.tag && (
                                        <span className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium mb-2">
                                            {video.tag}
                                        </span>
                                    )}

                                    {/* 統計情報 */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <Play className="w-3 h-3" />
                                                <span>完了率</span>
                                            </div>
                                            <div className="text-lg font-black text-black">
                                                {video.completionRate}%
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <Eye className="w-3 h-3" />
                                                <span>視聴回数</span>
                                            </div>
                                            <div className="text-lg font-black text-black">
                                                {video.views.toLocaleString()}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <Clock className="w-3 h-3" />
                                                <span>平均視聴</span>
                                            </div>
                                            <div className="text-lg font-black text-black">
                                                {video.avgWatchTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </SlideOver>
    );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clock } from 'lucide-react';

interface RelatedVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
    uploadedAt: Date;
}

interface RelatedVideosListProps {
    videos: RelatedVideo[];
    onVideoClick: (videoId: string) => void;
}

export default function RelatedVideosList({ videos, onVideoClick }: RelatedVideosListProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-black text-black mb-4">Up Next</h3>

            {videos.map((video, index) => (
                <div key={video.id}>
                    <RelatedVideoCard video={video} onClick={() => onVideoClick(video.id)} />

                    {/* 広告枠プレースホルダー（3つおきに表示） */}
                    {(index + 1) % 3 === 0 && index !== videos.length - 1 && (
                        <AdPlaceholder />
                    )}
                </div>
            ))}
        </div>
    );
}

function RelatedVideoCard({ video, onClick }: { video: RelatedVideo; onClick: () => void }) {
    const formatViews = (views: number) => {
        if (views >= 10000) {
            return `${(views / 10000).toFixed(1)}万回視聴`;
        }
        return `${views.toLocaleString()}回視聴`;
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return '今日';
        if (days === 1) return '昨日';
        if (days < 7) return `${days}日前`;
        if (days < 30) return `${Math.floor(days / 7)}週間前`;
        if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
        return `${Math.floor(days / 365)}年前`;
    };

    return (
        <button
            onClick={onClick}
            className="w-full flex gap-3 p-2 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 group"
        >
            {/* サムネイル */}
            <div className="relative flex-shrink-0 w-40 h-[90px] rounded-xl overflow-hidden bg-gray-200">
                {video.thumbnail ? (
                    <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <Play className="w-8 h-8 text-white" />
                    </div>
                )}

                {/* 再生時間 */}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                    {video.duration}
                </div>
            </div>

            {/* 動画情報 */}
            <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-bold text-black line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {video.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{formatViews(video.views)}</span>
                    <span>•</span>
                    <span>{formatDate(video.uploadedAt)}</span>
                </div>
            </div>
        </button>
    );
}

function AdPlaceholder() {
    return (
        <div className="my-4 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <div className="text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    広告枠
                </p>
                <p className="text-xs text-gray-500">
                    ここにバナー広告を表示できます
                </p>
            </div>
        </div>
    );
}

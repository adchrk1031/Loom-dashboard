'use client';

import { Play, Clock } from 'lucide-react';
import Link from 'next/link';

interface RelatedVideo {
    id: string;
    title: string;
    thumbnailUrl?: string;
    duration?: number;
    viewCount: number;
    createdAt: string;
}

interface RelatedVideosProps {
    videos: RelatedVideo[];
    currentVideoId: string;
}

export default function RelatedVideos({ videos, currentVideoId }: RelatedVideosProps) {
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

    const filteredVideos = videos.filter((video) => video.id !== currentVideoId);

    return (
        <div className="space-y-3">
            {filteredVideos.map((video) => (
                <Link
                    key={video.id}
                    href={`/watch/${video.id}`}
                    className="flex gap-2 group hover:bg-gray-50 rounded-xl p-2 transition-colors duration-200"
                >
                    {/* サムネイル */}
                    <div className="relative w-40 flex-shrink-0">
                        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            {video.thumbnailUrl ? (
                                <img
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <Play className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            {/* 再生時間 */}
                            {video.duration && (
                                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/90 text-white text-xs font-bold rounded">
                                    {formatDuration(video.duration)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 動画情報 */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                            {video.title}
                        </h4>
                        <div className="text-xs text-gray-600 space-y-0.5">
                            <p>{formatViewCount(video.viewCount)}回視聴</p>
                            <p>{formatDate(video.createdAt)}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Eye, Calendar, Play, Lock } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    viewCount: number;
    duration?: number;
    visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
    allowedTags: string[];
    nextContentId?: string;
    createdAt: string;
}

interface RelatedVideo {
    id: string;
    title: string;
    thumbnailUrl?: string;
    viewCount: number;
    duration?: number;
    createdAt: string;
}

export default function PublicVideoPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = params.id as string;

    const [video, setVideo] = useState<Video | null>(null);
    const [nextVideo, setNextVideo] = useState<RelatedVideo | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(true);
    const [userTags, setUserTags] = useState<string[]>([]);
    const watchTimeRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // TODO: 実際のユーザーのタグを取得
        const mockUserTags = ['副業', '人材'];
        setUserTags(mockUserTags);

        const mockVideo: Video = {
            id: videoId,
            title: 'Loomプラットフォーム完全ガイド',
            description: 'Loomの使い方を徹底解説します。このビデオでは、基本的な機能から高度な使い方まで、すべてをカバーしています。',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: 'https://placehold.co/1280x720/6B8CAE/white?text=Video+Detail',
            viewCount: 1234,
            duration: 600,
            visibility: 'PUBLIC',
            allowedTags: [],
            nextContentId: '2',
            createdAt: new Date().toISOString(),
        };

        // アクセス権限チェック
        const checkAccess = () => {
            if (mockVideo.allowedTags.length === 0) return true;
            return mockVideo.allowedTags.some((tag) => mockUserTags.includes(tag));
        };

        setHasAccess(checkAccess());
        setVideo(mockVideo);

        // 次の動画
        if (mockVideo.nextContentId) {
            const mockNextVideo: RelatedVideo = {
                id: '2',
                title: 'マーケティング自動化の基礎',
                thumbnailUrl: 'https://placehold.co/320x180/8FA88E/white?text=Video+2',
                viewCount: 856,
                duration: 450,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            };
            setNextVideo(mockNextVideo);
        }

        // 関連動画
        const mockRelatedVideos: RelatedVideo[] = [
            {
                id: '3',
                title: 'LINE配信の最適化テクニック',
                thumbnailUrl: 'https://placehold.co/320x180/D4A574/white?text=Video+3',
                viewCount: 542,
                duration: 720,
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
            {
                id: '4',
                title: 'データ分析で成果を最大化',
                thumbnailUrl: 'https://placehold.co/320x180/B87C7C/white?text=Video+4',
                viewCount: 321,
                duration: 540,
                createdAt: new Date(Date.now() - 259200000).toISOString(),
            },
        ];
        setRelatedVideos(mockRelatedVideos);

        setLoading(false);
    }, [videoId]);

    // 視聴時間トラッキング
    useEffect(() => {
        if (!hasAccess || !video) return;

        intervalRef.current = setInterval(() => {
            watchTimeRef.current += 1;

            if (watchTimeRef.current % 10 === 0) {
                sendWatchTime();
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                sendWatchTime();
            }
        };
    }, [hasAccess, video]);

    const sendWatchTime = async () => {
        if (watchTimeRef.current === 0) return;

        try {
            await fetch('/api/videos/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId: video?.id,
                    watchTime: watchTimeRef.current,
                    userTags,
                }),
            });
        } catch (error) {
            console.error('Failed to track watch time:', error);
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-600">読み込み中...</div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center text-red-600">動画が見つかりませんでした</div>
            </div>
        );
    }

    // アクセス権限がない場合
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full glass-card p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <Lock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        この動画を視聴する権限がありません
                    </h1>
                    <p className="text-gray-600">
                        この動画は特定のタグを持つユーザーのみが視聴できます。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左側: プレイヤーと詳細 */}
                    <div className="lg:col-span-2">
                        {/* 動画プレイヤー */}
                        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-2xl">
                            <iframe
                                src={video.videoUrl}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>

                        {/* タイトルと統計 */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                            {video.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{formatViewCount(video.viewCount)}回視聴</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(video.createdAt)}</span>
                            </div>
                        </div>

                        {/* 説明 */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">概要</h2>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {video.description || '説明はありません'}
                            </p>
                        </div>
                    </div>

                    {/* 右側: 次に再生 & 関連動画 */}
                    <div className="lg:col-span-1">
                        {/* 次に再生 */}
                        {nextVideo && (
                            <div className="bg-white rounded-2xl p-5 mb-4 border-2 border-gray-100">
                                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-blue-600" />
                                    次に再生
                                </h2>
                                <button
                                    onClick={() => router.push(`/v/${nextVideo.id}`)}
                                    className="w-full text-left hover:bg-gray-50 p-2 rounded-xl transition-all duration-300 ease-in-out group hover:shadow-lg"
                                >
                                    <div className="aspect-video bg-gray-200 rounded-xl mb-3 relative overflow-hidden">
                                        <img
                                            src={nextVideo.thumbnailUrl}
                                            alt={nextVideo.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {nextVideo.duration && (
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                                                {formatDuration(nextVideo.duration)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-snug">
                                        {nextVideo.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {formatViewCount(nextVideo.viewCount)}回視聴 • {formatDate(nextVideo.createdAt)}
                                    </p>
                                </button>
                            </div>
                        )}

                        {/* 関連動画 */}
                        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                            <h2 className="text-base font-black text-gray-900 mb-4">関連動画</h2>
                            <div className="space-y-4">
                                {relatedVideos.map((relVideo) => (
                                    <button
                                        key={relVideo.id}
                                        onClick={() => router.push(`/v/${relVideo.id}`)}
                                        className="w-full flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all duration-300 ease-in-out group hover:shadow-lg"
                                    >
                                        <div className="w-44 aspect-video bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
                                            <img
                                                src={relVideo.thumbnailUrl}
                                                alt={relVideo.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {relVideo.duration && (
                                                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                                                    {formatDuration(relVideo.duration)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-snug">
                                                {relVideo.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {formatViewCount(relVideo.viewCount)}回視聴
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {formatDate(relVideo.createdAt)}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

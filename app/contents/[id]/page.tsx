'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Eye, Calendar, Share2, Code, Settings, Play, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';

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

export default function VideoDetailPage() {
    const params = useParams();
    const videoId = params.id as string;

    const [video, setVideo] = useState<Video | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEmbedCode, setShowEmbedCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasAccess, setHasAccess] = useState(true);
    const [userTags, setUserTags] = useState<string[]>([]);
    const watchTimeRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // モックデータ（後でAPIから取得）
        // TODO: 実際のユーザーのタグを取得
        const mockUserTags = ['副業', '人材']; // 仮のユーザータグ
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
            allowedTags: [], // 空の場合は全員アクセス可能
            createdAt: new Date().toISOString(),
        };

        // アクセス権限チェック
        const checkAccess = () => {
            // allowedTagsが空の場合は全員アクセス可能
            if (mockVideo.allowedTags.length === 0) return true;

            // ユーザーのタグとallowedTagsに共通のタグがあるかチェック
            return mockVideo.allowedTags.some((tag) => mockUserTags.includes(tag));
        };

        setHasAccess(checkAccess());
        setVideo(mockVideo);

        // 関連動画
        const mockRelatedVideos: RelatedVideo[] = [
            {
                id: '2',
                title: 'マーケティング自動化の基礎',
                thumbnailUrl: 'https://placehold.co/320x180/8FA88E/white?text=Video+2',
                viewCount: 856,
                duration: 450,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
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

        // 1秒ごとに視聴時間を記録
        intervalRef.current = setInterval(() => {
            watchTimeRef.current += 1;

            // 10秒ごとにサーバーに送信
            if (watchTimeRef.current % 10 === 0) {
                sendWatchTime();
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                // コンポーネントアンマウント時に最終的な視聴時間を送信
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
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getEmbedCode = () => {
        if (!video) return '';
        const baseUrl = window.location.origin;
        return `<iframe src="${baseUrl}/embed/${video.id}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
    };

    const copyEmbedCode = () => {
        navigator.clipboard.writeText(getEmbedCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getVisibilityLabel = (visibility: string) => {
        const labels = {
            PUBLIC: '公開',
            UNLISTED: '限定公開',
            PRIVATE: '非公開',
        };
        return labels[visibility as keyof typeof labels];
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="text-center text-gray-600">読み込み中...</div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="text-center text-red-600">動画が見つかりませんでした</div>
            </div>
        );
    }

    // アクセス権限がない場合のNotion風メッセージ
    if (!hasAccess) {
        return (
            <div className="max-w-4xl mx-auto px-8 py-24">
                <div className="glass-card p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <Lock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        この動画を視聴する権限がありません
                    </h1>
                    <p className="text-gray-600 mb-8">
                        この動画は特定のタグを持つユーザーのみが視聴できます。
                        {video.allowedTags.length > 0 && (
                            <>
                                <br />
                                必要なタグ: <span className="font-semibold">{video.allowedTags.join(', ')}</span>
                            </>
                        )}
                    </p>
                    <Link
                        href="/contents"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out"
                    >
                        動画一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側: プレイヤーと詳細 */}
                <div className="lg:col-span-2">
                    {/* 動画プレイヤー */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl">
                        <iframe
                            src={video.videoUrl}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>

                    {/* タイトルと統計 */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {video.title}
                    </h1>

                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                <span className="font-semibold">{formatViewCount(video.viewCount)}回視聴</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(video.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowEmbedCode(!showEmbedCode)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
                            >
                                <Code className="w-4 h-4" />
                                埋め込み
                            </button>
                            <Link
                                href={`/contents/${video.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
                            >
                                <Settings className="w-4 h-4" />
                                設定
                            </Link>
                        </div>
                    </div>

                    {/* 埋め込みコード */}
                    {showEmbedCode && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">埋め込みコード</h3>
                                <button
                                    onClick={copyEmbedCode}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
                                >
                                    {copied ? 'コピーしました！' : 'コピー'}
                                </button>
                            </div>
                            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
                                {getEmbedCode()}
                            </pre>
                        </div>
                    )}

                    {/* 説明 */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">説明</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {video.description || '説明はありません'}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-600">公開設定: </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {getVisibilityLabel(video.visibility)}
                                </span>
                            </div>
                            {video.allowedTags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">対象タグ:</span>
                                    <div className="flex gap-2">
                                        {video.allowedTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border-2 border-blue-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 右側: 統計と関連動画 */}
                <div className="lg:col-span-1">
                    {/* 統計データ */}
                    <div className="glass-card p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            統計データ
                        </h2>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">総視聴回数</p>
                            <p className="text-3xl font-bold text-blue-600">{video.viewCount}</p>
                        </div>
                    </div>

                    {/* 関連動画 */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">関連動画</h2>
                        <div className="space-y-4">
                            {relatedVideos.map((relVideo) => (
                                <Link
                                    key={relVideo.id}
                                    href={`/contents/${relVideo.id}`}
                                    className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-300 ease-in-out"
                                >
                                    <div className="w-40 aspect-video bg-gray-200 rounded-lg flex-shrink-0 relative">
                                        <img
                                            src={relVideo.thumbnailUrl}
                                            alt={relVideo.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        {relVideo.duration && (
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs font-semibold rounded">
                                                {formatDuration(relVideo.duration)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                            {relVideo.title}
                                        </h3>
                                        <p className="text-xs text-gray-600">{formatViewCount(relVideo.viewCount)}回視聴</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

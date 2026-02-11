'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Video, Zap, Clock, Tag, ExternalLink, Edit, AlertCircle, MessageSquare } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { SlideOver } from '@/components/SlideOver';
import { QuickSearchBar } from '@/components/QuickSearchBar';
import UserListModal from '@/components/UserListModal';
import VideoRankingSlideOver from '@/components/VideoRankingSlideOver';
import { useRouter } from 'next/navigation';

interface TodayUser {
    id: string;
    name: string;
    lineUserId: string;
    source: string | null;
    tags: string[];
    createdAt: string;
}

interface VideoRanking {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    duration: number | null;
    viewCount: number;
    completionRate: number;
    averageWatchTime: number;
    completionCount: number;
    viewerCount: number;
}

interface ActiveSequence {
    id: string;
    name: string;
    stepCount: number;
    targetCount: number;
    status: 'active';
    updatedAt: string;
}

interface AllUser {
    id: string;
    name: string;
    lineUserId: string;
    source: string | null;
    tags: string[];
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // モーダル・スライドオーバー状態
    const [showTodayUsers, setShowTodayUsers] = useState(false);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [showVideoRanking, setShowVideoRanking] = useState(false);

    // データ状態
    const [todayUsers, setTodayUsers] = useState<TodayUser[]>([]);
    const [allUsers, setAllUsers] = useState<AllUser[]>([]);
    const [videoRanking, setVideoRanking] = useState<VideoRanking[]>([]);
    const [activeSequences, setActiveSequences] = useState<ActiveSequence[]>([]);
    const [rankingSegment, setRankingSegment] = useState<'total' | 'tag'>('total');
    const [rankingTag, setRankingTag] = useState<string>('副業');

    // 検索・フィルター
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState<string>('all');

    // 統計データ
    const [stats, setStats] = useState({
        todayCount: 0,
        totalCount: 0,
        completionRate: 0,
        activeSequenceCount: 0,
    });

    // 未読数
    const [unreadCount, setUnreadCount] = useState(0);

    // 初期データ読み込み
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // 統計データを取得（モックデータ）
                setStats({
                    todayCount: 24,
                    totalCount: 1248,
                    completionRate: 68.5,
                    activeSequenceCount: 12,
                });

                // 実行中シーケンスを取得
                const seqResponse = await fetch('/api/sequences/active');
                const seqData = await seqResponse.json();
                setActiveSequences(seqData.sequences || []);

                // 未読数を取得
                const unreadResponse = await fetch('/api/messages/unread-count');
                const unreadData = await unreadResponse.json();
                setUnreadCount(unreadData.unreadCount || 0);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 本日の登録者を取得
    const fetchTodayUsers = async () => {
        try {
            const response = await fetch('/api/users/today');
            const data = await response.json();
            setTodayUsers(data.users || []);
            setShowTodayUsers(true);
        } catch (error) {
            console.error('Failed to fetch today users:', error);
        }
    };

    // 全ユーザーを取得
    const fetchAllUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setAllUsers(data.users || []);
            setShowAllUsers(true);
        } catch (error) {
            console.error('Failed to fetch all users:', error);
        }
    };

    // 動画ランキングを取得
    const fetchVideoRanking = async () => {
        try {
            const params = new URLSearchParams();
            params.append('segment', rankingSegment);
            if (rankingSegment === 'tag') {
                params.append('tag', rankingTag);
            }

            const response = await fetch(`/api/videos/ranking?${params.toString()}`);
            const data = await response.json();
            setVideoRanking(data.ranking || []);
            setShowVideoRanking(true);
        } catch (error) {
            console.error('Failed to fetch video ranking:', error);
        }
    };

    // フィルター済みユーザーリスト
    const filteredUsers = allUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lineUserId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = filterTag === 'all' || user.tags.includes(filterTag);
        return matchesSearch && matchesTag;
    });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP');
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* ページタイトルと検索バー */}
            <div className="mb-8 flex items-center justify-between gap-6">
                <h1 className="page-title">
                    ダッシュボード
                </h1>
                <QuickSearchBar />
            </div>

            {/* 未返信アラートカード */}
            {unreadCount > 0 && (
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/chat')}
                        className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 hover:shadow-lg hover:scale-102 transition-all duration-150 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 p-3 bg-red-500 rounded-2xl">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-lg font-black text-red-900">
                                    未返信のユーザー: {unreadCount}名
                                </h3>
                                <p className="text-sm text-red-700 mt-1">
                                    クリックしてチャット画面へ移動
                                </p>
                            </div>
                            <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
                        </div>
                    </button>
                </div>
            )}

            {/* KPIカードグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* 本日の登録者 */}
                <button
                    onClick={fetchTodayUsers}
                    className="ios-card p-8 text-left"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-blue-50 rounded-2xl">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        本日の登録者
                    </h3>
                    <p className="text-4xl font-black text-black">
                        {stats.todayCount}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">クリックで詳細表示</p>
                </button>

                {/* 総ユーザー数 */}
                <button
                    onClick={fetchAllUsers}
                    className="ios-card p-8 text-left"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-green-50 rounded-2xl">
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        総ユーザー数
                    </h3>
                    <p className="text-4xl font-black text-black">
                        {stats.totalCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">クリックで詳細表示</p>
                </button>

                {/* 動画完了率 */}
                <button
                    onClick={fetchVideoRanking}
                    className="ios-card p-8 text-left"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-purple-50 rounded-2xl">
                            <Video className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        動画完了率
                    </h3>
                    <p className="text-4xl font-black text-black">
                        {stats.completionRate}%
                    </p>
                    <p className="text-xs text-gray-400 mt-2">クリックでランキング表示</p>
                </button>

                {/* アクティブシーケンス */}
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-orange-50 rounded-2xl">
                            <Zap className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        アクティブシーケンス
                    </h3>
                    <p className="text-4xl font-black text-black">
                        {stats.activeSequenceCount}
                    </p>
                </div>
            </div>

            {/* 実行中シーケンス管理パネル */}
            <div className="mb-12">
                <h2 className="text-3xl font-black text-black mb-6">
                    実行中のシーケンス
                </h2>
                <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    シーケンス名
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    対象者数
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    ステップ数
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    最終更新
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        読み込み中...
                                    </td>
                                </tr>
                            ) : activeSequences.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        実行中のシーケンスはありません
                                    </td>
                                </tr>
                            ) : (
                                activeSequences.map((seq) => (
                                    <tr key={seq.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-black">{seq.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{seq.targetCount}人</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{seq.stepCount}ステップ</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{formatDate(seq.updatedAt)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => router.push(`/sequences/${seq.id}/edit`)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                                編集
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 本日の登録者モーダル */}
            <Modal
                isOpen={showTodayUsers}
                onClose={() => setShowTodayUsers(false)}
                title="本日の登録者"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">LINE名</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">登録時間</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">流入経路</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">タグ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {todayUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        本日の登録者はいません
                                    </td>
                                </tr>
                            ) : (
                                todayUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-4 py-3 text-sm font-medium text-black">{user.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatTime(user.createdAt)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.source || '不明'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {user.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>

            {/* 全ユーザースライドオーバー */}
            <SlideOver
                isOpen={showAllUsers}
                onClose={() => setShowAllUsers(false)}
                title="全ユーザー"
            >
                {/* 検索・フィルター */}
                <div className="mb-6 space-y-4">
                    <input
                        type="text"
                        placeholder="名前またはLINE IDで検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">全てのタグ</option>
                        <option value="副業">副業</option>
                        <option value="退職">退職</option>
                        <option value="人材">人材</option>
                        <option value="不動産">不動産</option>
                        <option value="物販">物販</option>
                    </select>
                </div>

                {/* ユーザーリスト */}
                <div className="space-y-3">
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">ユーザーが見つかりません</p>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-black">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.lineUserId}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                    <ExternalLink className="w-3 h-3" />
                                    {user.source || '不明'}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {user.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SlideOver>

            {/* 動画ランキングモーダル */}
            <Modal
                isOpen={showVideoRanking}
                onClose={() => setShowVideoRanking(false)}
                title="動画完走率ランキング"
            >
                {/* セグメント切り替え */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setRankingSegment('total')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${rankingSegment === 'total'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            総合
                        </button>
                        <button
                            onClick={() => setRankingSegment('tag')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${rankingSegment === 'tag'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            タグ別
                        </button>
                    </div>

                    {rankingSegment === 'tag' && (
                        <select
                            value={rankingTag}
                            onChange={(e) => setRankingTag(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="副業">副業</option>
                            <option value="退職">退職</option>
                            <option value="人材">人材</option>
                            <option value="不動産">不動産</option>
                            <option value="物販">物販</option>
                        </select>
                    )}

                    <button
                        onClick={fetchVideoRanking}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all duration-200"
                    >
                        更新
                    </button>
                </div>

                {/* ランキングリスト */}
                <div className="space-y-4">
                    {videoRanking.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">データがありません</p>
                    ) : (
                        videoRanking.map((video, index) => (
                            <div
                                key={video.id}
                                className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200"
                            >
                                {/* ランク */}
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 rounded-xl">
                                    <span className="text-xl font-black text-blue-600">#{index + 1}</span>
                                </div>

                                {/* サムネイル */}
                                {video.thumbnailUrl && (
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-32 h-18 object-cover rounded-lg"
                                    />
                                )}

                                {/* 情報 */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-black mb-1 truncate">{video.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                        <span>完走率: <span className="font-bold text-blue-600">{video.completionRate.toFixed(1)}%</span></span>
                                        <span>視聴回数: {video.viewCount}</span>
                                        <span>平均視聴: {formatDuration(video.averageWatchTime)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
}

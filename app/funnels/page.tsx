'use client';

import { useState } from 'react';
import { mockFunnels, type Funnel } from '@/lib/mockData';
import { Plus, ExternalLink, Edit, Eye, Power, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import CopyUrlButton from '@/components/CopyUrlButton';

export default function FunnelsPage() {
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="page-title">
                    LP作成
                </h1>
                <div className="flex items-center gap-3">
                    {/* ビュー切り替え */}
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-lg transition-all duration-150 active:scale-95 ${viewMode === 'card'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            title="カードビュー"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all duration-150 active:scale-95 ${viewMode === 'list'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            title="リストビュー"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    <button className="ios-button px-6 py-3 bg-blue-600 text-white flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        新規LP作成
                    </button>
                </div>
            </div>

            {/* カードビュー */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockFunnels.map((funnel) => (
                        <FunnelCard key={funnel.id} funnel={funnel} />
                    ))}
                </div>
            )}

            {/* リストビュー */}
            {viewMode === 'list' && (
                <div className="ios-card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    LP名
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    ステータス
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    作成日
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    アクセス数
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    成約率
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    アクション
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockFunnels.map((funnel) => (
                                <FunnelRow key={funnel.id} funnel={funnel} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function FunnelCard({ funnel }: { funnel: Funnel }) {
    const [isActive, setIsActive] = useState(funnel.isPublished);

    const handleToggleActive = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(!isActive);
        // TODO: API呼び出し
    };

    const handlePreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`/p/${funnel.slug}`, '_blank');
    };

    return (
        <div className="ios-card p-6">
            {/* ヘッダー */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-black mb-2 line-clamp-2">
                        {funnel.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                        作成日: {funnel.createdAt.toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                {/* アクティブ/非アクティブ切り替え */}
                <button
                    onClick={handleToggleActive}
                    className={`flex-shrink-0 ml-3 p-2 rounded-xl transition-all duration-200 active:scale-95 ${isActive
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    title={isActive ? '公開中' : '非公開'}
                >
                    <Power className="w-5 h-5" />
                </button>
            </div>

            {/* ステータスバッジ */}
            <div className="flex items-center gap-2 mb-4">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {isActive ? '✓ 公開中' : '● 非公開'}
                </span>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div>
                    <p className="text-xs text-gray-500 mb-1">アクセス数</p>
                    <p className="text-xl font-black text-black">
                        {funnel.viewCount.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">成約率</p>
                    <p className="text-xl font-black text-black">
                        {funnel.conversionRate}%
                    </p>
                </div>
            </div>

            {/* アクションボタン */}
            <div className="grid grid-cols-3 gap-2">
                <Link href={`/funnels/${funnel.id}/edit`} className="block" onClick={(e) => e.stopPropagation()}>
                    <button className="w-full ios-button px-4 py-2.5 bg-blue-50 text-blue-600 flex items-center justify-center gap-2 text-sm font-semibold">
                        <Edit className="w-4 h-4" />
                        編集
                    </button>
                </Link>

                <button
                    onClick={handlePreview}
                    className="ios-button px-4 py-2.5 bg-gray-100 text-gray-700 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                    <Eye className="w-4 h-4" />
                    プレビュー
                </button>

                <CopyUrlButton
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${funnel.slug}`}
                    className="ios-button px-4 py-2.5 bg-gray-100 text-gray-700 flex items-center justify-center gap-2 text-sm font-semibold"
                />
            </div>
        </div>
    );
}

function FunnelRow({ funnel }: { funnel: Funnel }) {
    const [isActive, setIsActive] = useState(funnel.isPublished);

    const handleToggleActive = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(!isActive);
        // TODO: API呼び出し
    };

    const handlePreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`/p/${funnel.slug}`, '_blank');
    };

    return (
        <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4">
                <span className="text-sm font-semibold text-black">
                    {funnel.name}
                </span>
            </td>
            <td className="py-4 px-4">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {isActive ? '公開中' : '非公開'}
                </span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                    {funnel.createdAt.toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-black">
                    {funnel.viewCount.toLocaleString()}
                </span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-black">
                    {funnel.conversionRate}%
                </span>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <Link href={`/funnels/${funnel.id}/edit`} onClick={(e) => e.stopPropagation()}>
                        <button className="ios-button px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            編集
                        </button>
                    </Link>
                    <button
                        onClick={handlePreview}
                        className="ios-button px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold flex items-center gap-1"
                    >
                        <Eye className="w-3 h-3" />
                        プレビュー
                    </button>
                    <button
                        onClick={handleToggleActive}
                        className={`ios-button p-1.5 rounded-lg ${isActive
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                        title={isActive ? '公開中' : '非公開'}
                    >
                        <Power className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

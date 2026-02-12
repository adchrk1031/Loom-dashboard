'use client';

import { useState } from 'react';
import { Plus, Send, Users, Calendar, Tag, LayoutGrid, List } from 'lucide-react';

export default function SequencesPage() {
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [sequences] = useState([
        {
            id: '1',
            name: '副業セミナー誘導シーケンス',
            targetCount: 150,
            stepCount: 5,
            completionRate: 68,
            lastUpdated: new Date('2024-01-15'),
            isActive: true,
        },
        {
            id: '2',
            name: '不動産投資セミナー誘導',
            targetCount: 89,
            stepCount: 4,
            completionRate: 72,
            lastUpdated: new Date('2024-01-14'),
            isActive: true,
        },
        {
            id: '3',
            name: 'フォローアップシーケンス',
            targetCount: 200,
            stepCount: 3,
            completionRate: 45,
            lastUpdated: new Date('2024-01-10'),
            isActive: false,
        },
    ]);

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="page-title">
                    LINE配信
                </h1>
                <div className="flex items-center gap-3">
                    {/* ビュー切り替え */}
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${viewMode === 'card'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            title="カードビュー"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${viewMode === 'list'
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
                        新規シーケンス作成
                    </button>
                </div>
            </div>

            {/* カードビュー */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sequences.map((seq) => (
                        <div key={seq.id} className="ios-card p-6">
                            {/* ヘッダー */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0">
                                        <Send className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-black line-clamp-2">
                                        {seq.name}
                                    </h3>
                                </div>
                            </div>

                            {/* ステータスバッジ */}
                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${seq.isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {seq.isActive ? '✓ 稼働中' : '● 停止中'}
                                </span>
                            </div>

                            {/* 統計情報 */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <Users className="w-3 h-3" />
                                        <span>対象者数</span>
                                    </div>
                                    <p className="text-xl font-black text-black">
                                        {seq.targetCount}人
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                        <Tag className="w-3 h-3" />
                                        <span>ステップ数</span>
                                    </div>
                                    <p className="text-xl font-black text-black">
                                        {seq.stepCount}
                                    </p>
                                </div>
                            </div>

                            {/* 完了率 */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">完了率</span>
                                    <span className="text-sm font-black text-black">
                                        {seq.completionRate}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${seq.completionRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* 最終更新 */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    最終更新: {seq.lastUpdated.toLocaleDateString('ja-JP', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>

                            {/* アクションボタン */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 編集画面へ遷移
                                }}
                                className="w-full ios-button px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold"
                            >
                                編集
                            </button>
                        </div>
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
                                    シーケンス名
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    ステータス
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    対象者数
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    ステップ数
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    完了率
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    最終更新
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    アクション
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sequences.map((seq) => (
                                <tr key={seq.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-xl">
                                                <Send className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-black">
                                                {seq.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${seq.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {seq.isActive ? '稼働中' : '停止中'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-700">
                                            {seq.targetCount}人
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-700">
                                            {seq.stepCount}ステップ
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${seq.completionRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-black">
                                                {seq.completionRate}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600">
                                            {seq.lastUpdated.toLocaleDateString('ja-JP', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 編集画面へ遷移
                                            }}
                                            className="ios-button px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold"
                                        >
                                            編集
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

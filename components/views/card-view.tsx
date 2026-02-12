'use client';

import { Edit, ExternalLink, Calendar, Tag } from 'lucide-react';

interface CardItem {
    id: string;
    title: string;
    description?: string;
    status?: string;
    date?: string;
    tags?: string[];
    thumbnail?: string;
    [key: string]: any;
}

interface CardViewProps {
    items: CardItem[];
    onEdit?: (id: string) => void;
    onView?: (id: string) => void;
}

export default function CardView({ items, onEdit, onView }: CardViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                    データがありません
                </div>
            ) : (
                items.map((item) => (
                    <div
                        key={item.id}
                        className="ios-card p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                        onClick={() => onView && onView(item.id)}
                    >
                        {/* サムネイル */}
                        {item.thumbnail && (
                            <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        )}

                        {/* ステータスバッジ */}
                        {item.status && (
                            <div className="mb-3">
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'active' || item.status === '公開中'
                                            ? 'bg-green-100 text-green-800'
                                            : item.status === 'draft' || item.status === '下書き'
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                        )}

                        {/* タイトル */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                        </h3>

                        {/* 説明 */}
                        {item.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {item.description}
                            </p>
                        )}

                        {/* メタ情報 */}
                        <div className="space-y-2 mb-4">
                            {item.date && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(item.date).toLocaleDateString('ja-JP')}
                                </div>
                            )}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    <div className="flex flex-wrap gap-1">
                                        {item.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {item.tags.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                +{item.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                            {onView && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(item.id);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 font-semibold text-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    表示
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(item.id);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors duration-200 font-semibold text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    編集
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

'use client';

import { Edit, ExternalLink, Calendar, Tag } from 'lucide-react';

interface ListItem {
    id: string;
    title: string;
    description?: string;
    status?: string;
    date?: string;
    tags?: string[];
    [key: string]: any;
}

interface ListViewProps {
    items: ListItem[];
    onEdit?: (id: string) => void;
    onView?: (id: string) => void;
}

export default function ListView({ items, onEdit, onView }: ListViewProps) {
    return (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            タイトル
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            ステータス
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            日付
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            タグ
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                            操作
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                データがありません
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.title}</p>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.status && (
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
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {item.date && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.date).toLocaleDateString('ja-JP')}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Tag className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {item.tags.slice(0, 2).join(', ')}
                                                {item.tags.length > 2 && ` +${item.tags.length - 2}`}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(item.id);
                                                }}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(item.id);
                                                }}
                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

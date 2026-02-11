'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    name: string;
    lineUserId: string;
    tags: string[];
}

export function QuickSearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // デバウンス処理
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.users || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // 外側クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectUser = (userId: string) => {
        router.push(`/chat?u=${userId}`);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            {/* 検索バー */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ユーザー名、LINE ID、タグで検索..."
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 text-sm font-medium"
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* 検索結果ドロップダウン */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="max-h-96 overflow-y-auto">
                        {results.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user.id)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 text-left border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-black truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.lineUserId}</p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {user.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 検索結果なし */}
            {isOpen && !loading && query.trim() && results.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-6 text-center z-50">
                    <p className="text-sm text-gray-500">該当するユーザーが見つかりませんでした</p>
                </div>
            )}
        </div>
    );
}

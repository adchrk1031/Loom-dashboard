'use client';

import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
    view: 'card' | 'list';
    onChange: (view: 'card' | 'list') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
                onClick={() => onChange('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${view === 'card'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <LayoutGrid className="w-4 h-4" />
                カード
            </button>
            <button
                onClick={() => onChange('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${view === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <List className="w-4 h-4" />
                リスト
            </button>
        </div>
    );
}

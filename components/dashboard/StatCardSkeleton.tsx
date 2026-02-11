import React from 'react';

export default function StatCardSkeleton() {
    return (
        <div className="notion-card">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    {/* タイトル */}
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

                    {/* 値 */}
                    <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />

                    {/* 説明 */}
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* アイコン */}
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

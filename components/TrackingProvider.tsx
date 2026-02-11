'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * 流入経路トラッキングプロバイダー
 * URLパラメータ（?ref=insta など）を検出し、LocalStorageに保存
 */
export default function TrackingProvider({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        // URLパラメータから ref を取得
        const ref = searchParams?.get('ref');

        if (ref) {
            // LocalStorageに保存（7日間有効）
            const trackingData = {
                source: ref,
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };

            localStorage.setItem('loom_tracking', JSON.stringify(trackingData));
            console.log('流入経路を記録:', ref);
        }
    }, [searchParams]);

    return <>{children}</>;
}

/**
 * 保存された流入経路を取得
 */
export function getTrackingSource(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const data = localStorage.getItem('loom_tracking');
        if (!data) return null;

        const tracking = JSON.parse(data);

        // 有効期限チェック
        if (new Date(tracking.expiresAt) < new Date()) {
            localStorage.removeItem('loom_tracking');
            return null;
        }

        return tracking.source;
    } catch (error) {
        console.error('トラッキングデータの取得エラー:', error);
        return null;
    }
}

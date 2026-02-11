'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    Video,
    Send,
    Users,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    {
        name: 'ダッシュボード',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'チャット',
        href: '/chat',
        icon: MessageSquare,
        showBadge: true,
    },
    {
        name: 'LP作成',
        href: '/funnels',
        icon: FileText,
    },
    {
        name: '動画管理',
        href: '/contents',
        icon: Video,
    },
    {
        name: 'LINE配信',
        href: '/sequences',
        icon: Send,
    },
    {
        name: 'データ分析',
        href: '/analytics',
        icon: Users,
    },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    // 未読数を取得
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/api/messages/unread-count');
                const data = await response.json();
                setUnreadCount(data.unreadCount || 0);
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        };

        fetchUnreadCount();
        // 30秒ごとに更新
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-border flex flex-col shadow-lg">
            {/* ロゴ・ヘッダー */}
            <div className="p-6 border-b border-border flex items-center justify-center">
                <img src="/loom-logo.png" alt="Loom" className="h-10 w-auto" />
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative',
                                isActive
                                    ? 'bg-background-alt text-text-primary'
                                    : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>

                            {/* 未読バッジ */}
                            {item.showBadge && unreadCount > 0 && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* フッター */}
            <div className="p-4 border-t border-border">
                <p className="text-xs text-text-secondary text-center">
                    © 2026 Loom
                </p>
            </div>
        </aside>
    );
}

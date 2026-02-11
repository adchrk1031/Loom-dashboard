'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Video, Zap, BarChart3 } from 'lucide-react';

export default function BottomNavigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: Home, label: 'ホーム' },
        { href: '/chat', icon: Users, label: 'チャット' },
        { href: '/contents', icon: Video, label: 'コンテンツ' },
        { href: '/sequences', icon: Zap, label: 'シーケンス' },
        { href: '/analytics', icon: BarChart3, label: '分析' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 active:scale-[0.98] ${isActive
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className={`text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

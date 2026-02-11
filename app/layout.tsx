import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/layout/AppSidebar";
import BottomNavigation from "@/components/BottomNavigation";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "Loom",
    description: "次世代マーケティングプラットフォーム",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${inter.variable} font-sans antialiased`}>
                <div className="flex h-screen overflow-hidden">
                    {/* サイドバー */}
                    <AppSidebar />

                    {/* メインコンテンツ */}
                    <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                        {children}
                    </main>
                </div>

                {/* モバイル用ボトムナビゲーション */}
                <BottomNavigation />
            </body>
        </html>
    );
}

import AppSidebar from "@/components/layout/AppSidebar";
import BottomNavigation from "@/components/BottomNavigation";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* サイドバー */}
            <AppSidebar />

            {/* メインコンテンツ */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
            </main>

            {/* モバイル用ボトムナビゲーション */}
            <BottomNavigation />
        </div>
    );
}

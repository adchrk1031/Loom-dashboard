import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    // Supabaseセッションを更新
    const response = await updateSession(request);

    // 保護されたルートのリスト
    const protectedRoutes = ['/dashboard', '/chat', '/contents', '/funnels', '/sequences', '/analytics'];

    // 現在のパスが保護されたルートかチェック
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // 保護されたルートの場合、認証をチェック
    if (isProtectedRoute) {
        const supabaseResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
            {
                headers: {
                    Authorization: request.cookies.get('sb-access-token')?.value
                        ? `Bearer ${request.cookies.get('sb-access-token')?.value}`
                        : '',
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                },
            }
        );

        // 認証されていない場合、ログインページにリダイレクト
        if (!supabaseResponse.ok) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return Response.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError('メールアドレスまたはパスワードが正しくありません');
                setLoading(false);
                return;
            }

            // ログイン成功
            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError('ログインに失敗しました。もう一度お試しください。');
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError('新規登録に失敗しました: ' + error.message);
                setLoading(false);
                return;
            }

            // 新規登録成功
            alert('新規登録が完了しました！ログインしてください。');
            setMode('login');
            setLoading(false);
        } catch (err) {
            setError('新規登録に失敗しました。もう一度お試しください。');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            {/* ログインカード */}
            <div className="w-full max-w-md">
                {/* ロゴ */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Loom</h1>
                    <p className="text-gray-500 text-sm">次世代マーケティングプラットフォーム</p>
                </div>

                {/* カード */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
                    {/* タブ切り替え */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${mode === 'login'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            ログイン
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${mode === 'signup'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            新規登録
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {mode === 'login' ? 'ログイン' : '新規登録'}
                    </h2>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
                        {/* メールアドレス */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* パスワード */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                パスワード
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* 送信ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'login'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                }`}
                        >
                            {loading ? (mode === 'login' ? 'ログイン中...' : '登録中...') : (mode === 'login' ? 'ログイン' : '新規登録')}
                        </button>
                    </form>

                    {/* 管理者ログイン情報 */}
                    {mode === 'login' && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <p className="text-xs font-semibold text-blue-900 mb-2">📋 管理者ログイン情報</p>
                            <p className="text-xs text-blue-800 font-mono">
                                <span className="font-semibold">メール:</span> admin@loom.com<br />
                                <span className="font-semibold">パスワード:</span> LoomAdmin2026!
                            </p>
                        </div>
                    )}
                </div>

                {/* フッター */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2026 Loom. All rights reserved.
                </p>
            </div>
        </div>
    );
}

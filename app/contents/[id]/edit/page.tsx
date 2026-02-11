'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function VideoEditPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = params.id as string;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'UNLISTED' | 'PRIVATE'>('PRIVATE');
    const [allowedTags, setAllowedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // モックデータ（後でAPIから取得）
        setTitle('Loomプラットフォーム完全ガイド');
        setDescription('Loomの使い方を徹底解説します');
        setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
        setThumbnailUrl('https://placehold.co/1280x720/6B8CAE/white?text=Video');
        setVisibility('PUBLIC');
        setAllowedTags(['副業', '人材']); // 例: 副業と人材タグのみ
        setLoading(false);
    }, [videoId]);

    const handleTagToggle = (tag: string) => {
        setAllowedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO: APIにPOST
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSaving(false);
        alert('保存しました！');
    };

    const handleDelete = async () => {
        if (!confirm('本当にこの動画を削除しますか？')) return;
        // TODO: APIにDELETE
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push('/contents');
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="text-center text-gray-600">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            {/* ヘッダー */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/contents/${videoId}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">
                        動画設定
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 ease-in-out"
                    >
                        <Trash2 className="w-4 h-4" />
                        削除
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? '保存中...' : '保存'}
                    </button>
                </div>
            </div>

            {/* フォーム */}
            <div className="space-y-6">
                {/* タイトル */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        タイトル
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                        placeholder="動画のタイトルを入力..."
                    />
                </div>

                {/* 説明 */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        説明
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out resize-none"
                        placeholder="動画の説明を入力..."
                    />
                </div>

                {/* 動画URL */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        動画URL
                    </label>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                        placeholder="https://www.youtube.com/embed/..."
                    />
                </div>

                {/* サムネイルURL */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        サムネイルURL
                    </label>
                    <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                        placeholder="https://..."
                    />
                    {thumbnailUrl && (
                        <div className="mt-4">
                            <img
                                src={thumbnailUrl}
                                alt="サムネイルプレビュー"
                                className="w-full max-w-md rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>

                {/* 公開設定 */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        公開設定
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                            <input
                                type="radio"
                                name="visibility"
                                value="PUBLIC"
                                checked={visibility === 'PUBLIC'}
                                onChange={(e) => setVisibility(e.target.value as any)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">公開</p>
                                <p className="text-sm text-gray-600">誰でも視聴できます</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                            <input
                                type="radio"
                                name="visibility"
                                value="UNLISTED"
                                checked={visibility === 'UNLISTED'}
                                onChange={(e) => setVisibility(e.target.value as any)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">限定公開</p>
                                <p className="text-sm text-gray-600">URLを知っている人のみ視聴できます</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                            <input
                                type="radio"
                                name="visibility"
                                value="PRIVATE"
                                checked={visibility === 'PRIVATE'}
                                onChange={(e) => setVisibility(e.target.value as any)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">非公開</p>
                                <p className="text-sm text-gray-600">自分のみ視聴できます</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 公開対象タグ設定 */}
                <div className="glass-card p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        公開対象タグ
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                        特定のタグを持つユーザーのみに動画を公開できます。何も選択しない場合は全員が視聴できます。
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['副業', '退職', '人材', '不動産', '物販', '未分類'].map((tag) => (
                            <label
                                key={tag}
                                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${allowedTags.includes(tag)
                                        ? 'bg-blue-50 border-blue-500'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={allowedTags.includes(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

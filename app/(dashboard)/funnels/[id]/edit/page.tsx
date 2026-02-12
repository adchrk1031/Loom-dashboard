'use client';

import React from 'react';
import { EditorProvider } from '@/lib/editorContext';
import { useEditor } from '@/lib/editorContext';
import EditorSidebar from '@/components/editor/EditorSidebar';
import BlockList from '@/components/editor/BlockList';
import { Save, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { PublishedData } from '@/types/editor';

function EditorContent() {
    const { state, selectBlock, updateBlock, reorderBlocks, saveData } = useEditor();
    const router = useRouter();

    const handleSave = async () => {
        await saveData();
        alert('保存しました！');
    };

    return (
        <div className="h-screen flex flex-col">
            {/* ヘッダー */}
            <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background">
                <div>
                    <h1 className="text-lg font-semibold text-text-primary">LPエディタ</h1>
                    <p className="text-xs text-text-secondary">
                        {state.isDirty ? '未保存の変更があります' : '保存済み'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/funnels')}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-background-alt transition-colors flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        プレビュー
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!state.isDirty}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${state.isDirty
                            ? 'bg-accent text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Save className="w-4 h-4" />
                        保存する
                    </button>
                </div>
            </div>

            {/* メインエリア */}
            <div className="flex-1 flex overflow-hidden">
                {/* 左パネル: パーツ設定 */}
                <EditorSidebar />

                {/* 右パネル: プレビュー */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                        <BlockList
                            blocks={state.blocks}
                            selectedBlockId={state.selectedBlockId}
                            onSelectBlock={selectBlock}
                            onUpdateBlock={updateBlock}
                            onReorderBlocks={reorderBlocks}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditorPage() {
    const params = useParams();
    const funnelId = params?.id as string;
    const [initialData, setInitialData] = React.useState<PublishedData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadFunnelData() {
            try {
                const response = await fetch(`/api/funnels/${funnelId}`);
                if (response.ok) {
                    const data = await response.json();
                    setInitialData(data.publishedData || { version: '1.0', blocks: [] });
                } else {
                    setInitialData({ version: '1.0', blocks: [] });
                }
            } catch (error) {
                console.error('Failed to load funnel data:', error);
                setInitialData({ version: '1.0', blocks: [] });
            } finally {
                setLoading(false);
            }
        }

        loadFunnelData();
    }, [funnelId]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-text-secondary">読み込み中...</p>
            </div>
        );
    }

    return (
        <EditorProvider funnelId={funnelId} initialData={initialData || undefined}>
            <EditorContent />
        </EditorProvider>
    );
}

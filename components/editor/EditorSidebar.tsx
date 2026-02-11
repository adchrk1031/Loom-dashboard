'use client';

import React from 'react';
import { useEditor } from '@/lib/editorContext';
import { Heading, Video, Square, Trash2, Image, Code } from 'lucide-react';
import type { Block, HeadingBlock, VideoBlock, ButtonBlock, ImageBlock, CodeBlock } from '@/types/editor';

export default function EditorSidebar() {
    const { state, addBlock, updateBlock, deleteBlock } = useEditor();
    const selectedBlock = state.blocks.find((b) => b.id === state.selectedBlockId);

    const createBlock = (type: Block['type']): Block => {
        const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const order = state.blocks.length;

        switch (type) {
            case 'heading':
                return {
                    id,
                    type: 'heading',
                    order,
                    props: { text: '新しい見出し', level: 2, align: 'left' },
                } as HeadingBlock;
            case 'video':
                return {
                    id,
                    type: 'video',
                    order,
                    props: { url: '', title: '', aspectRatio: '16:9' },
                } as VideoBlock;
            case 'button':
                return {
                    id,
                    type: 'button',
                    order,
                    props: { text: 'クリック', url: '', variant: 'primary', size: 'md' },
                } as ButtonBlock;
            case 'image':
                return {
                    id,
                    type: 'image',
                    order,
                    content: { imageUrl: '', caption: '' },
                } as ImageBlock;
            case 'code':
                return {
                    id,
                    type: 'code',
                    order,
                    content: { code: '', language: 'javascript' },
                } as CodeBlock;
        }
    };

    return (
        <div className="w-80 border-r border-border bg-background h-full overflow-y-auto">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">パーツ設定</h2>

                {/* ブロック追加ボタン */}
                <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-text-secondary mb-2">ブロックを追加</p>
                    <button
                        onClick={() => addBlock(createBlock('heading'))}
                        className="w-full px-4 py-3 bg-background-alt hover:bg-gray-200 rounded-lg flex items-center gap-3 transition-colors"
                    >
                        <Heading className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium">見出し</span>
                    </button>
                    <button
                        onClick={() => addBlock(createBlock('video'))}
                        className="w-full px-4 py-3 bg-background-alt hover:bg-gray-200 rounded-lg flex items-center gap-3 transition-colors"
                    >
                        <Video className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium">動画</span>
                    </button>
                    <button
                        onClick={() => addBlock(createBlock('button'))}
                        className="w-full px-4 py-3 bg-background-alt hover:bg-gray-200 rounded-lg flex items-center gap-3 transition-colors"
                    >
                        <Square className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium">ボタン</span>
                    </button>
                    <button
                        onClick={() => addBlock(createBlock('image'))}
                        className="w-full px-4 py-3 bg-background-alt hover:bg-gray-200 rounded-lg flex items-center gap-3 transition-colors"
                    >
                        <Image className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium">画像</span>
                    </button>
                    <button
                        onClick={() => addBlock(createBlock('code'))}
                        className="w-full px-4 py-3 bg-background-alt hover:bg-gray-200 rounded-lg flex items-center gap-3 transition-colors"
                    >
                        <Code className="w-5 h-5 text-text-secondary" />
                        <span className="text-sm font-medium">コード</span>
                    </button>
                </div>

                {/* 選択中のブロック設定 */}
                {selectedBlock && (
                    <div className="border-t border-border pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-text-primary">ブロック設定</h3>
                            <button
                                onClick={() => deleteBlock(selectedBlock.id)}
                                className="p-2 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>

                        {selectedBlock.type === 'heading' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        テキスト
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBlock.props.text}
                                        onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        レベル
                                    </label>
                                    <select
                                        value={selectedBlock.props.level}
                                        onChange={(e) =>
                                            updateBlock(selectedBlock.id, { level: Number(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    >
                                        <option value={1}>H1</option>
                                        <option value={2}>H2</option>
                                        <option value={3}>H3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        配置
                                    </label>
                                    <select
                                        value={selectedBlock.props.align}
                                        onChange={(e) =>
                                            updateBlock(selectedBlock.id, { align: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    >
                                        <option value="left">左寄せ</option>
                                        <option value="center">中央</option>
                                        <option value="right">右寄せ</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {selectedBlock.type === 'video' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        動画URL
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBlock.props.url}
                                        onChange={(e) => updateBlock(selectedBlock.id, { url: e.target.value })}
                                        placeholder="https://www.youtube.com/embed/..."
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        タイトル
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBlock.props.title}
                                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        アスペクト比
                                    </label>
                                    <select
                                        value={selectedBlock.props.aspectRatio}
                                        onChange={(e) =>
                                            updateBlock(selectedBlock.id, { aspectRatio: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    >
                                        <option value="16:9">16:9</option>
                                        <option value="4:3">4:3</option>
                                        <option value="1:1">1:1</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {selectedBlock.type === 'button' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        ボタンテキスト
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBlock.props.text}
                                        onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        リンクURL
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBlock.props.url}
                                        onChange={(e) => updateBlock(selectedBlock.id, { url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        スタイル
                                    </label>
                                    <select
                                        value={selectedBlock.props.variant}
                                        onChange={(e) =>
                                            updateBlock(selectedBlock.id, { variant: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    >
                                        <option value="primary">プライマリ</option>
                                        <option value="secondary">セカンダリ</option>
                                        <option value="outline">アウトライン</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-2">
                                        サイズ
                                    </label>
                                    <select
                                        value={selectedBlock.props.size}
                                        onChange={(e) =>
                                            updateBlock(selectedBlock.id, { size: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                    >
                                        <option value="sm">小</option>
                                        <option value="md">中</option>
                                        <option value="lg">大</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

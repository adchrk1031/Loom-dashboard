'use client';

import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { Block } from '@/types/editor';

interface ImageBlockComponentProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    onDelete: (id: string) => void;
}

export default function ImageBlockComponent({
    block,
    onUpdate,
    onDelete,
}: ImageBlockComponentProps) {
    const [imageUrl, setImageUrl] = useState(
        block.type === 'image' ? block.content?.imageUrl || '' : ''
    );
    const [caption, setCaption] = useState(
        block.type === 'image' ? block.content?.caption || '' : ''
    );
    const [isEditing, setIsEditing] = useState(
        block.type === 'image' ? !block.content?.imageUrl : true
    );

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (block.type === 'image') {
            onUpdate(block.id, {
                content: {
                    ...block.content,
                    imageUrl: url,
                    caption,
                },
            } as any);
        }
    };

    const handleCaptionChange = (text: string) => {
        setCaption(text);
        if (block.type === 'image') {
            onUpdate(block.id, {
                content: {
                    ...block.content,
                    imageUrl,
                    caption: text,
                },
            } as any);
        }
    };

    return (
        <div className="group relative">
            {/* 削除ボタン */}
            <button
                onClick={() => onDelete(block.id)}
                className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 z-10"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-all duration-300 ease-in-out">
                {!imageUrl || isEditing ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <ImageIcon className="w-6 h-6" />
                            <span className="font-medium">画像を追加</span>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="画像URLを入力..."
                                value={imageUrl}
                                onChange={(e) => handleImageUrlChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                            />

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Upload className="w-4 h-4" />
                                <span>または、画像URLを貼り付けてください</span>
                            </div>
                        </div>

                        {imageUrl && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
                            >
                                確定
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="relative group/image">
                            <img
                                src={imageUrl}
                                alt={caption || '画像'}
                                className="w-full rounded-lg shadow-md"
                                onError={() => setIsEditing(true)}
                            />
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium hover:bg-gray-50"
                            >
                                編集
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="キャプションを追加..."
                            value={caption}
                            onChange={(e) => handleCaptionChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm text-gray-600 border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { Code, X } from 'lucide-react';
import { useState } from 'react';
import type { Block } from '@/types/editor';

interface CodeBlockComponentProps {
    block: Block;
    onUpdate: (id: string, updates: Partial<Block>) => void;
    onDelete: (id: string) => void;
}

export default function CodeBlockComponent({
    block,
    onUpdate,
    onDelete,
}: CodeBlockComponentProps) {
    const [code, setCode] = useState(
        block.type === 'code' ? block.content?.code || '' : ''
    );
    const [language, setLanguage] = useState(
        block.type === 'code' ? block.content?.language || 'javascript' : 'javascript'
    );

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (block.type === 'code') {
            onUpdate(block.id, {
                content: {
                    ...block.content,
                    code: newCode,
                    language,
                },
            } as any);
        }
    };

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        if (block.type === 'code') {
            onUpdate(block.id, {
                content: {
                    ...block.content,
                    code,
                    language: newLanguage,
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

            <div className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-all duration-300 ease-in-out">
                {/* ヘッダー */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Code className="w-4 h-4" />
                        <span className="text-sm font-medium">コードブロック</span>
                    </div>

                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="bash">Bash</option>
                    </select>
                </div>

                {/* コードエリア */}
                <textarea
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="コードを入力..."
                    className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-none min-h-[200px]"
                    style={{
                        tabSize: 2,
                    }}
                />
            </div>
        </div>
    );
}

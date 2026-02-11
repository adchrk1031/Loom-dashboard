'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyUrlButton({ url, className }: { url: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className || "p-1.5 hover:bg-background-alt rounded transition-colors"}
            title="URLをコピー"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-600" />
            ) : (
                <Copy className="w-4 h-4 text-text-secondary" />
            )}
        </button>
    );
}

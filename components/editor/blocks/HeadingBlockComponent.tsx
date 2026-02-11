import React from 'react';
import type { HeadingBlock } from '@/types/editor';

interface HeadingBlockComponentProps {
    block: HeadingBlock;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (props: Partial<HeadingBlock['props']>) => void;
}

const HeadingBlockComponent = React.memo(function HeadingBlockComponent({
    block,
    isSelected,
    onSelect,
    onUpdate,
}: HeadingBlockComponentProps) {
    const HeadingTag = `h${block.props.level}` as keyof JSX.IntrinsicElements;

    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'ring-2 ring-accent bg-background-alt' : 'hover:bg-background-alt'
                }`}
        >
            <HeadingTag
                className={`font-bold ${block.props.level === 1
                        ? 'text-4xl'
                        : block.props.level === 2
                            ? 'text-3xl'
                            : 'text-2xl'
                    }`}
                style={{ textAlign: block.props.align }}
            >
                {block.props.text || '見出しを入力...'}
            </HeadingTag>
        </div>
    );
});

export default HeadingBlockComponent;

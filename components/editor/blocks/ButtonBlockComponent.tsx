import React from 'react';
import type { ButtonBlock } from '@/types/editor';

interface ButtonBlockComponentProps {
    block: ButtonBlock;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (props: Partial<ButtonBlock['props']>) => void;
}

const ButtonBlockComponent = React.memo(function ButtonBlockComponent({
    block,
    isSelected,
    onSelect,
}: ButtonBlockComponentProps) {
    const variantClass =
        block.props.variant === 'primary'
            ? 'bg-accent text-white hover:bg-blue-600'
            : block.props.variant === 'secondary'
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'border-2 border-accent text-accent hover:bg-accent hover:text-white';

    const sizeClass =
        block.props.size === 'sm'
            ? 'px-4 py-2 text-sm'
            : block.props.size === 'lg'
                ? 'px-8 py-4 text-lg'
                : 'px-6 py-3 text-base';

    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'ring-2 ring-accent bg-background-alt' : 'hover:bg-background-alt'
                }`}
        >
            <div className="flex justify-center">
                <button
                    className={`rounded-lg font-semibold transition-colors ${variantClass} ${sizeClass}`}
                    onClick={(e) => e.preventDefault()}
                >
                    {block.props.text || 'ボタンテキスト'}
                </button>
            </div>
        </div>
    );
});

export default ButtonBlockComponent;

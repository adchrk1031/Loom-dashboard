import type { ButtonBlock } from '@/types/editor';

export default function PublicButtonBlock({ block }: { block: ButtonBlock }) {
    const variantClass =
        block.props.variant === 'primary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : block.props.variant === 'secondary'
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';

    const sizeClass =
        block.props.size === 'sm'
            ? 'px-4 py-2 text-sm'
            : block.props.size === 'lg'
                ? 'px-8 py-4 text-lg'
                : 'px-6 py-3 text-base';

    return (
        <div className="flex justify-center">
            <a
                href={block.props.url}
                className={`rounded-lg font-semibold transition-colors ${variantClass} ${sizeClass}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {block.props.text}
            </a>
        </div>
    );
}

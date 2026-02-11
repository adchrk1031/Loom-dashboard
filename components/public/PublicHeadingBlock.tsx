import type { HeadingBlock } from '@/types/editor';

export default function PublicHeadingBlock({ block }: { block: HeadingBlock }) {
    const HeadingTag = `h${block.props.level}` as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag
            className={`font-bold ${block.props.level === 1
                    ? 'text-4xl'
                    : block.props.level === 2
                        ? 'text-3xl'
                        : 'text-2xl'
                }`}
            style={{ textAlign: block.props.align }}
        >
            {block.props.text}
        </HeadingTag>
    );
}

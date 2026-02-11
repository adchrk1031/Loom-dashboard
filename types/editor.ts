// LPエディタのブロック型定義

export type BlockType = 'heading' | 'video' | 'button' | 'image' | 'code';

export interface BaseBlock {
    id: string;
    type: BlockType;
    order: number;
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading';
    props: {
        text: string;
        level: 1 | 2 | 3;
        align: 'left' | 'center' | 'right';
    };
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    props: {
        url: string;
        title: string;
        aspectRatio: '16:9' | '4:3' | '1:1';
    };
}

export interface ButtonBlock extends BaseBlock {
    type: 'button';
    props: {
        text: string;
        url: string;
        variant: 'primary' | 'secondary' | 'outline';
        size: 'sm' | 'md' | 'lg';
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    content?: {
        imageUrl?: string;
        caption?: string;
    };
}

export interface CodeBlock extends BaseBlock {
    type: 'code';
    content?: {
        code?: string;
        language?: string;
    };
}

export type Block = HeadingBlock | VideoBlock | ButtonBlock | ImageBlock | CodeBlock;

// Funnel.publishedData の型
export interface PublishedData {
    version: string;
    blocks: Block[];
    theme?: {
        primaryColor?: string;
        fontFamily?: string;
    };
}

import React from 'react';
import type { VideoBlock } from '@/types/editor';
import { Video } from 'lucide-react';

interface VideoBlockComponentProps {
    block: VideoBlock;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (props: Partial<VideoBlock['props']>) => void;
}

const VideoBlockComponent = React.memo(function VideoBlockComponent({
    block,
    isSelected,
    onSelect,
}: VideoBlockComponentProps) {
    const aspectRatioClass =
        block.props.aspectRatio === '16:9'
            ? 'aspect-video'
            : block.props.aspectRatio === '4:3'
                ? 'aspect-[4/3]'
                : 'aspect-square';

    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'ring-2 ring-accent bg-background-alt' : 'hover:bg-background-alt'
                }`}
        >
            {block.props.url ? (
                <div className={`w-full ${aspectRatioClass} bg-gray-900 rounded-lg overflow-hidden`}>
                    <iframe
                        src={block.props.url}
                        title={block.props.title}
                        className="w-full h-full"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div
                    className={`w-full ${aspectRatioClass} bg-gray-100 rounded-lg flex items-center justify-center`}
                >
                    <div className="text-center">
                        <Video className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">動画URLを入力してください</p>
                    </div>
                </div>
            )}
            {block.props.title && (
                <p className="mt-2 text-sm text-text-secondary">{block.props.title}</p>
            )}
        </div>
    );
});

export default VideoBlockComponent;

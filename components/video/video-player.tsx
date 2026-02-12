'use client';

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

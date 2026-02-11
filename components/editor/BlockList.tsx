'use client';

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Block } from '@/types/editor';
import HeadingBlockComponent from './blocks/HeadingBlockComponent';
import VideoBlockComponent from './blocks/VideoBlockComponent';
import ButtonBlockComponent from './blocks/ButtonBlockComponent';
import ImageBlockComponent from './blocks/ImageBlockComponent';
import CodeBlockComponent from './blocks/CodeBlockComponent';

interface SortableBlockProps {
    block: Block;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (props: any) => void;
}

function SortableBlock({ block, isSelected, onSelect, onUpdate }: SortableBlockProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'heading':
                return (
                    <HeadingBlockComponent
                        block={block}
                        isSelected={isSelected}
                        onSelect={onSelect}
                        onUpdate={onUpdate}
                    />
                );
            case 'video':
                return (
                    <VideoBlockComponent
                        block={block}
                        isSelected={isSelected}
                        onSelect={onSelect}
                        onUpdate={onUpdate}
                    />
                );
            case 'button':
                return (
                    <ButtonBlockComponent
                        block={block}
                        isSelected={isSelected}
                        onSelect={onSelect}
                        onUpdate={onUpdate}
                    />
                );
            case 'image':
                return (
                    <ImageBlockComponent
                        block={block}
                        onUpdate={onUpdate}
                        onDelete={() => { }}
                    />
                );
            case 'code':
                return (
                    <CodeBlockComponent
                        block={block}
                        onUpdate={onUpdate}
                        onDelete={() => { }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div className="absolute left-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing hover:bg-background-alt rounded"
                >
                    <GripVertical className="w-5 h-5 text-text-secondary" />
                </button>
            </div>
            <div className="ml-10">{renderBlock()}</div>
        </div>
    );
}

interface BlockListProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    onUpdateBlock: (id: string, props: any) => void;
    onReorderBlocks: (blocks: Block[]) => void;
}

export default function BlockList({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onUpdateBlock,
    onReorderBlocks,
}: BlockListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
            onReorderBlocks(reorderedBlocks);
        }
    };

    if (blocks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-text-secondary">
                <p>左側のパネルからブロックを追加してください</p>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                    {blocks.map((block) => (
                        <SortableBlock
                            key={block.id}
                            block={block}
                            isSelected={block.id === selectedBlockId}
                            onSelect={() => onSelectBlock(block.id)}
                            onUpdate={(props) => onUpdateBlock(block.id, props)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

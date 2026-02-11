'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Block, PublishedData } from '@/types/editor';

interface EditorState {
    funnelId: string;
    blocks: Block[];
    selectedBlockId: string | null;
    isDirty: boolean;
}

type EditorAction =
    | { type: 'ADD_BLOCK'; block: Block }
    | { type: 'UPDATE_BLOCK'; id: string; props: any }
    | { type: 'DELETE_BLOCK'; id: string }
    | { type: 'SELECT_BLOCK'; id: string | null }
    | { type: 'REORDER_BLOCKS'; blocks: Block[] }
    | { type: 'LOAD_DATA'; data: PublishedData }
    | { type: 'MARK_SAVED' };

const EditorContext = createContext<{
    state: EditorState;
    addBlock: (block: Block) => void;
    updateBlock: (id: string, props: any) => void;
    deleteBlock: (id: string) => void;
    selectBlock: (id: string | null) => void;
    reorderBlocks: (blocks: Block[]) => void;
    loadData: (data: PublishedData) => void;
    saveData: () => Promise<void>;
} | null>(null);

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'ADD_BLOCK':
            return {
                ...state,
                blocks: [...state.blocks, action.block].map((b, i) => ({ ...b, order: i })),
                isDirty: true,
            };
        case 'UPDATE_BLOCK':
            return {
                ...state,
                blocks: state.blocks.map((block) =>
                    block.id === action.id
                        ? { ...block, props: { ...block.props, ...action.props } }
                        : block
                ),
                isDirty: true,
            };
        case 'DELETE_BLOCK':
            return {
                ...state,
                blocks: state.blocks
                    .filter((block) => block.id !== action.id)
                    .map((b, i) => ({ ...b, order: i })),
                selectedBlockId: state.selectedBlockId === action.id ? null : state.selectedBlockId,
                isDirty: true,
            };
        case 'SELECT_BLOCK':
            return {
                ...state,
                selectedBlockId: action.id,
            };
        case 'REORDER_BLOCKS':
            return {
                ...state,
                blocks: action.blocks.map((b, i) => ({ ...b, order: i })),
                isDirty: true,
            };
        case 'LOAD_DATA':
            return {
                ...state,
                blocks: action.data.blocks,
                isDirty: false,
            };
        case 'MARK_SAVED':
            return {
                ...state,
                isDirty: false,
            };
        default:
            return state;
    }
}

export function EditorProvider({
    children,
    funnelId,
    initialData,
}: {
    children: React.ReactNode;
    funnelId: string;
    initialData?: PublishedData;
}) {
    const [state, dispatch] = useReducer(editorReducer, {
        funnelId,
        blocks: initialData?.blocks || [],
        selectedBlockId: null,
        isDirty: false,
    });

    const addBlock = useCallback((block: Block) => {
        dispatch({ type: 'ADD_BLOCK', block });
    }, []);

    const updateBlock = useCallback((id: string, props: any) => {
        dispatch({ type: 'UPDATE_BLOCK', id, props });
    }, []);

    const deleteBlock = useCallback((id: string) => {
        dispatch({ type: 'DELETE_BLOCK', id });
    }, []);

    const selectBlock = useCallback((id: string | null) => {
        dispatch({ type: 'SELECT_BLOCK', id });
    }, []);

    const reorderBlocks = useCallback((blocks: Block[]) => {
        dispatch({ type: 'REORDER_BLOCKS', blocks });
    }, []);

    const loadData = useCallback((data: PublishedData) => {
        dispatch({ type: 'LOAD_DATA', data });
    }, []);

    const saveData = useCallback(async () => {
        const publishedData: PublishedData = {
            version: '1.0',
            blocks: state.blocks,
        };

        try {
            // TODO: API経由でSupabaseに保存
            const response = await fetch(`/api/funnels/${state.funnelId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publishedData }),
            });

            if (!response.ok) throw new Error('保存に失敗しました');

            dispatch({ type: 'MARK_SAVED' });
            console.log('保存成功:', publishedData);
        } catch (error) {
            console.error('保存エラー:', error);
            // 開発中はコンソールログのみ
            console.log('保存データ（モック）:', publishedData);
            dispatch({ type: 'MARK_SAVED' });
        }
    }, [state.blocks, state.funnelId]);

    return (
        <EditorContext.Provider
            value={{
                state,
                addBlock,
                updateBlock,
                deleteBlock,
                selectBlock,
                reorderBlocks,
                loadData,
                saveData,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}

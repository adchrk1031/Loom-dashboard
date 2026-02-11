'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { User, Calendar, Tag, MessageSquare } from 'lucide-react';

interface UserData {
    id: string;
    displayName: string;
    lineId: string;
    registeredAt: Date;
    tags: string[];
    status: string;
    lastMessagePreview?: string;
}

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: UserData[];
    title: string;
}

export default function UserListModal({ isOpen, onClose, users, title }: UserListModalProps) {
    const router = useRouter();

    const handleUserClick = (userId: string) => {
        router.push(`/chat?u=${userId}`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="max-h-[600px] overflow-y-auto">
                {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        ユーザーがいません
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserClick(user.id)}
                                className="w-full p-4 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all duration-150 text-left group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* アイコン */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user.displayName.charAt(0)}
                                    </div>

                                    {/* ユーザー情報 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-black group-hover:text-blue-600 transition-colors">
                                                {user.displayName}
                                            </h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.status === 'paid' ? '有料会員' : '無料会員'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span>{user.lineId}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {user.registeredAt.toLocaleDateString('ja-JP', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* タグ */}
                                        {user.tags.length > 0 && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Tag className="w-3 h-3 text-gray-400" />
                                                <div className="flex flex-wrap gap-1">
                                                    {user.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 最終メッセージプレビュー */}
                                        {user.lastMessagePreview && (
                                            <div className="flex items-start gap-1 text-xs text-gray-500">
                                                <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <p className="line-clamp-1">{user.lastMessagePreview}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* チャットへ遷移アイコン */}
                                    <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

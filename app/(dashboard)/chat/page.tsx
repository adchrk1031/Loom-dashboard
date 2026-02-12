'use client';

import { useState } from 'react';
import { mockUsers, mockMessages, type User, type Message } from '@/lib/mockData';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';

export default function ChatPage() {
    const [selectedUserId, setSelectedUserId] = useState<string>('1');
    const [messageInput, setMessageInput] = useState('');

    const selectedUser = mockUsers.find((u) => u.id === selectedUserId);
    const messages = mockMessages[selectedUserId] || [];

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // TODO: メッセージ送信処理
            console.log('Sending message:', messageInput);
            setMessageInput('');
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* 左カラム: ユーザー一覧 */}
            <div className="w-80 border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-black text-black mb-2">チャット</h2>
                    <p className="text-xs text-gray-600">
                        {mockUsers.length}人のユーザー
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {mockUsers.map((user) => (
                        <UserListItem
                            key={user.id}
                            user={user}
                            isSelected={user.id === selectedUserId}
                            onClick={() => setSelectedUserId(user.id)}
                        />
                    ))}
                </div>
            </div>

            {/* 中央カラム: チャット履歴 */}
            <div className="flex-1 flex flex-col">
                {/* チャットヘッダー */}
                <div className="h-16 border-b border-border flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                            {selectedUser?.displayName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary">
                                {selectedUser?.displayName}
                            </h3>
                            <p className="text-xs text-text-secondary">
                                {selectedUser?.status === 'paid' ? '有料会員' : '無料会員'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-background-alt rounded-lg transition-colors">
                            <Phone className="w-5 h-5 text-text-secondary" />
                        </button>
                        <button className="p-2 hover:bg-background-alt rounded-lg transition-colors">
                            <Video className="w-5 h-5 text-text-secondary" />
                        </button>
                        <button className="p-2 hover:bg-background-alt rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* メッセージ履歴 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                </div>

                {/* メッセージ入力 */}
                <div className="border-t border-border p-4">
                    <div className="flex items-end gap-2">
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="メッセージを入力..."
                            className="flex-1 resize-none rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            rows={3}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            送信
                        </button>
                    </div>
                </div>
            </div>

            {/* 右カラム: ユーザー詳細 */}
            <div className="w-80 border-l border-border overflow-y-auto">
                <UserDetailPanel user={selectedUser} />
            </div>
        </div>
    );
}

// ユーザー一覧アイテム
function UserListItem({
    user,
    isSelected,
    onClick,
}: {
    user: User;
    isSelected: boolean;
    onClick: () => void;
}) {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 60) return `${minutes}分前`;
        if (hours < 24) return `${hours}時間前`;
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 flex items-start gap-3 hover:bg-background-alt transition-colors ${isSelected ? 'bg-background-alt' : ''
                }`}
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                    {user.displayName.charAt(0)}
                </div>
                {user.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {user.unreadCount}
                    </div>
                )}
            </div>

            <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                        {user.displayName}
                    </h4>
                    <span className="text-xs text-text-secondary">
                        {formatTime(user.lastMessageAt)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {user.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-background-alt text-text-secondary rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </button>
    );
}

// メッセージバブル
function MessageBubble({ message }: { message: Message }) {
    return (
        <div
            className={`flex ${message.isFromUser ? 'justify-start' : 'justify-end'}`}
        >
            <div
                className={`max-w-md px-4 py-2 rounded-lg ${message.isFromUser
                    ? 'bg-background-alt text-text-primary'
                    : 'bg-accent text-white'
                    }`}
            >
                <p className="text-sm">{message.content}</p>
                <p
                    className={`text-xs mt-1 ${message.isFromUser ? 'text-text-secondary' : 'text-blue-100'
                        }`}
                >
                    {message.timestamp.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}

// ユーザー詳細パネル
function UserDetailPanel({ user }: { user: User | undefined }) {
    if (!user) return null;

    return (
        <div className="p-6">
            <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                    {user.displayName.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                    {user.displayName}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                    {user.status === 'paid' ? '有料会員' : '無料会員'}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-2">
                        LINE ID
                    </h4>
                    <p className="text-sm text-text-primary">{user.lineId}</p>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-2">
                        タグ
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {user.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-3 py-1 bg-background-alt text-text-primary rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-2">
                        最終メッセージ
                    </h4>
                    <p className="text-sm text-text-primary">
                        {user.lastMessageAt.toLocaleString('ja-JP')}
                    </p>
                </div>

                <div className="pt-4 border-t border-border">
                    <h4 className="text-xs font-semibold text-text-secondary mb-3">
                        クイックアクション
                    </h4>
                    <div className="space-y-2">
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-background-alt rounded-lg transition-colors">
                            視聴履歴を確認
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-background-alt rounded-lg transition-colors">
                            タグを編集
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-background-alt rounded-lg transition-colors">
                            ステータスを変更
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

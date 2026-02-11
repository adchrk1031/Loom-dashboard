// モックデータ: ユーザー情報

export interface User {
    id: string;
    lineId: string;
    displayName: string;
    avatarUrl?: string;
    status: 'free' | 'paid';
    tags: string[];
    lastMessageAt: Date;
    unreadCount: number;
}

export const mockUsers: User[] = [
    {
        id: '1',
        lineId: 'U1234567890',
        displayName: '田中太郎',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanaka',
        status: 'paid',
        tags: ['VIP', '7日目'],
        lastMessageAt: new Date('2026-02-02T00:15:00'),
        unreadCount: 2,
    },
    {
        id: '2',
        lineId: 'U0987654321',
        displayName: '佐藤花子',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sato',
        status: 'free',
        tags: ['3日目'],
        lastMessageAt: new Date('2026-02-01T23:45:00'),
        unreadCount: 0,
    },
    {
        id: '3',
        lineId: 'U1122334455',
        displayName: '鈴木一郎',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suzuki',
        status: 'paid',
        tags: ['VIP', '完了'],
        lastMessageAt: new Date('2026-02-01T22:30:00'),
        unreadCount: 1,
    },
    {
        id: '4',
        lineId: 'U5566778899',
        displayName: '高橋美咲',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Takahashi',
        status: 'free',
        tags: ['1日目'],
        lastMessageAt: new Date('2026-02-01T20:00:00'),
        unreadCount: 0,
    },
];

// モックデータ: チャットメッセージ

export interface Message {
    id: string;
    userId: string;
    content: string;
    isFromUser: boolean;
    timestamp: Date;
}

export const mockMessages: Record<string, Message[]> = {
    '1': [
        {
            id: 'm1',
            userId: '1',
            content: 'こんにちは！動画を視聴しました。',
            isFromUser: true,
            timestamp: new Date('2026-02-02T00:10:00'),
        },
        {
            id: 'm2',
            userId: '1',
            content: 'ご視聴ありがとうございます！いかがでしたか？',
            isFromUser: false,
            timestamp: new Date('2026-02-02T00:11:00'),
        },
        {
            id: 'm3',
            userId: '1',
            content: 'とても参考になりました。次のステップを教えてください。',
            isFromUser: true,
            timestamp: new Date('2026-02-02T00:15:00'),
        },
    ],
    '2': [
        {
            id: 'm4',
            userId: '2',
            content: '登録しました！よろしくお願いします。',
            isFromUser: true,
            timestamp: new Date('2026-02-01T23:40:00'),
        },
        {
            id: 'm5',
            userId: '2',
            content: 'ご登録ありがとうございます！まずは導入動画をご覧ください。',
            isFromUser: false,
            timestamp: new Date('2026-02-01T23:45:00'),
        },
    ],
    '3': [
        {
            id: 'm6',
            userId: '3',
            content: '全ての動画を視聴完了しました！',
            isFromUser: true,
            timestamp: new Date('2026-02-01T22:30:00'),
        },
    ],
    '4': [
        {
            id: 'm7',
            userId: '4',
            content: 'はじめまして！',
            isFromUser: true,
            timestamp: new Date('2026-02-01T20:00:00'),
        },
    ],
};

// モックデータ: LP（ファンネル）

export interface Funnel {
    id: string;
    name: string;
    slug: string;
    isPublished: boolean;
    createdAt: Date;
    viewCount: number;
    conversionRate: number;
}

export const mockFunnels: Funnel[] = [
    {
        id: 'f1',
        name: '新春キャンペーンLP',
        slug: '/lp/new-year-2026',
        isPublished: true,
        createdAt: new Date('2026-01-15'),
        viewCount: 1248,
        conversionRate: 12.5,
    },
    {
        id: 'f2',
        name: '無料体験セミナー募集',
        slug: '/lp/free-seminar',
        isPublished: true,
        createdAt: new Date('2026-01-20'),
        viewCount: 856,
        conversionRate: 18.3,
    },
    {
        id: 'f3',
        name: 'VIP会員限定オファー',
        slug: '/lp/vip-offer',
        isPublished: false,
        createdAt: new Date('2026-01-28'),
        viewCount: 0,
        conversionRate: 0,
    },
    {
        id: 'f4',
        name: 'ウェビナー告知ページ',
        slug: '/lp/webinar-2026-02',
        isPublished: true,
        createdAt: new Date('2026-02-01'),
        viewCount: 342,
        conversionRate: 8.7,
    },
];

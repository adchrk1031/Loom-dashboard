require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function insertTestData() {
    const testVideos = [
        {
            title: 'Loomプラットフォーム完全ガイド',
            description: 'Loomの使い方を徹底解説します',
            thumbnail_url: 'https://placehold.co/640x360/6B8CAE/white?text=Video+1',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            view_count: 1234,
            duration: 600,
            visibility: 'PUBLIC',
            allowed_tags: ['副業', '人材']
        },
        {
            title: 'マーケティング自動化の基礎',
            description: '効率的なマーケティング戦略を学びます',
            thumbnail_url: 'https://placehold.co/640x360/8FA88E/white?text=Video+2',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            view_count: 856,
            duration: 450,
            visibility: 'PUBLIC',
            allowed_tags: ['マーケティング']
        },
        {
            title: 'LINE配信の最適化テクニック',
            description: '開封率を上げるためのノウハウ',
            thumbnail_url: 'https://placehold.co/640x360/D4A574/white?text=Video+3',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            view_count: 542,
            duration: 720,
            visibility: 'UNLISTED',
            allowed_tags: ['LINE', 'マーケティング']
        },
        {
            title: 'データ分析で成果を最大化',
            description: 'KPIの見方と改善方法',
            thumbnail_url: 'https://placehold.co/640x360/B87C7C/white?text=Video+4',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            view_count: 321,
            duration: 540,
            visibility: 'PUBLIC',
            allowed_tags: ['分析']
        }
    ];

    const { data, error } = await supabase
        .from('videos')
        .insert(testVideos)
        .select();

    if (error) {
        console.error('Error inserting test data:', error);
        process.exit(1);
    }

    console.log('✅ Test data inserted successfully!');
    console.log(`Inserted ${data.length} videos`);
    process.exit(0);
}

insertTestData();

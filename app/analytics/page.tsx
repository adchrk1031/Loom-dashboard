'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, Download } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/DateRangePicker';
import { format } from 'date-fns';

// カラーマッピング（ダスティカラー）
const sourceColors: Record<string, string> = {
    'Instagram': '#C97C8E',
    '広告': '#6B8CAE',
    'X (Twitter)': '#7BA8B8',
    'その他': '#A8A8A8',
};

const tagColors: Record<string, string> = {
    '副業': '#6B8CAE',
    '退職': '#8FA88E',
    '人材': '#D4A574',
    '不動産': '#B87C7C',
    '物販': '#9B8FB5',
    '未分類': '#A8A8A8',
};

// タグ別KPIデータ
const tagKPIData: Record<string, any> = {
    '総合': {
        totalUsers: '1,100',
        totalUsersChange: '+3.2%',
        cvr: '24.8%',
        cvrChange: '+18.3%',
        growth: '156%',
        growthChange: '+12.5%',
    },
    '副業': {
        totalUsers: '280',
        totalUsersChange: '+5.1%',
        cvr: '28.5%',
        cvrChange: '+22.1%',
        growth: '172%',
        growthChange: '+15.2%',
    },
    '退職': {
        totalUsers: '220',
        totalUsersChange: '+2.8%',
        cvr: '22.3%',
        cvrChange: '+15.7%',
        growth: '145%',
        growthChange: '+10.8%',
    },
    '人材': {
        totalUsers: '180',
        totalUsersChange: '+4.2%',
        cvr: '26.1%',
        cvrChange: '+19.5%',
        growth: '158%',
        growthChange: '+13.1%',
    },
    '不動産': {
        totalUsers: '150',
        totalUsersChange: '+1.9%',
        cvr: '20.8%',
        cvrChange: '+12.3%',
        growth: '138%',
        growthChange: '+8.9%',
    },
    '物販': {
        totalUsers: '140',
        totalUsersChange: '+3.5%',
        cvr: '23.7%',
        cvrChange: '+16.8%',
        growth: '149%',
        growthChange: '+11.4%',
    },
};

interface AnalyticsData {
    totalUsers: number;
    periodUsers: number;
    prevPeriodUsers: number;
    userGrowthRate: number;
    sourceData: Array<{ name: string; value: number }>;
    dailyData: Array<{ date: string; users: number; prevUsers?: number }>;
    prevDailyData: Array<{ date: string; users: number }>;
    tagData: Array<{ name: string; value: number }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'total' | 'tag'>('total');
    const [selectedTag, setSelectedTag] = useState<string>('副業');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 7);
        return { from, to };
    });
    const [comparisonRange, setComparisonRange] = useState<DateRange | undefined>();

    // データ取得
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const params = new URLSearchParams();
            if (dateRange?.from) {
                params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
            }
            if (dateRange?.to) {
                params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
            }
            if (viewMode === 'tag') {
                params.append('tag', selectedTag);
            }

            try {
                const response = await fetch(`/api/analytics?${params.toString()}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange, comparisonRange, viewMode, selectedTag]);

    // 日付範囲変更ハンドラー
    const handleDateRangeChange = (range: DateRange | undefined, comparison?: DateRange | undefined) => {
        setDateRange(range);
        setComparisonRange(comparison);
    };

    // CSVダウンロード関数
    const handleExportCSV = async () => {
        try {
            const params = new URLSearchParams();
            if (viewMode === 'tag') {
                params.append('tag', selectedTag);
            }

            const response = await fetch(`/api/users/export?${params.toString()}`);
            if (!response.ok) throw new Error('CSV出力に失敗しました');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_${viewMode === 'tag' ? selectedTag : 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('CSV export error:', error);
            alert('CSV出力に失敗しました');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="mb-10 flex items-center justify-between">
                    <h1 className="page-title">データ分析</h1>
                </div>

                {/* スケルトンローダー */}
                <div className="space-y-8 animate-pulse">
                    {/* KPIカードスケルトン */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-3xl h-40"></div>
                        ))}
                    </div>

                    {/* グラフスケルトン */}
                    <div className="bg-gray-200 rounded-3xl h-96"></div>

                    {/* 円グラフスケルトン */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-200 rounded-3xl h-96"></div>
                        <div className="bg-gray-200 rounded-3xl h-96"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="text-center text-red-600">データの取得に失敗しました</div>
            </div>
        );
    }

    // 流入元データにカラーを追加
    const sourceDataWithColors = data.sourceData.map((item) => ({
        ...item,
        color: sourceColors[item.name] || '#9CA3AF',
    }));

    // タグデータにカラーを追加
    const tagDataWithColors = data.tagData.map((item) => ({
        ...item,
        color: tagColors[item.name] || '#9CA3AF',
    }));

    // 現在のKPIデータ
    const currentKPI = viewMode === 'total'
        ? tagKPIData['総合']
        : tagKPIData[selectedTag] || tagKPIData['総合'];

    // KPIカードデータ（3項目）
    const kpiCards = [
        {
            title: '総登録者数',
            value: currentKPI.totalUsers,
            change: currentKPI.totalUsersChange,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: '平均CVR',
            value: currentKPI.cvr,
            change: currentKPI.cvrChange,
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: '成長率',
            value: currentKPI.growth,
            change: currentKPI.growthChange,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* ヘッダー */}
            <div className="mb-10 flex items-center justify-between">
                <h1 className="page-title">
                    データ分析
                </h1>
                <div className="flex items-center gap-4">
                    <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <Download className="w-5 h-5" />
                        CSV出力
                    </button>
                </div>
            </div>

            {/* タブ切り替え */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex bg-white border-2 border-gray-200 rounded-2xl p-1.5">
                    <button
                        onClick={() => setViewMode('total')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-in-out ${viewMode === 'total'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        総合
                    </button>
                    <button
                        onClick={() => setViewMode('tag')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-in-out ${viewMode === 'tag'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        タグ別
                    </button>
                </div>

                {/* タグ選択（タグ別モード時のみ表示） */}
                {viewMode === 'tag' && (
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-all duration-300 ease-in-out appearance-none"
                    >
                        <option value="副業">副業</option>
                        <option value="退職">退職</option>
                        <option value="人材">人材</option>
                        <option value="不動産">不動産</option>
                        <option value="物販">物販</option>
                    </select>
                )}
            </div>

            {/* KPIカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {kpiCards.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={index}
                            className="ios-card p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${kpi.bgColor}`}>
                                    <Icon className={`w-7 h-7 ${kpi.color}`} />
                                </div>
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border-2 border-green-200">
                                    {kpi.change}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                {kpi.title}
                            </h3>
                            <p className="text-4xl font-black text-gray-900">
                                {kpi.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* 日次登録者推移（前週比較） */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-8">
                    日次登録者推移（前週比較）
                    {viewMode === 'tag' && <span className="text-blue-600 ml-3">（{selectedTag}）</span>}
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.dailyData.map((item, index) => ({
                        ...item,
                        prevUsers: data.prevDailyData[index]?.users || 0
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            style={{ fontSize: '14px', fontWeight: '600' }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            style={{ fontSize: '14px', fontWeight: '600' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #E5E7EB',
                                borderRadius: '16px',
                                padding: '12px',
                                fontWeight: '600',
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontWeight: '600',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="今週"
                        />
                        <Line
                            type="monotone"
                            dataKey="prevUsers"
                            stroke="#9CA3AF"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#9CA3AF', r: 3 }}
                            name="先週"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 流入経路 */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">流入経路</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={sourceDataWithColors}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {sourceDataWithColors.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '16px',
                                    padding: '12px',
                                    fontWeight: '600',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* タグ別ユーザー分布 */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">タグ別ユーザー分布</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={tagDataWithColors} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                type="number"
                                stroke="#6B7280"
                                style={{ fontSize: '14px', fontWeight: '600' }}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="#6B7280"
                                style={{ fontSize: '14px', fontWeight: '600' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '16px',
                                    padding: '12px',
                                    fontWeight: '600',
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {tagDataWithColors.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DataPoint {
    date: string;
    mainValue: number;
    comparisonValue: number;
}

interface ComparisonChartProps {
    data: DataPoint[];
    mainLabel: string;
    comparisonLabel: string;
}

export default function ComparisonChart({ data, mainLabel, comparisonLabel }: ComparisonChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                            <span className="text-sm text-gray-700">{mainLabel}:</span>
                            <span className="text-sm font-semibold text-gray-900">{payload[0].value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                            <span className="text-sm text-gray-700">{comparisonLabel}:</span>
                            <span className="text-sm font-semibold text-gray-900">{payload[1].value.toLocaleString()}</span>
                        </div>
                        {payload[0].value !== 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-xs text-gray-600">
                                    変化率:{' '}
                                    <span className={payload[0].value > payload[1].value ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                        {((payload[0].value - payload[1].value) / payload[1].value * 100).toFixed(1)}%
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="mainValue"
                        name={mainLabel}
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ fill: '#2563eb', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="comparisonValue"
                        name={comparisonLabel}
                        stroke="#9ca3af"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#9ca3af', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

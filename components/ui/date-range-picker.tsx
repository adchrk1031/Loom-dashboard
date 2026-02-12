'use client';

import { useState } from 'react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';

export interface DateRange {
    from: Date;
    to: Date;
}

export interface ComparisonDateRange {
    main: DateRange;
    comparison: DateRange;
}

interface DateRangePickerProps {
    value: ComparisonDateRange;
    onChange: (value: ComparisonDateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const quickSelections = [
        {
            label: '今週 vs 前週',
            getValue: (): ComparisonDateRange => {
                const now = new Date();
                const mainFrom = startOfWeek(now, { weekStartsOn: 1 });
                const mainTo = endOfWeek(now, { weekStartsOn: 1 });
                const compFrom = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
                const compTo = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
                return {
                    main: { from: mainFrom, to: mainTo },
                    comparison: { from: compFrom, to: compTo },
                };
            },
        },
        {
            label: '過去7日 vs 前の7日',
            getValue: (): ComparisonDateRange => {
                const now = new Date();
                const mainFrom = subDays(now, 6);
                const mainTo = now;
                const compFrom = subDays(now, 13);
                const compTo = subDays(now, 7);
                return {
                    main: { from: mainFrom, to: mainTo },
                    comparison: { from: compFrom, to: compTo },
                };
            },
        },
        {
            label: '過去30日 vs 前の30日',
            getValue: (): ComparisonDateRange => {
                const now = new Date();
                const mainFrom = subDays(now, 29);
                const mainTo = now;
                const compFrom = subDays(now, 59);
                const compTo = subDays(now, 30);
                return {
                    main: { from: mainFrom, to: mainTo },
                    comparison: { from: compFrom, to: compTo },
                };
            },
        },
    ];

    const handleQuickSelect = (getValue: () => ComparisonDateRange) => {
        onChange(getValue());
        setIsOpen(false);
    };

    const formatDateRange = (range: DateRange) => {
        return `${format(range.from, 'M/d', { locale: ja })} - ${format(range.to, 'M/d', { locale: ja })}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                    {formatDateRange(value.main)} vs {formatDateRange(value.comparison)}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* オーバーレイ */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* ドロップダウンメニュー */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {quickSelections.map((selection, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickSelect(selection.getValue)}
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            >
                                {selection.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

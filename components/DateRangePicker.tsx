'use client';

import * as React from 'react';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfToday, subDays, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface ComparisonRange {
    main: DateRange | undefined;
    comparison: DateRange | undefined;
}

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    comparisonRange?: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined, comparison?: DateRange | undefined) => void;
    enableComparison?: boolean;
}

export function DateRangePicker({
    dateRange,
    comparisonRange,
    onDateRangeChange,
    enableComparison = true
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
    const [selectingRange, setSelectingRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const [comparisonMode, setComparisonMode] = React.useState(false);

    const today = startOfToday();

    // クイックプリセット（4項目に整理）
    const presets = [
        { label: '今日', value: 'today' },
        { label: '直近7日間', value: '7days' },
        { label: '今週', value: 'thisweek' },
        { label: '前週比較', value: 'comparison' },
    ];

    const handlePreset = (preset: string) => {
        const to = new Date();
        let from: Date;
        let comparisonFrom: Date | undefined;
        let comparisonTo: Date | undefined;

        switch (preset) {
            case 'today':
                // 今日のみ
                from = to;
                break;
            case '7days':
                // 今日から過去7日間
                from = subDays(to, 6);
                break;
            case 'thisweek':
                // 今週の日曜日〜土曜日
                const dayOfWeek = to.getDay(); // 0 (日曜) ~ 6 (土曜)
                from = subDays(to, dayOfWeek); // 今週の日曜日
                break;
            case 'comparison':
                // 前週比較モード
                const currentDayOfWeek = to.getDay();
                from = subDays(to, currentDayOfWeek); // 今週の日曜日
                // 先週の同じ期間
                comparisonFrom = subWeeks(from, 1);
                comparisonTo = subDays(to, 7);
                setComparisonMode(true);
                break;
            default:
                return;
        }

        setSelectingRange({ from, to });
        // 選択後すぐに適用
        onDateRangeChange({ from, to }, comparisonFrom && comparisonTo ? { from: comparisonFrom, to: comparisonTo } : undefined);
        setIsOpen(false);
    };

    // 日付クリック処理
    const handleDateClick = (date: Date) => {
        if (!selectingRange.from || (selectingRange.from && selectingRange.to)) {
            // 開始日を設定
            setSelectingRange({ from: date, to: undefined });
            setHoveredDate(null);
        } else {
            // 終了日を設定
            if (date < selectingRange.from) {
                setSelectingRange({ from: date, to: selectingRange.from });
            } else {
                setSelectingRange({ from: selectingRange.from, to: date });
            }
        }
    };

    // 適用ボタン
    const handleApply = () => {
        if (selectingRange.from) {
            let comparison: DateRange | undefined;

            if (comparisonMode && selectingRange.from && selectingRange.to) {
                // 比較期間を自動計算（同じ日数分だけ前の期間）
                const daysDiff = Math.ceil((selectingRange.to.getTime() - selectingRange.from.getTime()) / (1000 * 60 * 60 * 24));
                comparison = {
                    from: subDays(selectingRange.from, daysDiff + 1),
                    to: subDays(selectingRange.from, 1)
                };
            }

            onDateRangeChange(selectingRange, comparison);
            setIsOpen(false);
        }
    };

    // キャンセルボタン
    const handleCancel = () => {
        setSelectingRange({ from: dateRange?.from, to: dateRange?.to });
        setComparisonMode(false);
        setIsOpen(false);
    };

    // カレンダーを開く時に現在の選択範囲を復元
    React.useEffect(() => {
        if (isOpen) {
            setSelectingRange({ from: dateRange?.from, to: dateRange?.to });
            setComparisonMode(!!comparisonRange);
        }
    }, [isOpen, dateRange, comparisonRange]);

    // カレンダーレンダリング
    const renderCalendar = (month: Date) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const calendarStart = startOfWeek(monthStart, { locale: ja });
        const calendarEnd = endOfWeek(monthEnd, { locale: ja });
        const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

        const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

        return (
            <div className="flex-1 min-w-[320px]">
                {/* 月ヘッダー */}
                <div className="text-center mb-6">
                    <h3 className="text-base font-black text-black">
                        {format(month, 'yyyy年M月', { locale: ja })}
                    </h3>
                </div>

                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day, index) => (
                        <div
                            key={day}
                            className={`text-center text-xs font-semibold py-2 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 日付グリッド */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, month);
                        const isStart = selectingRange?.from && isSameDay(day, selectingRange.from);
                        const isEnd = selectingRange?.to && isSameDay(day, selectingRange.to);
                        const isInRange = selectingRange?.from && selectingRange?.to &&
                            isWithinInterval(day, { start: selectingRange.from, end: selectingRange.to });

                        // ホバー時のプレビュー範囲
                        const isHoveredInRange = selectingRange?.from && !selectingRange?.to && hoveredDate &&
                            isWithinInterval(day, {
                                start: selectingRange.from < hoveredDate ? selectingRange.from : hoveredDate,
                                end: selectingRange.from < hoveredDate ? hoveredDate : selectingRange.from
                            });

                        const isToday = isSameDay(day, today);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => isCurrentMonth && handleDateClick(day)}
                                onMouseEnter={() => isCurrentMonth && setHoveredDate(day)}
                                onMouseLeave={() => setHoveredDate(null)}
                                disabled={!isCurrentMonth}
                                className={`
                                    relative h-11 w-full text-sm font-bold transition-all duration-200
                                    ${!isCurrentMonth ? 'text-gray-200 cursor-default' : 'text-gray-700'}
                                    ${isStart || isEnd ? 'bg-blue-600 text-white rounded-lg shadow-md z-10' : ''}
                                    ${isInRange && !isStart && !isEnd ? 'bg-blue-50' : ''}
                                    ${isHoveredInRange && !isStart ? 'bg-blue-50' : ''}
                                    ${!isStart && !isEnd && !isInRange && !isHoveredInRange && isCurrentMonth ? 'hover:bg-gray-100 rounded-lg' : ''}
                                    ${isToday && !isStart && !isEnd ? 'border-2 border-blue-600 rounded-lg' : ''}
                                `}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {/* トリガーボタン */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-300 text-gray-900 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all duration-200"
            >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold">
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, 'yyyy/MM/dd', { locale: ja })} -{' '}
                                {format(dateRange.to, 'yyyy/MM/dd', { locale: ja })}
                                {comparisonRange && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        (比較中)
                                    </span>
                                )}
                            </>
                        ) : (
                            format(dateRange.from, 'yyyy/MM/dd', { locale: ja })
                        )
                    ) : (
                        '期間を選択'
                    )}
                </span>
            </button>

            {isOpen && (
                <>
                    {/* オーバーレイ */}
                    <div
                        className="fixed inset-0 z-40 bg-black/10"
                        onClick={handleCancel}
                    />

                    {/* カレンダーポップアップ */}
                    <div className="absolute top-full mt-3 right-0 z-50 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ease-out max-w-[95vw]">
                        <div className="flex flex-col lg:flex-row">
                            {/* 左側：プリセット */}
                            <div className="lg:w-48 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                                    クイック選択
                                </h4>
                                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            onClick={() => handlePreset(preset.value)}
                                            className={`whitespace-nowrap lg:w-full text-left px-4 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] ${preset.value === 'comparison'
                                                    ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                        >
                                            {preset.value === 'comparison' && (
                                                <TrendingUp className="w-4 h-4 inline mr-2" />
                                            )}
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                {/* 比較モード切り替え */}
                                {enableComparison && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={comparisonMode}
                                                onChange={(e) => setComparisonMode(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span className="text-xs font-medium text-gray-700">
                                                比較モード
                                            </span>
                                        </label>
                                        {comparisonMode && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                選択期間と同じ日数分の前の期間を自動比較
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 右側：カレンダー */}
                            <div className="p-6">
                                {/* ナビゲーション */}
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-[0.98]"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-[0.98]"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* カレンダー表示（スマホ: 1ヶ月、デスクトップ: 2ヶ月） */}
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {renderCalendar(currentMonth)}
                                    <div className="hidden lg:block">
                                        {renderCalendar(addMonths(currentMonth, 1))}
                                    </div>
                                </div>

                                {/* フッター */}
                                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        disabled={!selectingRange.from}
                                        className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                                    >
                                        適用
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

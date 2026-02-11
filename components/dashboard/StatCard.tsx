import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const StatCard = React.memo(function StatCard({
    title,
    value,
    description,
    icon,
    trend,
}: StatCardProps) {
    return (
        <div className="notion-card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-secondary mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-text-primary mb-1">
                        {value}
                    </p>
                    {description && (
                        <p className="text-xs text-text-secondary">
                            {description}
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-text-secondary">
                                前月比
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="text-text-secondary opacity-50">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
});

export default StatCard;

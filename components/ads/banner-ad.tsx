'use client';

export default function BannerAd() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
            <div className="flex items-center justify-center h-24">
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-400 mb-1">広告枠</p>
                    <p className="text-xs text-gray-300">300 × 250</p>
                </div>
            </div>
        </div>
    );
}

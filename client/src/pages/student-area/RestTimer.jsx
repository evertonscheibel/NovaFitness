import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export default function RestTimer({ seconds, onComplete, onDismiss }) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        if (remaining <= 0) {
            onComplete?.();
            return;
        }
        const timer = setTimeout(() => setRemaining(r => r - 1), 1000);
        return () => clearTimeout(timer);
    }, [remaining, onComplete]);

    const progress = ((seconds - remaining) / seconds) * 100;
    const circumference = 2 * Math.PI * 36;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4" onClick={onDismiss}>
            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-8 text-center shadow-2xl shadow-orange-500/10" onClick={e => e.stopPropagation()}>
                <div className="relative w-28 h-28 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-28 h-28">
                        <circle cx="56" cy="56" r="36" fill="none" stroke="#374151" strokeWidth="5" />
                        <circle cx="56" cy="56" r="36" fill="none" stroke="#f97316" strokeWidth="5"
                            strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white font-outfit">
                        {remaining}s
                    </span>
                </div>
                <p className="text-orange-400 text-sm font-bold font-outfit mb-1">
                    <Timer className="w-4 h-4 inline mr-1" />
                    Descansando...
                </p>
                <p className="text-slate-500 text-xs">Toque fora para fechar</p>
            </div>
        </div>
    );
}

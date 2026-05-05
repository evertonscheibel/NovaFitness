import React from 'react';
import { X } from 'lucide-react';
import { SKIP_REASONS } from '../../constants/options';

export default function SkipModal({ isOpen, exercise, onClose, onSkip }) {
    if (!isOpen || !exercise) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white font-outfit">Por que não fez?</h3>
                            <p className="text-slate-400 text-sm mt-1">{exercise.nome_exercicio}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X /></button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {SKIP_REASONS.map(reason => (
                            <button
                                key={reason.id}
                                onClick={() => onSkip(reason.id)}
                                className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 rounded-xl border border-slate-700 transition-colors font-medium font-outfit"
                            >
                                {reason.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

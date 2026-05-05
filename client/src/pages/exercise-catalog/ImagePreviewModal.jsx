import React from 'react';
import { X } from 'lucide-react';

export default function ImagePreviewModal({ isOpen, image, onClose }) {
    if (!isOpen || !image) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
                <img
                    src={image}
                    alt="Preview"
                    className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200"
                />
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
                >
                    <X className="w-6 h-6" />
                    <span>Fechar</span>
                </button>
            </div>
        </div>
    );
}

import React from 'react';
import { X, Send } from 'lucide-react';

export default function MessageModal({ isOpen, content, setContent, onClose, onSend }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white font-outfit">Mensagem ao Gestor</h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X /></button>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Dúvida, feedback ou dificuldade..."
                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-slate-500 font-outfit font-medium"
                    />

                    <button
                        onClick={onSend}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 font-outfit"
                    >
                        <Send className="w-4 h-4" />
                        Enviar Mensagem
                    </button>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight } from 'lucide-react';

const StudentArea = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-6">
                    <Dumbbell className="w-8 h-8 text-orange-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Área do Aluno Atualizada! 🚀</h2>

                <p className="text-gray-400 mb-8">
                    O acesso à área do aluno mudou para ser mais seguro e completo.
                    Por favor, utilize o novo link de acesso via <strong>Token</strong>.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/area-aluno/login')}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition flex items-center justify-center gap-2"
                    >
                        Ir para Login
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                        Dica: Peça ao seu treinador o link atualizado clicando no botão "Link" no painel de gestão.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentArea;

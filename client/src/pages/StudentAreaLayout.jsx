import { useState, useEffect } from 'react';
import { useParams, Outlet, Link, useLocation } from 'react-router-dom';
import { Dumbbell, X, ChevronRight, TrendingUp, FileText, Calendar } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function StudentAreaLayout() {
    const { token } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchStudentData();
    }, [token]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/student-area/by-token/${token}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Token inválido');
            }

            setData(result.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
                    <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    const { student, isPremium } = data;
    const isDashboard = location.pathname.endsWith(token) || location.pathname.endsWith(`${token}/`);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-20">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to={`/area-aluno/token/${token}`} className="flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-orange-500" />
                        <span className="text-xl font-bold text-white">NovaFitness</span>
                    </Link>
                    {isPremium && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PREMIUM
                        </span>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Welcome (only on dashboard) */}
                {isDashboard && (
                    <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl p-6 border border-orange-500/30">
                        <h1 className="text-2xl font-bold text-white mb-1">Olá, {student.nome.split(' ')[0]}! 👋</h1>
                        <p className="text-gray-300">Objetivo: {student.objetivo_principal}</p>
                    </div>
                )}

                {/* Breadcrumb for sub-pages */}
                {!isDashboard && (
                    <Link to={`/area-aluno/token/${token}`} className="inline-flex items-center text-gray-400 hover:text-white transition gap-1 mb-4">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Voltar ao Início
                    </Link>
                )}

                <Outlet context={{ ...data, token }} />
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-700 z-50">
                <div className="max-w-4xl mx-auto flex justify-around p-2">
                    <Link to={`/area-aluno/token/${token}`} className={`flex flex-col items-center p-2 rounded-lg ${isDashboard ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Calendar className="w-6 h-6" />
                        <span className="text-xs mt-1">Hoje</span>
                    </Link>

                    <Link to={`/area-aluno/token/${token}/treinos`} className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.includes('/treinos') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}>
                        <FileText className="w-6 h-6" />
                        <span className="text-xs mt-1">Treinos</span>
                    </Link>

                    {isPremium && (
                        <Link to={`/area-aluno/token/${token}/evolucao`} className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.includes('/evolucao') ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}>
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-xs mt-1">Evolução</span>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default StudentAreaLayout;

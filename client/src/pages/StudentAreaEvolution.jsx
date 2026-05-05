import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Lock, Activity, Target, CalendarCheck, Flame } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function StudentAreaEvolution() {
    const { isPremium, student } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!student?.id || !isPremium) return;

        const fetchEvolution = async () => {
            try {
                const res = await fetch(`${API_BASE}/student-area/evolution/${student.id}`);
                const result = await res.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (err) {
                console.error('Erro ao buscar evolução:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvolution();
    }, [student?.id, isPremium]);

    if (!isPremium) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
                <div className="bg-amber-500/10 p-4 rounded-full mb-4">
                    <Lock className="w-12 h-12 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 font-outfit">Recurso Premium</h2>
                <p className="text-gray-400 max-w-sm">
                    Acompanhe sua evolução detalhada com gráficos de desempenho assinando o plano PREMIUM.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const summary = data?.summary || {};
    const chartData = data?.chartData || [];

    const kpis = [
        { label: 'Sessões', value: summary.totalSessions || 0, icon: CalendarCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Exercícios', value: summary.totalExercisesDone || 0, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Aderência', value: `${summary.adherenceRate || 0}%`, icon: Target, color: 'text-sky-500', bg: 'bg-sky-500/10' },
        { label: 'Dias Ativos', value: summary.uniqueDays || 0, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-6 pb-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-outfit">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Sua Evolução
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
                        <div className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center mx-auto mb-2`}>
                            <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-white font-outfit">{kpi.value}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {chartData.length > 0 ? (
                <>
                    {/* Sessions per day */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <h3 className="text-white font-medium mb-4 font-outfit">Sessões por Dia</h3>
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                                    <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: 8 }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#9ca3af' }}
                                    />
                                    <Bar dataKey="sessoes" fill="#ff6b35" radius={[4, 4, 0, 0]} name="Sessões" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Exercises chart */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <h3 className="text-white font-medium mb-4 font-outfit">Exercícios Feitos vs Pulados</h3>
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                                    <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: 8 }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#9ca3af' }}
                                    />
                                    <Line type="monotone" dataKey="feitos" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Feitos" />
                                    <Line type="monotone" dataKey="pulados" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Pulados" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 border-dashed p-12 text-center">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-white font-bold font-outfit mb-1">Sem dados ainda</h3>
                    <p className="text-slate-400 text-sm">Complete treinos para começar a ver sua evolução aqui!</p>
                </div>
            )}
        </div>
    );
}

export default StudentAreaEvolution;

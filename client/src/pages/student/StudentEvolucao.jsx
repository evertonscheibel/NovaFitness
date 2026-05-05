import { useState, useEffect } from 'react';
import { studentAreaAPI } from '../../services/api';
import { Activity, Target, CheckCircle, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

function StudentEvolucao() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await studentAreaAPI.getEvolution(studentId);
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [studentId]);

    const chartData = stats?.charts?.sessionsByDay || [
        { date: 'Seg', value: 1 },
        { date: 'Ter', value: 0 },
        { date: 'Qua', value: 1 },
        { date: 'Qui', value: 1 },
        { date: 'Sex', value: 0 },
        { date: 'Sab', value: 1 },
        { date: 'Dom', value: 0 },
    ];

    if (loading) {
        return (
            <div className="sa-container">
                <h1 className="sa-title">Evolução</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="sa-card sa-skeleton" style={{ height: '100px' }}></div>)}
                </div>
                <div className="sa-card sa-skeleton" style={{ height: '200px' }}></div>
            </div>
        );
    }

    return (
        <div className="sa-container">
            <h1 className="sa-title">Minha Evolução</h1>
            <p className="sa-subtitle">Resultados práticos do seu esforço</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div className="sa-card" style={{ marginBottom: 0 }}>
                    <div style={{ color: '#10B981', marginBottom: '8px' }}><Activity size={20} /></div>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.summary?.totalSessions || 0}</div>
                    <div style={{ fontSize: '11px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>Treinos</div>
                </div>
                <div className="sa-card" style={{ marginBottom: 0 }}>
                    <div style={{ color: '#F97316', marginBottom: '8px' }}><Zap size={20} /></div>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.summary?.totalExercisesDone || 0}</div>
                    <div style={{ fontSize: '11px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>Exercícios</div>
                </div>
                <div className="sa-card" style={{ marginBottom: 0 }}>
                    <div style={{ color: '#3B82F6', marginBottom: '8px' }}><Target size={20} /></div>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.summary?.adherenceRate || 0}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>Aderência</div>
                </div>
                <div className="sa-card" style={{ marginBottom: 0 }}>
                    <div style={{ color: '#A855F7', marginBottom: '8px' }}><CheckCircle size={20} /></div>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats?.summary?.uniqueDays || 0}</div>
                    <div style={{ fontSize: '11px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>Dias Ativos</div>
                </div>
            </div>

            <h3 style={{ fontSize: '14px', color: 'var(--sa-text-sec)', textTransform: 'uppercase', marginBottom: '12px' }}>Frequência de Treino</h3>
            <div className="sa-card" style={{ height: '250px', padding: '20px 10px 10px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#F97316' : '#334155'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="sa-card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                    <span style={{ color: '#10B981', fontWeight: '700' }}>Dica:</span> Mantenha a constância para ver novos recordes aqui em breve!
                </p>
            </div>
        </div>
    );
}

export default StudentEvolucao;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI, trainerAPI } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        pendingSuggestions: 0,
        newSignups: 0,
        overduePayments: 0
    });
    const [chartsData, setChartsData] = useState({
        studentsByGoal: [],
        signupsByMonth: []
    });
    const [pendingSuggestions, setPendingSuggestions] = useState([]);
    const [expiringWorkouts, setExpiringWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, suggestionsRes, expiringRes, chartsRes] = await Promise.all([
                dashboardAPI.getStats(),
                trainerAPI.getSuggestions(),
                dashboardAPI.getExpiringWorkouts(),
                dashboardAPI.getCharts()
            ]);

            setStats(statsRes.data.data);
            setPendingSuggestions(suggestionsRes.data.data);
            setExpiringWorkouts(expiringRes.data.data);
            setChartsData(chartsRes.data.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (suggestionId) => {
        navigate(`/review/${suggestionId}`);
    };

    // Componente de Gráfico de Barras Simples
    const BarChart = ({ data, color = '#646cff' }) => {
        if (!data || data.length === 0) return <p className="empty-state">Sem dados para exibir</p>;

        const maxValue = Math.max(...data.map(d => d.value));

        return (
            <div className="chart-container">
                <div className="bar-chart">
                    {data.map((item, index) => (
                        <div key={index} className="bar-row">
                            <div className="bar-label">{item.label}</div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${(item.value / maxValue) * 100}%`,
                                        backgroundColor: color
                                    }}
                                >
                                    {item.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">⏳ Carregando Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📊 Painel de Controle</h2>
                <Link to="/area-aluno/login" className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🌐 Acessar Área do Aluno
                </Link>
            </div>

            {/* KPIs */}
            <div className="stats-grid">
                <div
                    className="stat-card clickable"
                    onClick={() => navigate('/students')}
                    role="button"
                    tabIndex={0}
                    title="Clique para ver todos os alunos"
                >
                    <h3>{stats.activeStudents} / {stats.totalStudents}</h3>
                    <p>Alunos Ativos</p>
                </div>
                <div
                    className={`stat-card clickable ${stats.pendingSuggestions > 0 ? 'alert' : ''}`}
                    onClick={() => navigate('/trainer')}
                    role="button"
                    tabIndex={0}
                    title="Clique para revisar treinos pendentes"
                >
                    <h3>{stats.pendingSuggestions}</h3>
                    <p>Treinos Pendentes</p>
                </div>
                <div
                    className="stat-card clickable"
                    onClick={() => navigate('/students')}
                    role="button"
                    tabIndex={0}
                    title="Clique para ver alunos recentes"
                >
                    <h3>{stats.newSignups}</h3>
                    <p>Novos (30 dias)</p>
                </div>
            </div>

            {/* ALERTA FINANCEIRO */}
            {stats.overduePayments > 0 && (
                <div
                    className="alert-banner clickable"
                    style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #ef4444',
                        color: '#991b1b',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/financial')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>⚠️</span>
                        <div>
                            <strong>Atenção: Existem {stats.overduePayments} pagamentos atrasados!</strong>
                            <p style={{ margin: 0, fontSize: '14px' }}>Clique aqui para gerenciar o financeiro.</p>
                        </div>
                    </div>
                    <span className="btn btn-sm btn-danger">Ver Pendências</span>
                </div>
            )}


            {/* Gráficos */}
            <div className="dashboard-grid charts-section">
                <div className="card">
                    <h3>🎯 Alunos por Objetivo</h3>
                    <BarChart data={chartsData.studentsByGoal} color="#4caf50" />
                </div>
                <div className="card">
                    <h3>📈 Cadastros (Últimos 6 meses)</h3>
                    <BarChart data={chartsData.signupsByMonth} color="#2196f3" />
                </div>
            </div>


            <div className="dashboard-grid">
                {/* Fila de Aprovação */}
                <div className="card">
                    <div className="card-header">
                        <h3>🚨 Fila de Aprovação</h3>
                        <span className="badge">{pendingSuggestions.length} pendentes</span>
                    </div>

                    {pendingSuggestions.length === 0 ? (
                        <p className="empty-state">Tudo em dia! Nenhum treino pendente.</p>
                    ) : (
                        <div className="list-group">
                            {pendingSuggestions.map(sug => (
                                <div key={sug.id} className="list-item">
                                    <div className="info">
                                        <strong>{sug.student?.nome || 'Aluno Removido'}</strong>
                                        <span>{sug.student?.objetivo_principal} • {sug.student?.experiencia_prev}</span>
                                    </div>
                                    <button
                                        onClick={() => handleReview(sug.id)}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Revisar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Próximas Evoluções */}
                <div className="card">
                    <div className="card-header">
                        <h3>⚠️ Treinos Vencendo (7 dias)</h3>
                    </div>

                    {expiringWorkouts.length === 0 ? (
                        <p className="empty-state">Nenhum treino vencendo em breve.</p>
                    ) : (
                        <div className="list-group">
                            {expiringWorkouts.map(workout => (
                                <div key={workout.id} className="list-item">
                                    <div className="info">
                                        <strong>{workout.student?.nome || 'Aluno Removido'}</strong>
                                        <span className="text-danger">
                                            Vence em: {new Date(workout.validade_fim).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/student/${workout.student?.id}`}
                                        className="btn btn-sm"
                                    >
                                        Ver Perfil
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

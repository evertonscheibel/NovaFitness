import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { exerciseAPI, studentAPI } from '../services/api';

function ManagementHub() {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ exercises: 0, students: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [exRes, stRes] = await Promise.all([
                    exerciseAPI.getAll(),
                    studentAPI.getAll()
                ]);
                setCounts({
                    exercises: exRes.data.data.length,
                    students: stRes.data.data.length
                });
            } catch (error) {
                console.error('Erro ao buscar contagens:', error);
            }
        };
        fetchCounts();
    }, []);

    const modules = [
        {
            title: 'Controle de Caixa',
            description: 'Gerencie pagamentos, mensalidades e fluxos financeiros dos alunos.',
            icon: '💰',
            path: '/financial',
            color: 'var(--primary)',
            stat: 'Financeiro Ativo'
        },
        {
            title: 'Controle de Alunos',
            description: `Gerencie seus ${counts.students} alunos cadastrados e ativos no sistema.`,
            icon: '👥',
            path: '/students',
            color: 'var(--secondary)',
            stat: `${counts.students} Alunos`
        },
        {
            title: 'Catálogo de Exercícios',
            description: `Base de dados com ${counts.exercises} exercícios e aparelhos disponíveis.`,
            icon: '🏋️',
            path: '/exercises',
            color: 'var(--info)',
            stat: `${counts.exercises} Itens`
        },
        {
            title: 'Treinos Padrão',
            description: 'Modelos de treinos prontos por gênero e nível de experiência.',
            icon: '📋',
            path: '/standard-workouts',
            color: 'var(--success)',
            stat: 'Modelos Prontos'
        }
    ];

    return (
        <div className="container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="dashboard-header">
                <div>
                    <button onClick={() => navigate('/')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                        ← Voltar
                    </button>
                    <h2>⚙️ Módulo de Gestão</h2>
                    <p className="subtitle">Centralize o controle administrativo da sua unidade.</p>
                </div>
            </div>

            <div className="stats-grid">
                {modules.map((module, index) => (
                    <div
                        key={index}
                        className="stat-card clickable"
                        onClick={() => navigate(module.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '30px 15px',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '2.5rem' }}>{module.icon}</span>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: module.color }}>{module.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {module.description}
                        </p>
                        <button className="btn btn-secondary" style={{ marginTop: '5px', width: '100%' }}>
                            Acessar Módulo
                        </button>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3>📌 Notas Administrativas</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                    O módulo de gestão foi projetado para facilitar as tarefas do dia a dia.
                    Utilize os botões acima para navegar entre as diferentes áreas de controle.
                </p>
            </div>
        </div>
    );
}

export default ManagementHub;

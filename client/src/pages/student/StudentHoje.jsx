import { useState, useEffect } from 'react';
import { studentAreaAPI } from '../../services/api';
import { MessageSquare, Dumbbell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StudentHoje() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContact, setShowContact] = useState(false);
    const navigate = useNavigate();

    const studentName = localStorage.getItem('studentName');
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Reutilizamos getByToken se tivermos o token ou criamos um novo se necessário.
                // Aqui simulo o fetch usando o studentId + mock de sessões se o endpoint original for limitado.
                const res = await studentAreaAPI.getWorkout(studentId);
                const workoutData = res.data.data;
                setData(workoutData);

                // Atualizar localStorage com dados da publicação ativa
                if (workoutData.activePublication) {
                    localStorage.setItem('publicationId', workoutData.activePublication.id);
                }
                if (workoutData.student?.hasPremium !== undefined) {
                    localStorage.setItem('isPremium', workoutData.student.hasPremium);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const handleSessionClick = (session, idx) => {
        // Redireciona para o modo execução daquela sessão específica
        const sessionId = session.id || session.label || String.fromCharCode(65 + idx);
        const pubId = data?.activePublication?.id || localStorage.getItem('publicationId');
        navigate(`/area-aluno/execucao/${sessionId}`, {
            state: {
                session,
                publicationId: pubId
            }
        });
    };

    if (loading) {
        return (
            <div className="sa-container">
                <div className="sa-skeleton" style={{ height: '40px', width: '150px', marginBottom: '20px' }}></div>
                <div className="sa-card">
                    <div className="sa-skeleton" style={{ height: '20px', width: '80%', marginBottom: '10px' }}></div>
                    <div className="sa-skeleton" style={{ height: '16px', width: '60%' }}></div>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="sa-card">
                        <div className="sa-skeleton" style={{ height: '60px' }}></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="sa-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'var(--sa-primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Dumbbell size={20} color="white" />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '20px' }}>NovaFitness</span>
                </div>
                <button
                    onClick={() => setShowContact(true)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--sa-text-sec)', padding: '8px' }}
                >
                    <MessageSquare size={24} />
                </button>
            </header>

            <div className="sa-card" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
                <h1 className="sa-title">Olá, {studentName.split(' ')[0]}! 👋</h1>
                <p className="sa-subtitle" style={{ margin: 0 }}>Foco total: {data?.objetivo || 'Seu melhor'}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Treino Ativo</h2>
                    <span className="sa-badge sa-badge-success">Vigente</span>
                </div>

                <div className="sa-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500' }}>{data?.prescricao?.modelo || 'Personalizado'}</span>
                        <span style={{ color: 'var(--sa-text-sec)', fontSize: '13px' }}>0% concluído</span>
                    </div>
                    <div style={{ background: 'var(--sa-border)', height: '6px', borderRadius: '3px' }}>
                        <div style={{ background: 'var(--sa-primary)', width: '5%', height: '100%', borderRadius: '3px' }}></div>
                    </div>
                </div>
            </div>

            <div>
                <h3 style={{ fontSize: '14px', color: 'var(--sa-text-sec)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Minhas Sessões</h3>
                {(data?.prescricao?.sessoes || []).map((session, idx) => (
                    <div key={idx} className="sa-card" onClick={() => handleSessionClick(session, idx)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--sa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800' }}>
                                {session.dia || session.label || String.fromCharCode(65 + idx)}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Treino {session.dia || session.label || String.fromCharCode(65 + idx)}</div>
                                <div style={{ fontSize: '12px', color: 'var(--sa-text-sec)' }}>{session.itens?.length || 0} exercícios</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="sa-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--sa-text-sec)' }}>Pendente</span>
                            <ChevronRight size={20} color="var(--sa-text-sec)" />
                        </div>
                    </div>
                ))}
            </div>

            {showContact && (
                <div className="sa-overlay" onClick={() => setShowContact(false)}>
                    <div className="sa-bottom-sheet" onClick={(e) => e.stopPropagation()}>
                        <h3 className="sa-title" style={{ fontSize: '20px' }}>Falar com o Treinador</h3>
                        <p className="sa-subtitle">Dúvidas sobre o treino ou feedback?</p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                            <button className="sa-badge" style={{ border: '1px solid var(--sa-border)', background: 'transparent', color: 'var(--sa-text)' }}>Dúvida 🔥</button>
                            <button className="sa-badge" style={{ border: '1px solid var(--sa-border)', background: 'transparent', color: 'var(--sa-text)' }}>Sugestão 💡</button>
                            <button className="sa-badge" style={{ border: '1px solid var(--sa-border)', background: 'transparent', color: 'var(--sa-text)' }}>Estou com dor 😟</button>
                        </div>

                        <textarea
                            className="sa-card"
                            placeholder="Escreva sua mensagem..."
                            style={{ width: '100%', minHeight: '100px', marginBottom: '16px', color: 'white', resize: 'none' }}
                        ></textarea>

                        <button className="sa-btn-primary" onClick={() => setShowContact(false)}>Enviar Mensagem</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentHoje;

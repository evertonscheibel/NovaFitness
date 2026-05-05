import { useState, useEffect } from 'react';
import { studentAreaAPI } from '../../services/api';
import { Calendar, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StudentTreinos() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Endpoint para pegar todas as publicações do aluno
                const res = await studentAreaAPI.getPublications(studentId);
                setHistory(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [studentId]);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleStartSession = (session, publicationId) => {
        navigate(`/area-aluno/execucao/${session.id || session.label}`, {
            state: {
                session,
                publicationId
            }
        });
    };

    if (loading) {
        return (
            <div className="sa-container">
                <h1 className="sa-title">Histórico</h1>
                {[1, 2, 3].map(i => <div key={i} className="sa-card sa-skeleton" style={{ height: '80px' }}></div>)}
            </div>
        );
    }

    return (
        <div className="sa-container">
            <h1 className="sa-title">Meus Treinos</h1>
            <p className="sa-subtitle">Histórico de planos recebidos</p>

            {history.length === 0 ? (
                <div className="sa-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>Você ainda não tem histórico de treinos publicados.</p>
                </div>
            ) : (
                history.map((item) => (
                    <div key={item.id} className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div
                            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => toggleExpand(item.id)}
                        >
                            <div>
                                <div style={{ fontWeight: '600' }}>#{item.version} - {new Date(item.createdAt).toLocaleDateString()}</div>
                                <div style={{ fontSize: '12px', color: 'var(--sa-text-sec)' }}>
                                    {Object.keys(item.data?.sessoes || {}).length} sessões publicadas
                                </div>
                            </div>
                            {expanded === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>

                        {expanded === item.id && (
                            <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--sa-border)', padding: '16px' }}>
                                {(item.data?.sessoes || []).map((sessao, sIdx) => (
                                    <div key={sIdx} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sa-primary)', marginBottom: '4px' }}>
                                                SESSÃO {sessao.label || sessao.dia || String.fromCharCode(65 + sIdx)}
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--sa-text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                                {(sessao.itens || []).map(ex => ex.nome_exercicio).join(', ')}
                                            </div>
                                        </div>
                                        <button
                                            className="sa-btn-primary"
                                            style={{ width: 'auto', padding: '8px 16px', fontSize: '12px', height: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            onClick={() => handleStartSession(sessao, item.id)}
                                        >
                                            <PlayCircle size={16} /> Iniciar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default StudentTreinos;

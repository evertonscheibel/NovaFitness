import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentAPI, trainerAPI, aiAPI } from '../services/api';

function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            const response = await studentAPI.getById(id);
            setStudent(response.data.data.student);
            setWorkouts(response.data.data.workouts);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateWorkout = async () => {
        if (!confirm('Gerar novo treino para este aluno usando IA?')) return;
        try {
            const res = await aiAPI.generate(id);
            alert('Sugestão de treino gerada com sucesso! Redirecionando para edição... 🤖');
            // Navigate to builder with the suggestion
            navigate(`/student/${id}/workout/new`, { state: { suggestion: res.data.data } });
        } catch (error) {
            console.error('Erro ao gerar treino:', error);
            alert('Erro ao gerar treino com IA. Tente criar manualmente.');
        }
    };

    if (loading || !student) return <div className="container"><div className="loading">⏳ Carregando...</div></div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/students')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <h2>👤 Perfil do Aluno</h2>
                <div>
                    <Link to={`/student/${id}/edit`} className="btn" style={{ marginRight: '10px' }}>
                        ✏️ Editar
                    </Link>
                    <Link to={`/student/${id}/workout/new`} className="btn" style={{ marginRight: '10px' }}>
                        🏋️ Novo Treino (Manual)
                    </Link>
                    <button onClick={handleGenerateWorkout} className="btn btn-primary">
                        🤖 Sugerir com IA
                    </button>
                </div>
            </div>

            <div className="profile-grid">
                {/* Dados Pessoais */}
                <div className="card">
                    <h3>Dados Pessoais</h3>
                    <div className="info-list">
                        <p><strong>Nome:</strong> {student.nome}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Idade:</strong> {student.idade} anos</p>
                        <p><strong>Telefone:</strong> {student.telefone}</p>
                        <p><strong>Status:</strong> <span className="badge badge-success">{student.status || 'Ativo'}</span></p>
                        <p>
                            <strong>Acesso Premium:</strong>
                            {student.has_premium_access ? (
                                <span className="badge" style={{ backgroundColor: '#3b82f6', color: 'white', marginLeft: '5px' }}>
                                    💎 Liberado
                                </span>
                            ) : (
                                <span className="badge" style={{ backgroundColor: '#475569', color: 'white', marginLeft: '5px' }}>
                                    🚫 Bloqueado
                                </span>
                            )}
                        </p>
                    </div>

                </div>

                {/* Anamnese */}
                <div className="card">
                    <h3>Anamnese</h3>
                    <div className="info-list" style={{ marginBottom: '15px' }}>
                        <p><strong>Objetivo:</strong> {student.objetivo_principal}</p>
                        <p><strong>Experiência:</strong> {student.experiencia_prev}</p>
                        <p><strong>Frequência:</strong> {student.frequencia_semanal}</p>
                        <p><strong>Local:</strong> {student.local_treino}</p>
                        <p><strong>Restrições:</strong> {student.restricoes_medicas}</p>
                    </div>

                    {student.has_premium_access && (
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.05)',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px dashed #3b82f6'
                        }}>
                            <h4 style={{ margin: '0 0 10px', color: '#3b82f6', fontSize: '14px' }}>🔗 Link do Aplicativo (Área do Aluno)</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {(() => {
                                    const tokenValue = student.tokens?.[0]?.token;
                                    const link = tokenValue
                                        ? `${window.location.origin}/area-aluno/token/${tokenValue}`
                                        : `${window.location.origin}/area-aluno/${student.id}`;
                                    return (
                                        <>
                                            <input
                                                readOnly
                                                value={link}
                                                style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            />
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        navigator.clipboard.writeText(link)
                                                            .then(() => alert('Link copiado! Envie para o aluno pelo WhatsApp. ✅'))
                                                            .catch(() => window.prompt("Copie manualmente:", link));
                                                    } else {
                                                        window.prompt("Copie manualmente:", link);
                                                    }
                                                }}
                                            >
                                                Copiar
                                            </button>
                                            {!tokenValue && (
                                                <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '5px' }}>
                                                    ⚠️ Nenhum token gerado. Gere um token na lista de alunos.
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Histórico de Treinos */}
            <div className="card mt-4">
                <h3>📅 Histórico de Treinos</h3>
                {workouts.length === 0 ? (
                    <p className="empty-state">Nenhum treino registrado.</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Data Aprovação</th>
                                    <th>Vigência</th>
                                    <th>Treinador</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workouts.map(workout => (
                                    <tr key={workout.id}>
                                        <td>{new Date(workout.aprovado_em).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {workout.validade_inicio && workout.validade_fim ?
                                                `${new Date(workout.validade_inicio).toLocaleDateString('pt-BR')} - ${new Date(workout.validade_fim).toLocaleDateString('pt-BR')}`
                                                : '-'}
                                        </td>
                                        <td>{workout.treinador}</td>
                                        <td>
                                            <span className={`badge ${workout.status === 'Vigente' ? 'badge-success' : 'badge-secondary'}`}>
                                                {workout.status}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '5px' }}>
                                            <Link to={`/workout/${workout.id}`} className="btn btn-sm">
                                                👁️ Ver
                                            </Link>
                                            <Link to={`/workout/${workout.id}/edit`} className="btn btn-sm" style={{ background: '#f59e0b', color: 'white' }}>
                                                ✏️ Editar
                                            </Link>
                                            <a
                                                href={trainerAPI.getPDF(workout.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm"
                                            >
                                                📄 PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentProfile;

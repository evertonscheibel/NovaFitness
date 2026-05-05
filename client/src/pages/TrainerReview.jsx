import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainerAPI, studentAPI } from '../services/api';

function TrainerReview() {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [approvalData, setApprovalData] = useState({
        validade_inicio: new Date().toISOString().split('T')[0],
        validade_fim: '',
        observacoes: ''
    });

    useEffect(() => {
        loadSuggestions();
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentAPI.getAll();
            setStudents(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    };

    const loadSuggestions = async () => {
        try {
            const response = await trainerAPI.getSuggestions();
            setSuggestions(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar sugestões:', error);
            alert('Erro ao carregar sugestões');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (suggestionId) => {
        if (!confirm('Aprovar este treino?')) return;

        try {
            await trainerAPI.approve(suggestionId, approvalData);

            // Tentar descobrir o ID do aluno para gerar o link
            const studentId = selectedSuggestion.student_id;
            const studentLink = `${window.location.origin}/area-aluno/${studentId}`;

            alert(`Treino aprovado com sucesso! ✅\n\nLink da Área do Aluno:\n${studentLink}\n\n(Copiado para a área de transferência)`);

            // Copiar automaticamente para facilitar
            try {
                navigator.clipboard.writeText(studentLink);
            } catch (e) {
                console.warn('Falha ao copiar link automaticamente');
            }

            setSelectedSuggestion(null);
            loadSuggestions();
        } catch (error) {
            console.error('Erro ao aprovar:', error);
            alert('Erro ao aprovar treino: ' + (error.response?.data?.error || error.message));
        }
    };


    if (loading) {
        return (
            <div className="container">
                <div className="loading">⏳ Carregando...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <h2>👨‍⚕️ Área do Treinador</h2>
            <p className="subtitle">Revise e aprove os treinos gerados pela IA</p>

            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#0369a1' }}>🔗 Link para Auto-Cadastro</h3>
                        <p style={{ margin: '5px 0 0', color: '#0c4a6e' }}>
                            Disponibilize este link ou gere um QR Code para seus alunos se cadastrarem sozinhos.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <code style={{ padding: '8px', background: 'white', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                            {window.location.origin}/cadastro-aluno
                        </code>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/cadastro-aluno`);
                                alert('Link copiado para a área de transferência!');
                            }}
                        >
                            📋 Copiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Student Management Section */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3>🔍 Gestão de Treinos</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label>Selecione um Aluno</label>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Selecione um aluno...</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.nome} {student.status === 'Inativo' ? '(Inativo)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn btn-primary"
                        disabled={!selectedStudentId}
                        onClick={() => navigate(`/student/${selectedStudentId}/workout/new`)}
                    >
                        ➕ Gerar Novo Treino
                    </button>
                    <button
                        className="btn btn-secondary"
                        disabled={!selectedStudentId}
                        onClick={() => navigate(`/student/${selectedStudentId}`)}
                    >
                        👤 Ver Perfil
                    </button>
                </div>
            </div>

            {suggestions.length === 0 ? (
                <div className="card">
                    <p className="empty-state">✅ Nenhuma sugestão pendente no momento.</p>
                </div>
            ) : (
                <div className="suggestions-grid">
                    {suggestions.map(suggestion => (
                        <div key={suggestion.id} className="card suggestion-card">
                            <div className="suggestion-header">
                                <h3>👤 {suggestion.student?.nome || 'Aluno'}</h3>
                                <span className="badge badge-warning">Pendente</span>
                            </div>

                            <div className="suggestion-info">
                                <p><strong>Idade:</strong> {suggestion.student?.idade} anos</p>
                                <p><strong>Objetivo:</strong> {suggestion.student?.objetivo_principal}</p>
                                <p><strong>Experiência:</strong> {suggestion.student?.experiencia_prev}</p>
                                {suggestion.student?.restricoes_medicas && (
                                    <p className="warning-text">
                                        <strong>⚠️ Restrições:</strong> {suggestion.student.restricoes_medicas}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedSuggestion(suggestion)}
                                className="btn btn-primary"
                            >
                                👁️ Visualizar Treino
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedSuggestion && (
                <div className="modal-overlay" onClick={() => setSelectedSuggestion(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📋 Treino - {selectedSuggestion.student?.nome}</h2>
                            <button
                                onClick={() => setSelectedSuggestion(null)}
                                className="btn-close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            {selectedSuggestion.json_sugestao.prescricao && (
                                <>
                                    <div className="workout-info">
                                        <p><strong>Modelo:</strong> {selectedSuggestion.json_sugestao.prescricao.modelo}</p>
                                        <p><strong>Dias:</strong> {selectedSuggestion.json_sugestao.prescricao.dias_semana?.join(', ')}</p>
                                    </div>

                                    {selectedSuggestion.json_sugestao.prescricao.sessoes?.map((sessao, idx) => (
                                        <div key={idx} className="workout-session">
                                            <h3>Treino {sessao.dia}</h3>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Exercício</th>
                                                        <th>Séries</th>
                                                        <th>Reps</th>
                                                        <th>Carga</th>
                                                        <th>Descanso</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sessao.itens?.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{item.ordem}</td>
                                                            <td>
                                                                {item.nome_exercicio}
                                                                {item.observacoes && (
                                                                    <div className="obs-text">{item.observacoes}</div>
                                                                )}
                                                            </td>
                                                            <td>{item.series}</td>
                                                            <td>{item.reps}</td>
                                                            <td>{item.carga_sugerida}</td>
                                                            <td>{item.descanso_seg}s</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}

                                    {selectedSuggestion.json_sugestao.prescricao.cardio && (
                                        <div className="cardio-section">
                                            <h3>💨 Cardio</h3>
                                            <p><strong>Tipo:</strong> {selectedSuggestion.json_sugestao.prescricao.cardio.tipo}</p>
                                            <p><strong>Duração:</strong> {selectedSuggestion.json_sugestao.prescricao.cardio.duracao_min} min</p>
                                            <p><strong>Intensidade:</strong> {selectedSuggestion.json_sugestao.prescricao.cardio.intensidade}</p>
                                        </div>
                                    )}

                                    {selectedSuggestion.json_sugestao.para_treinador && (
                                        <div className="trainer-notes">
                                            <h3>📝 Notas para o Treinador</h3>
                                            {selectedSuggestion.json_sugestao.para_treinador.pontos_de_atencao && (
                                                <div>
                                                    <strong>Pontos de Atenção:</strong>
                                                    <ul>
                                                        {selectedSuggestion.json_sugestao.para_treinador.pontos_de_atencao.map((ponto, i) => (
                                                            <li key={i}>{ponto}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="approval-form">
                                        <h3>✅ Dados da Aprovação</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Início da Vigência</label>
                                                <input
                                                    type="date"
                                                    value={approvalData.validade_inicio}
                                                    onChange={e => setApprovalData({ ...approvalData, validade_inicio: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Fim da Vigência</label>
                                                <input
                                                    type="date"
                                                    value={approvalData.validade_fim}
                                                    onChange={e => setApprovalData({ ...approvalData, validade_fim: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Observações do Treinador</label>
                                            <textarea
                                                rows="3"
                                                value={approvalData.observacoes}
                                                onChange={e => setApprovalData({ ...approvalData, observacoes: e.target.value })}
                                                placeholder="Observações adicionais para o aluno..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setSelectedSuggestion(null)}
                                className="btn"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => navigate(`/student/${selectedSuggestion.student_id}/workout/new`, {
                                    state: { suggestion: selectedSuggestion }
                                })}
                                className="btn btn-warning"
                                style={{ marginRight: '10px' }}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={() => handleApprove(selectedSuggestion.id)}
                                className="btn btn-success"
                            >
                                ✅ Aprovar Treino
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrainerReview;

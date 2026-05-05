import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trainerAPI } from '../services/api';

function WorkoutDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkout();
    }, [id]);

    const loadWorkout = async () => {
        try {
            const response = await trainerAPI.getWorkoutById(id);
            setWorkout(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar treino:', error);
            alert('Erro ao carregar detalhes do treino');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este treino permanentemente?')) return;
        try {
            await trainerAPI.deleteWorkout(id);
            alert('Treino excluído com sucesso!');
            navigate('/workouts');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir treino');
        }
    };

    if (loading) return <div className="container"><div className="loading">⏳ Carregando...</div></div>;
    if (!workout) return <div className="container">Treino não encontrado</div>;

    const prescricao = workout.prescricao || {};

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <button onClick={() => navigate(-1)} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                        ← Voltar
                    </button>
                    <h2>🏋️ Detalhes do Treino</h2>
                    <p className="subtitle">Aluno: {workout.student?.nome}</p>
                </div>
                <div>
                    <button
                        onClick={() => navigate(`/workout/${workout.id}/edit`)}
                        className="btn"
                        style={{ marginRight: '10px', background: '#f59e0b', color: 'white' }}
                    >
                        ✏️ Editar
                    </button>
                    <a
                        href={trainerAPI.getPDF(workout.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        📄 Baixar PDF
                    </a>
                    <button
                        onClick={handleDelete}
                        className="btn"
                        style={{ marginLeft: '10px', background: '#dc3545', color: 'white' }}
                    >
                        🗑️ Excluir
                    </button>
                </div>
            </div>

            <div className="profile-grid">
                <div className="card">
                    <h3>Informações Gerais</h3>
                    <div className="info-list">
                        <p><strong>Modelo:</strong> {prescricao.modelo || workout.modelo}</p>
                        <p><strong>Vigência:</strong> {new Date(workout.validade_inicio).toLocaleDateString('pt-BR')} até {new Date(workout.validade_fim).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Treinador:</strong> {workout.treinador}</p>
                        <p><strong>Status:</strong> <span className="badge badge-success">{workout.status}</span></p>
                        <p><strong>Observações:</strong> {workout.observacoes || '-'}</p>
                    </div>
                </div>

                {prescricao.cardio && (
                    <div className="card">
                        <h3>🏃 Cardio</h3>
                        <div className="info-list">
                            <p><strong>Tipo:</strong> {prescricao.cardio.tipo}</p>
                            <p><strong>Duração:</strong> {prescricao.cardio.duracao_min} min</p>
                            <p><strong>Intensidade:</strong> {prescricao.cardio.intensidade}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="card mt-4">
                <h3>Exercícios</h3>
                {prescricao.sessoes?.map((sessao, idx) => (
                    <div key={idx} className="workout-session" style={{ marginTop: '20px' }}>
                        <h4 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Treino {sessao.dia}</h4>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Exercício</th>
                                        <th>Séries</th>
                                        <th>Reps</th>
                                        <th>Carga</th>
                                        <th>Descanso</th>
                                        <th>Obs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessao.itens?.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.nome_exercicio}</td>
                                            <td>{item.series}</td>
                                            <td>{item.reps}</td>
                                            <td>{item.carga_sugerida}</td>
                                            <td>{item.descanso_seg}s</td>
                                            <td>{item.observacoes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkoutDetail;

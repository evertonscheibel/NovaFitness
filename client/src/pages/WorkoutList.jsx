import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trainerAPI } from '../services/api';

function WorkoutList() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            const response = await trainerAPI.getWorkouts();
            setWorkouts(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar treinos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este treino?')) return;
        try {
            await trainerAPI.deleteWorkout(id);
            alert('Treino excluído com sucesso!');
            loadWorkouts();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir treino');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Vigente' ? 'Historico' : 'Vigente';
        try {
            await trainerAPI.updateWorkout(id, { status: newStatus });
            loadWorkouts();
        } catch (error) {
            console.error('Erro ao alternar status:', error);
            alert('Erro ao atualizar status do treino');
        }
    };

    const filteredWorkouts = workouts.filter(workout =>
        workout.student?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="container"><div className="loading">⏳ Carregando...</div></div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <h2>🏋️ Gerenciamento de Treinos</h2>
            </div>

            <div className="card">
                <div className="filters-form">
                    <div className="form-group" style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Buscar por aluno ou modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>Modelo</th>
                                <th>Vigência</th>
                                <th>Treinador</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWorkouts.map(workout => (
                                <tr key={workout.id}>
                                    <td>
                                        <Link to={`/student/${workout.student?.id}`} style={{ fontWeight: 'bold' }}>
                                            {workout.student?.nome || 'Aluno Removido'}
                                        </Link>
                                    </td>
                                    <td>{workout.prescricao?.modelo || workout.modelo}</td>
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
                                    <td>
                                        <Link to={`/workout/${workout.id}`} className="btn btn-sm">
                                            👁️
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(workout.id, workout.status)}
                                            className={`btn btn-sm ${workout.status === 'Vigente' ? 'btn-secondary' : 'btn-success'}`}
                                            style={{ marginLeft: '5px' }}
                                            title={workout.status === 'Vigente' ? 'Desativar' : 'Ativar'}
                                        >
                                            {workout.status === 'Vigente' ? '🚫' : '✅'}
                                        </button>
                                        <a
                                            href={trainerAPI.getPDF(workout.id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm"
                                            style={{ marginLeft: '5px' }}
                                        >
                                            📄
                                        </a>
                                        <button
                                            onClick={() => handleDelete(workout.id)}
                                            className="btn btn-sm"
                                            style={{ marginLeft: '5px', background: '#dc3545', color: 'white' }}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WorkoutList;

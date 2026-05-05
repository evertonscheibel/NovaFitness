import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { standardWorkoutAPI } from '../services/api';
import { Plus, Trash2, Edit2, Check, X, Search } from 'lucide-react';

function StandardWorkoutsPage() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        gender: 'ALL',
        level: 'Iniciante',
        data: { sessoes: [] }
    });

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            const res = await standardWorkoutAPI.getAll();
            setWorkouts(res.data.data);
        } catch (error) {
            console.error('Erro ao buscar treinos padrão:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingWorkout) {
                await standardWorkoutAPI.update(editingWorkout.id, formData);
            } else {
                await standardWorkoutAPI.create(formData);
            }
            setShowModal(false);
            setEditingWorkout(null);
            setFormData({ name: '', gender: 'ALL', level: 'Iniciante', data: { sessoes: [] } });
            fetchWorkouts();
        } catch (error) {
            console.error('Erro ao salvar treino padrão:', error);
            alert('Erro ao salvar treino padrão.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este treino padrão?')) return;
        try {
            await standardWorkoutAPI.delete(id);
            fetchWorkouts();
        } catch (error) {
            console.error('Erro ao excluir treino padrão:', error);
        }
    };

    const openEdit = (workout) => {
        setEditingWorkout(workout);
        setFormData({
            name: workout.name,
            gender: workout.gender,
            level: workout.level,
            data: workout.data
        });
        setShowModal(true);
    };

    return (
        <div className="container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => navigate('/management')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>📋 Treinos Padrão</h2>
                    <p className="subtitle">Modelos de treinos para agilizar a prescrição.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingWorkout(null); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Novo Modelo
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            ) : workouts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <p>Nenhum treino padrão cadastrado.</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {workouts.map((workout) => (
                        <div key={workout.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ marginBottom: '8px' }}>{workout.name}</h3>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    <span className={`badge ${workout.gender === 'M' ? 'badge-primary' : workout.gender === 'F' ? 'badge-secondary' : 'badge-info'}`}>
                                        {workout.gender === 'M' ? 'Masculino' : workout.gender === 'F' ? 'Feminino' : 'Todos'}
                                    </span>
                                    <span className="badge badge-outline">
                                        {workout.level}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {workout.data?.sessoes?.length || 0} sessões configuradas
                                </p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button className="btn btn-sm" onClick={() => openEdit(workout)} style={{ padding: '8px' }}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(workout.id)} style={{ padding: '8px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{editingWorkout ? 'Editar Modelo' : 'Novo Modelo'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}><X /></button>
                        </div>

                        <div className="form-group">
                            <label>Nome do Modelo</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Hipertrofia Iniciante Feminino"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Gênero</label>
                                <select
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="ALL">Todos</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nível</label>
                                <select
                                    className="form-control"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                >
                                    <option value="Iniciante">Iniciante</option>
                                    <option value="Intermediario">Intermediário</option>
                                    <option value="Avancado">Avançado</option>
                                </select>
                            </div>
                        </div>

                        <div className="info-box" style={{ marginTop: '10px', marginBottom: '20px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>
                                💡 Para configurar as sessões e exercícios, use o gerador de treinos em um aluno e clique em "Salvar como Modelo" (em breve).
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave}>Salvar Modelo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StandardWorkoutsPage;

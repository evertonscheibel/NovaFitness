import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exerciseAPI, referenceAPI } from '../services/api';
import { handleAPIError } from '../utils/error';
import LoadingSpinner from '../components/LoadingSpinner';
import ExerciseFormModal from './exercise-catalog/ExerciseFormModal';
import ReferenceManageModal from './exercise-catalog/ReferenceManageModal';
import ImagePreviewModal from './exercise-catalog/ImagePreviewModal';

function ExerciseCatalog() {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrupo, setFilterGrupo] = useState('');
    const [filterActiveOnly, setFilterActiveOnly] = useState(false);

    const [uploading, setUploading] = useState(false);

    // Novos estados para funcionalidades de imagem
    const [directUploadId, setDirectUploadId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const initialFormData = {
        nome: '',
        grupo_muscular: 'Peito',
        equipamento: 'Maquina',
        nivel: ['Iniciante'],
        local: ['Academia'],
        descricao: '',
        video_url: '',
        image_url: '',
        ativo: true
    };

    const [formData, setFormData] = useState(initialFormData);

    // Estados para gestão de referências (Grupos/Equipamentos)
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [showManageModal, setShowManageModal] = useState(false);
    const [manageType, setManageType] = useState('group'); // 'group' or 'equipment'
    const [newItemName, setNewItemName] = useState('');
    const [manageList, setManageList] = useState([]); // Lista atual sendo gerida

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadExercises(),
                loadReferences()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const loadReferences = async () => {
        try {
            const [groupsRes, equipRes] = await Promise.all([
                referenceAPI.getMuscleGroups(true),
                referenceAPI.getEquipment(true)
            ]);
            setMuscleGroups(groupsRes.data.data);
            setEquipments(equipRes.data.data);
        } catch (error) {
            console.error('Erro ao carregar referências:', error);
        }
    };

    const handleOpenManage = (type) => {
        setManageType(type);
        setManageList(type === 'group' ? muscleGroups : equipments);
        setNewItemName('');
        setShowManageModal(true);
    };

    const handleAddReference = async (e) => {
        e.preventDefault();
        try {
            if (manageType === 'group') {
                await referenceAPI.createMuscleGroup({ name: newItemName });
            } else {
                await referenceAPI.createEquipment({ name: newItemName });
            }
            await loadReferences();
            setNewItemName('');
            alert('Item adicionado com sucesso!');
        } catch (error) {
            handleAPIError(error, 'Erro ao adicionar');
        }
    };

    const handleToggleReference = async (id, currentStatus) => {
        try {
            if (manageType === 'group') {
                await referenceAPI.toggleMuscleGroup(id, !currentStatus);
            } else {
                await referenceAPI.toggleEquipment(id, !currentStatus);
            }
            loadReferences();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    useEffect(() => {
        if (showManageModal) {
            setManageList(manageType === 'group' ? muscleGroups : equipments);
        }
    }, [muscleGroups, equipments, showManageModal, manageType]);

    const loadExercises = async () => {
        try {
            const response = await exerciseAPI.getAll({ includeInactive: 'true' });
            setExercises(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar exercícios:', error);
        }
    };

    const handleOpenModal = (exercise = null) => {
        if (exercise) {
            setEditingExercise(exercise);
            setFormData({
                nome: exercise.nome,
                grupo_muscular: exercise.grupo_muscular,
                equipamento: exercise.equipamento,
                nivel: exercise.nivel || ['Iniciante'],
                local: exercise.local || ['Academia'],
                descricao: exercise.descricao || '',
                video_url: exercise.video_url || '',
                image_url: exercise.image_url || '',
                ativo: exercise.ativo ?? true
            });
        } else {
            setEditingExercise(null);
            setFormData(initialFormData);
        }
        setShowModal(true);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append('image', file);

        setUploading(true);
        try {
            const response = await exerciseAPI.uploadImage(formDataFile);
            setFormData(prev => ({ ...prev, image_url: response.data.url }));
        } catch (error) {
            handleAPIError(error, 'Erro ao fazer upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExercise) {
                await exerciseAPI.update(editingExercise.id, formData);
                alert('Exercício atualizado com sucesso!');
            } else {
                await exerciseAPI.create(formData);
                alert('Exercício criado com sucesso!');
            }
            setShowModal(false);
            loadExercises();
        } catch (error) {
            handleAPIError(error, 'Erro ao salvar exercício');
        }
    };

    const handleDelete = async (id, nome) => {
        if (!confirm(`Deseja realmente desativar o exercício "${nome}"?`)) return;
        try {
            await exerciseAPI.delete(id);
            alert('Exercício desativado!');
            loadExercises();
        } catch (error) {
            handleAPIError(error, 'Erro ao excluir exercício');
        }
    };

    const handleTriggerUpload = (id) => {
        setDirectUploadId(id);
        fileInputRef.current.click();
    };

    const handleDirectFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !directUploadId) return;

        const formDataFile = new FormData();
        formDataFile.append('image', file);

        setUploading(true);
        try {
            const response = await exerciseAPI.uploadImage(formDataFile);
            const newImageUrl = response.data.url;
            await exerciseAPI.update(directUploadId, { image_url: newImageUrl });
            alert('Imagem atualizada com sucesso!');
            loadExercises();
        } catch (error) {
            handleAPIError(error, 'Erro ao enviar imagem');
        } finally {
            setUploading(false);
            setDirectUploadId(null);
            e.target.value = '';
        }
    };

    const filteredExercises = exercises.filter(ex =>
        (ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.equipamento.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGrupo === '' || ex.grupo_muscular === filterGrupo) &&
        (!filterActiveOnly || ex.ativo)
    );

    const totalExercises = exercises.length;
    const uniqueEquipments = [...new Set(exercises.map(ex => ex.equipamento))].length;
    const totalGroups = muscleGroups.length;

    if (loading) return <LoadingSpinner message="Carregando catálogo..." />;

    return (
        <div className="container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => navigate('/management')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <div>
                    <h2>🏋️ Catálogo de Exercícios e Aparelhos</h2>
                    <p className="subtitle">Gestão de base de dados para prescrição de treinos.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    ➕ Novo Exercício
                </button>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div
                    className="stat-card"
                    onClick={() => { setFilterActiveOnly(false); setFilterGrupo(''); setSearchTerm(''); }}
                    style={{ cursor: 'pointer', border: !filterActiveOnly && filterGrupo === '' ? '2px solid var(--primary)' : 'none' }}
                >
                    <h3>{totalExercises}</h3>
                    <p>Total de Itens (Resetar)</p>
                </div>
                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleOpenManage('equipment')}>
                    <h3>{uniqueEquipments}</h3>
                    <p>Aparelhos/Equip. ⚙️</p>
                </div>
                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleOpenManage('group')}>
                    <h3>{totalGroups}</h3>
                    <p>Grupos Musculares 💪</p>
                </div>
            </div>

            <div className="card">
                <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou aparelho..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <select value={filterGrupo} onChange={(e) => setFilterGrupo(e.target.value)}>
                            <option value="">Todos os Grupos</option>
                            {muscleGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Grupo</th>
                                <th>Equipamento</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExercises.map(ex => (
                                <tr key={ex.id}>
                                    <td>
                                        {ex.image_url ? (
                                            <div
                                                onClick={() => setPreviewImage(ex.image_url)}
                                                style={{ width: '50px', height: '50px', cursor: 'zoom-in' }}
                                                title="Clique para ampliar"
                                            >
                                                <img
                                                    src={ex.image_url}
                                                    alt={ex.nome}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleTriggerUpload(ex.id)}
                                                className="btn btn-sm btn-outline-primary"
                                                style={{ width: '50px', height: '50px', borderRadius: '4px', fontSize: '20px', padding: 0 }}
                                                disabled={uploading}
                                            >
                                                {uploading && directUploadId === ex.id ? '⏳' : '+'}
                                            </button>
                                        )}
                                    </td>
                                    <td><strong>{ex.nome}</strong></td>
                                    <td><span className="badge badge-info">{ex.grupo_muscular}</span></td>
                                    <td>{ex.equipamento}</td>
                                    <td>
                                        <span className={`badge ${ex.ativo ? 'badge-success' : 'badge-danger'}`}>
                                            {ex.ativo ? 'ATIVO' : 'INATIVO'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenModal(ex)} className="btn btn-sm btn-secondary">✏️ Editar</button>
                                        <button onClick={() => handleDelete(ex.id, ex.nome)} className="btn btn-sm btn-danger" style={{ marginLeft: '5px' }}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExerciseFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                editingExercise={editingExercise}
                formData={formData}
                setFormData={setFormData}
                muscleGroups={muscleGroups}
                equipments={equipments}
                handleFileChange={handleFileChange}
                uploading={uploading}
            />

            <ReferenceManageModal
                isOpen={showManageModal}
                onClose={() => setShowManageModal(false)}
                manageType={manageType}
                newItemName={newItemName}
                setNewItemName={setNewItemName}
                handleAddReference={handleAddReference}
                manageList={manageList}
                handleToggleReference={handleToggleReference}
            />

            <ImagePreviewModal
                isOpen={!!previewImage}
                image={previewImage}
                onClose={() => setPreviewImage(null)}
            />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleDirectFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default ExerciseCatalog;

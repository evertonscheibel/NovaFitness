import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { studentAPI, exerciseAPI, trainerAPI, standardWorkoutAPI, aiAPI } from '../services/api';
import { Save, ClipboardList, Sparkles, UserPlus } from 'lucide-react';

function WorkoutBuilder() {
    const { id, workoutId } = useParams(); // id = studentId (create), workoutId = workout (edit)
    const isEditMode = !!workoutId;
    const navigate = useNavigate();
    const location = useLocation(); // Hook para receber estado
    const [student, setStudent] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trainerName, setTrainerName] = useState('');
    const [workoutData, setWorkoutData] = useState({
        modelo: 'ABC',
        validade_inicio: new Date().toISOString().split('T')[0],
        validade_fim: '',
        observacoes: '',
        sessoes: [
            { dia: 'A', grupos: [], exercicios: [] },
            { dia: 'B', grupos: [], exercicios: [] },
            { dia: 'C', grupos: [], exercicios: [] }
        ]
    });
    const [templates, setTemplates] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

    const gruposDisponiveis = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'];

    useEffect(() => {
        loadData();
    }, [id]);

    // Effect para carregar sugestão da IA se houver
    useEffect(() => {
        if (!loading && exercises.length > 0 && location.state?.suggestion) {
            console.log("📥 Carregando sugestão da IA para edição:", location.state.suggestion);
            const { prescricao } = location.state.suggestion.json_sugestao;

            if (prescricao) {
                // Mapear sessões da IA para o formato do Builder
                const mappedSessoes = (prescricao.sessoes || []).map(sessaoIA => {
                    const exerciciosMapeados = (sessaoIA.itens || []).map(item => {
                        // Tentar encontrar ID do exercício pelo nome (Case Insensitive e Trimmed)
                        const exercicioEncontrado = exercises.find(e =>
                            e.nome.toLowerCase().trim() === item.nome_exercicio.toLowerCase().trim() ||
                            item.nome_exercicio.toLowerCase().includes(e.nome.toLowerCase()) // Fallback parcial
                        );

                        return {
                            exercicio_id: exercicioEncontrado ? exercicioEncontrado.id : '',
                            nome: item.nome_exercicio, // Mantém nome original caso não ache ID
                            grupo: exercicioEncontrado ? exercicioEncontrado.grupo_muscular : 'Outros',
                            series: parseInt(item.series) || 3,
                            reps: item.reps || '10',
                            carga: item.carga_sugerida || '',
                            descanso_seg: parseInt(item.descanso_seg) || 60,
                            observacoes: item.observacoes || (exercicioEncontrado ? '' : `Exercício sugerido: ${item.nome_exercicio} (Não encontrado no banco)`)
                        };
                    });

                    // Extrair grupos musculares únicos dessa sessão
                    const gruposUnicos = [...new Set(exerciciosMapeados.map(e => e.grupo))];

                    return {
                        dia: sessaoIA.dia,
                        grupos: gruposUnicos,
                        exercicios: exerciciosMapeados
                    };
                });

                setWorkoutData(prev => ({
                    ...prev,
                    modelo: prescricao.modelo || 'Personalizado', // Ajustar conforme modelo IA
                    observacoes: `Treino gerado por IA. ${prev.observacoes}`,
                    sessoes: mappedSessoes
                }));
            }
        }
    }, [loading, exercises, location.state]);

    const loadData = async () => {
        try {
            if (isEditMode) {
                // Edit mode: load existing workout
                const [workoutRes, exercisesRes, templatesRes] = await Promise.all([
                    trainerAPI.getWorkoutById(workoutId),
                    exerciseAPI.getAll(),
                    standardWorkoutAPI.getAll()
                ]);
                const workoutData = workoutRes.data.data;
                const studentRes = await studentAPI.getById(workoutData.student_id);
                setStudent(studentRes.data.data.student);
                setExercises(exercisesRes.data.data);
                setTemplates(templatesRes.data.data);
                setTrainerName(workoutData.treinador || '');

                // Map existing prescricao to builder format
                const prescricao = workoutData.prescricao || {};
                const sessoesMapeadas = (prescricao.sessoes || []).map(sessao => ({
                    dia: sessao.dia,
                    grupos: [...new Set((sessao.itens || []).map(i => i.grupo_muscular || 'Outros').filter(Boolean))],
                    exercicios: (sessao.itens || []).map(item => ({
                        exercicio_id: item.exercicio_id || '',
                        nome: item.nome_exercicio || '',
                        grupo: item.grupo_muscular || 'Outros',
                        series: item.series || 3,
                        reps: item.reps || '10',
                        carga: item.carga_sugerida || '',
                        descanso_seg: item.descanso_seg || 60,
                        observacoes: item.observacoes || ''
                    }))
                }));

                setWorkoutData({
                    modelo: prescricao.modelo || 'ABC',
                    validade_inicio: workoutData.validade_inicio ? new Date(workoutData.validade_inicio).toISOString().split('T')[0] : '',
                    validade_fim: workoutData.validade_fim ? new Date(workoutData.validade_fim).toISOString().split('T')[0] : '',
                    observacoes: workoutData.observacoes || '',
                    sessoes: sessoesMapeadas
                });
            } else {
                // Create mode: load student data
                const [studentRes, exercisesRes, templatesRes] = await Promise.all([
                    studentAPI.getById(id),
                    exerciseAPI.getAll(),
                    standardWorkoutAPI.getAll()
                ]);
                setStudent(studentRes.data.data.student);
                setExercises(exercisesRes.data.data);
                setTemplates(templatesRes.data.data);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleModeloChange = (e) => {
        const modelo = e.target.value;
        const dias = modelo.split('');
        setWorkoutData({
            ...workoutData,
            modelo,
            sessoes: dias.map(dia => ({ dia, grupos: [], exercicios: [] }))
        });
    };

    const applyTemplate = (template) => {
        setWorkoutData(prev => ({
            ...prev,
            modelo: template.data.modelo || 'Personalizado',
            sessoes: template.data.sessoes || []
        }));
        setShowTemplates(false);
        alert(`Modelo "${template.name}" aplicado!`);
    };

    const handleSaveAsTemplate = async () => {
        const name = prompt('Nome do novo modelo:');
        if (!name) return;

        const gender = prompt('Gênero (M/F/ALL):', 'ALL')?.toUpperCase() || 'ALL';
        const level = prompt('Nível (Iniciante/Intermediario/Avancado):', 'Iniciante') || 'Iniciante';

        try {
            await standardWorkoutAPI.create({
                name,
                gender,
                level,
                data: {
                    modelo: workoutData.modelo,
                    sessoes: workoutData.sessoes
                }
            });
            alert('Modelo salvo com sucesso! ✅');
            // Refresh templates list
            const res = await standardWorkoutAPI.getAll();
            setTemplates(res.data.data);
        } catch (error) {
            console.error('Erro ao salvar modelo:', error);
            alert('Erro ao salvar modelo.');
        }
    };

    const handleGenerateAI = async () => {
        try {
            setGeneratingAI(true);
            const res = await aiAPI.generate(id);
            const suggestion = res.data.data;
            const prescricao = suggestion.json_sugestao.prescricao;

            if (prescricao) {
                const mappedSessoes = (prescricao.sessoes || []).map(sessaoIA => {
                    const exerciciosMapeados = (sessaoIA.itens || []).map(item => {
                        const exercicioEncontrado = exercises.find(e =>
                            e.nome.toLowerCase().trim() === item.nome_exercicio.toLowerCase().trim() ||
                            item.nome_exercicio.toLowerCase().includes(e.nome.toLowerCase())
                        );

                        return {
                            exercicio_id: exercicioEncontrado ? exercicioEncontrado.id : '',
                            nome: item.nome_exercicio,
                            grupo: exercicioEncontrado ? exercicioEncontrado.grupo_muscular : 'Outros',
                            series: parseInt(item.series) || 3,
                            reps: item.reps || '10',
                            carga: item.carga_sugerida || '',
                            descanso_seg: parseInt(item.descanso_seg) || 60,
                            observacoes: item.observacoes || (exercicioEncontrado ? '' : `Exercício sugerido: ${item.nome_exercicio} (Não encontrado no banco)`)
                        };
                    });

                    const gruposUnicos = [...new Set(exerciciosMapeados.map(e => e.grupo))];

                    return {
                        dia: sessaoIA.dia,
                        grupos: gruposUnicos,
                        exercicios: exerciciosMapeados
                    };
                });

                setWorkoutData(prev => ({
                    ...prev,
                    modelo: prescricao.modelo || 'Personalizado',
                    observacoes: `Treino gerado por IA em ${new Date().toLocaleDateString('pt-BR')}. ${prev.observacoes}`,
                    sessoes: mappedSessoes
                }));
            }
            alert('Sugestão da IA carregada com sucesso! Você pode editar as sessões abaixo.');
        } catch (error) {
            console.error('Erro ao gerar com IA:', error);
            alert('Erro ao gerar sugestão com IA. Tente novamente ou crie manualmente.');
        } finally {
            setGeneratingAI(false);
        }
    };

    const resetToPersonalized = () => {
        if (!window.confirm('Isso irá limpar o treino atual para começar do zero. Continuar?')) return;
        setWorkoutData({
            modelo: 'ABC',
            validade_inicio: new Date().toISOString().split('T')[0],
            validade_fim: '',
            observacoes: '',
            sessoes: [
                { dia: 'A', grupos: [], exercicios: [] },
                { dia: 'B', grupos: [], exercicios: [] },
                { dia: 'C', grupos: [], exercicios: [] }
            ]
        });
    };

    const toggleGrupo = (sessaoIdx, grupo) => {
        const newSessoes = [...workoutData.sessoes];
        const grupos = newSessoes[sessaoIdx].grupos;

        if (grupos.includes(grupo)) {
            newSessoes[sessaoIdx].grupos = grupos.filter(g => g !== grupo);
            // Remover exercícios desse grupo
            newSessoes[sessaoIdx].exercicios = newSessoes[sessaoIdx].exercicios.filter(
                ex => !exercises.find(e => e.id === ex.exercicio_id && e.grupo_muscular === grupo)
            );
        } else {
            newSessoes[sessaoIdx].grupos.push(grupo);
        }

        setWorkoutData({ ...workoutData, sessoes: newSessoes });
    };

    const addExercicio = (sessaoIdx, grupo) => {
        const newSessoes = [...workoutData.sessoes];
        newSessoes[sessaoIdx].exercicios.push({
            exercicio_id: '',
            nome: '',
            grupo,
            series: 4,
            reps: '8-12',
            carga: '',
            descanso_seg: 90,
            observacoes: ''
        });
        setWorkoutData({ ...workoutData, sessoes: newSessoes });
    };

    const updateExercicio = (sessaoIdx, exIdx, field, value) => {
        const newSessoes = [...workoutData.sessoes];
        newSessoes[sessaoIdx].exercicios[exIdx][field] = value;

        if (field === 'exercicio_id') {
            const exercise = exercises.find(e => e.id === value);
            if (exercise) {
                newSessoes[sessaoIdx].exercicios[exIdx].nome = exercise.nome;
            }
        }

        setWorkoutData({ ...workoutData, sessoes: newSessoes });
    };

    const removeExercicio = (sessaoIdx, exIdx) => {
        const newSessoes = [...workoutData.sessoes];
        newSessoes[sessaoIdx].exercicios.splice(exIdx, 1);
        setWorkoutData({ ...workoutData, sessoes: newSessoes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainerName.trim()) {
            alert('Por favor, informe o nome do treinador');
            return;
        }

        if (!workoutData.validade_fim) {
            alert('Por favor, defina a data de término da vigência');
            return;
        }

        try {
            if (isEditMode) {
                // Update existing workout
                const prescricao = {
                    modelo: workoutData.modelo,
                    dias_semana: workoutData.sessoes.map(s => s.dia),
                    sessoes: workoutData.sessoes.map(sessao => ({
                        dia: sessao.dia,
                        itens: sessao.exercicios.map((ex, idx) => ({
                            ordem: idx + 1,
                            exercicio_id: ex.exercicio_id,
                            nome_exercicio: ex.nome,
                            series: ex.series,
                            reps: ex.reps,
                            carga_sugerida: ex.carga,
                            descanso_seg: ex.descanso_seg,
                            observacoes: ex.observacoes || ''
                        }))
                    }))
                };

                await trainerAPI.updateWorkout(workoutId, {
                    prescricao,
                    validade_inicio: workoutData.validade_inicio,
                    validade_fim: workoutData.validade_fim,
                    observacoes: workoutData.observacoes,
                    status: 'Vigente'
                });
                alert('Treino atualizado com sucesso! ✅');
                navigate(`/workout/${workoutId}`);
            } else {
                // Create new workout
                await trainerAPI.createManual({
                    aluno_id: id,
                    ...workoutData,
                    treinador: trainerName
                });
                alert('Treino criado com sucesso! ✅');
                navigate(`/student/${id}`);
            }
        } catch (error) {
            console.error('Erro ao salvar treino:', error);
            alert('Erro ao salvar treino: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading || !student) {
        return <div className="container"><div className="loading">⏳ Carregando...</div></div>;
    }

    return (
        <div className="container">
            <button onClick={() => navigate(-1)} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>🏋️ {isEditMode ? 'Editar' : 'Criar'} Treino - {student.nome}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="btn btn-info"
                        onClick={handleGenerateAI}
                        disabled={generatingAI}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'white' }}
                    >
                        {generatingAI ? '⌛ Gerando...' : <><Sparkles size={20} /> Gerar com IA</>}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowTemplates(!showTemplates)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClipboardList size={20} /> Usar Modelo
                    </button>
                    <button type="button" className="btn" onClick={resetToPersonalized} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={20} /> Personalizado
                    </button>
                    <button type="button" className="btn" onClick={handleSaveAsTemplate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={20} /> Salvar como Modelo
                    </button>
                </div>
            </div>

            {showTemplates && (
                <div className="card" style={{ marginBottom: '20px', background: '#f0f4f8', border: '1px solid #d1d9e6' }}>
                    <h3 style={{ marginBottom: '15px' }}>Modelos Disponíveis</h3>
                    {templates.length === 0 ? (
                        <p>Nenhum modelo cadastrado. Vá em Gestão &gt; Treinos Padrão para criar novos.</p>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                            {templates.map(t => (
                                <div key={t.id} className="card clickable" onClick={() => applyTemplate(t)} style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>{t.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.gender} | {t.level}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card">
                <div className="form-row">
                    <div className="form-group">
                        <label>Nome do Treinador *</label>
                        <input
                            type="text"
                            value={trainerName}
                            onChange={(e) => setTrainerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Modelo de Treino *</label>
                        <select value={workoutData.modelo} onChange={handleModeloChange} required>
                            <option value="AB">AB (2 dias)</option>
                            <option value="ABC">ABC (3 dias)</option>
                            <option value="ABCD">ABCD (4 dias)</option>
                            <option value="ABCDE">ABCDE (5 dias)</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Início da Vigência *</label>
                        <input
                            type="date"
                            value={workoutData.validade_inicio}
                            onChange={(e) => setWorkoutData({ ...workoutData, validade_inicio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Fim da Vigência *</label>
                        <input
                            type="date"
                            value={workoutData.validade_fim}
                            onChange={(e) => setWorkoutData({ ...workoutData, validade_fim: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {workoutData.sessoes.map((sessao, sessaoIdx) => (
                    <div key={sessao.dia} className="card" style={{ marginTop: '20px', background: '#f8f9fa' }}>
                        <h3>Treino {sessao.dia}</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label><strong>Grupos Musculares:</strong></label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {gruposDisponiveis.map(grupo => (
                                    <label key={grupo} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input
                                            type="checkbox"
                                            checked={sessao.grupos.includes(grupo)}
                                            onChange={() => toggleGrupo(sessaoIdx, grupo)}
                                        />
                                        {grupo}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {sessao.grupos.map(grupo => (
                            <div key={grupo} style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>💪 {grupo}</h4>
                                    <button
                                        type="button"
                                        onClick={() => addExercicio(sessaoIdx, grupo)}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        ➕ Adicionar Exercício
                                    </button>
                                </div>

                                {sessao.exercicios
                                    .map((ex, exIdx) => ({ ex, exIdx }))
                                    .filter(({ ex }) => ex.grupo === grupo)
                                    .map(({ ex, exIdx }) => (
                                        <div key={exIdx} className="workout-builder-item" style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', display: 'flex' }}>
                                            <div className="form-row" style={{ flex: 1 }}>
                                                <div className="form-group" style={{ flex: 2 }}>
                                                    <label>Exercício</label>
                                                    <select
                                                        value={ex.exercicio_id}
                                                        onChange={(e) => updateExercicio(sessaoIdx, exIdx, 'exercicio_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {exercises
                                                            .filter(e => e.grupo_muscular === grupo)
                                                            .map(e => (
                                                                <option key={e.id} value={e.id}>{e.nome}</option>
                                                            ))}
                                                    </select>
                                                    {ex.exercicio_id && exercises.find(e => e.id === ex.exercicio_id)?.image_url && (
                                                        <div style={{ marginTop: '5px' }}>
                                                            <img
                                                                src={exercises.find(e => e.id === ex.exercicio_id).image_url}
                                                                alt="Exercício"
                                                                style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Séries</label>
                                                    <input
                                                        type="number"
                                                        value={ex.series}
                                                        onChange={(e) => updateExercicio(sessaoIdx, exIdx, 'series', parseInt(e.target.value))}
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Reps</label>
                                                    <input
                                                        type="text"
                                                        value={ex.reps}
                                                        onChange={(e) => updateExercicio(sessaoIdx, exIdx, 'reps', e.target.value)}
                                                        placeholder="8-12"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Carga</label>
                                                    <input
                                                        type="text"
                                                        value={ex.carga}
                                                        onChange={(e) => updateExercicio(sessaoIdx, exIdx, 'carga', e.target.value)}
                                                        placeholder="20kg"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Descanso (s)</label>
                                                    <input
                                                        type="number"
                                                        value={ex.descanso_seg}
                                                        onChange={(e) => updateExercicio(sessaoIdx, exIdx, 'descanso_seg', parseInt(e.target.value))}
                                                        min="30"
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: '10px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExercicio(sessaoIdx, exIdx)}
                                                    className="btn btn-sm btn-danger"
                                                    style={{ height: '45px' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                    ))}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Observações Gerais</label>
                    <textarea
                        value={workoutData.observacoes}
                        onChange={(e) => setWorkoutData({ ...workoutData, observacoes: e.target.value })}
                        rows="3"
                        placeholder="Observações para o aluno..."
                    />
                </div>

                <div className="form-row" style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate(`/student/${id}`)} className="btn">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        💾 Salvar Treino
                    </button>
                </div>
            </form>
        </div>
    );
}

export default WorkoutBuilder;

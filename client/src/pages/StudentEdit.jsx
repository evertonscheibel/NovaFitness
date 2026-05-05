import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';
import { OBJETIVOS, SEXO_OPTIONS } from '../constants/options';
import { handleAPIError } from '../utils/error';

function StudentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        idade: '',
        sexo: '',
        objetivo_principal: '',
        restricoes_medicas: '',
        has_premium_access: false
    });

    useEffect(() => {
        loadStudent();
    }, [id]);

    const loadStudent = async () => {
        try {
            const response = await studentAPI.getById(id);
            const student = response.data.data.student;
            // Garantir que carregamos apenas os dados relevantes ou todos, mas o submit filtra
            setFormData({
                ...student,
                has_premium_access: !!student.has_premium_access
            });
        } catch (error) {
            handleAPIError(error, 'Erro ao carregar dados do aluno');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filtrar apenas campos que podem ser editados para evitar enviar relations (tokens, workouts)
            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                idade: formData.idade,
                sexo: formData.sexo,
                objetivo_principal: formData.objetivo_principal,
                restricoes_medicas: formData.restricoes_medicas,
                has_premium_access: formData.has_premium_access
            };

            await studentAPI.update(id, payload);
            alert('Aluno atualizado com sucesso! ✅');
            navigate(`/student/${id}`);
        } catch (error) {
            handleAPIError(error, 'Erro ao atualizar aluno');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <button onClick={() => navigate(`/student/${id}`)} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                    ← Voltar
                </button>
                <h2>✏️ Editar Aluno</h2>
                <p className="subtitle">Atualize os dados do aluno</p>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nome Completo *</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Telefone *</label>
                            <input
                                type="tel"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Idade *</label>
                            <input
                                type="number"
                                name="idade"
                                value={formData.idade}
                                onChange={handleChange}
                                required
                                min="10"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Sexo *</label>
                            <select
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione...</option>
                                {SEXO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Objetivo Principal *</label>
                        <select
                            name="objetivo_principal"
                            value={formData.objetivo_principal}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {OBJETIVOS.map(obj => (
                                <option key={obj.value} value={obj.value}>{obj.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Restrições Físicas</label>
                        <textarea
                            name="restricoes_medicas"
                            value={formData.restricoes_medicas}
                            onChange={handleChange}
                            rows="2"
                        />
                    </div>

                    <div className="form-group premium-module">
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#3b82f6' }}>💎 Módulo Premium: Área do Aluno</h4>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                                    Libera o acesso do aluno ao aplicativo digital e acompanhamento em tempo real.
                                </p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="has_premium_access"
                                    checked={formData.has_premium_access}
                                    onChange={(e) => setFormData({ ...formData, has_premium_access: e.target.checked })}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>


                    <div className="form-row">
                        <button type="button" onClick={() => navigate(`/student/${id}`)} className="btn">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentEdit;

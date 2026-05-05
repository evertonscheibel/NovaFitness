import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI, aiAPI } from '../services/api';
import { OBJETIVOS, SEXO_OPTIONS } from '../constants/options';
import { handleAPIError } from '../utils/error';

const INITIAL_STATE = {
    nome: '',
    email: '',
    telefone: '',
    idade: '',
    sexo: 'M',
    objetivo_principal: '',
    restricoes_medicas: ''
};

function RegisterForm({ isPublic = false }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_STATE);

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
            // 1. Cadastrar aluno
            const studentResponse = await studentAPI.register(formData);
            const studentId = studentResponse.data.data.id;

            console.log('✅ Aluno cadastrado:', studentId);

            // 2. Gerar treino com IA
            await aiAPI.generate(studentId);

            console.log('✅ Treino gerado com IA');

            const successMsg = isPublic
                ? `Cadastro realizado com sucesso! 💪\n\nAgora você pode acessar seus treinos na Área do Aluno usando seu e-mail: ${formData.email}\n\nClique em OK para continuar.`
                : 'Aluno cadastrado e treino gerado com sucesso! 💪';

            alert(successMsg);

            if (isPublic) {
                // Ao ser público, redireciona para o login do aluno facilitando a vida
                navigate('/area-aluno/login');
            } else {
                navigate('/');
            }
        } catch (error) {
            handleAPIError(error, 'Erro ao cadastrar aluno');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                {!isPublic && (
                    <button onClick={() => navigate('/')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                        ← Voltar
                    </button>
                )}
                <h2>{isPublic ? '🚀 Auto-Cadastro de Aluno' : '📋 Cadastro de Novo Aluno'}</h2>
                <p className="subtitle">Preencha os dados e geraremos seu treino personalizado!</p>

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
                                placeholder="Ex: João Silva"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>E-mail * (Para acessar a Área do Aluno)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Ex: joao@email.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>WhatsApp *</label>
                            <input
                                type="tel"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                                placeholder="(11) 99999-9999"
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
                                placeholder="25"
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
                            rows="3"
                            placeholder="Ex: Problemas no joelho, dores nas costas, limitações de movimento."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '⏳ Processando...' : '🚀 Cadastrar e Gerar Treino'}
                    </button>
                </form>
            </div >
        </div >
    );
}

export default RegisterForm;

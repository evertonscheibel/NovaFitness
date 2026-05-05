import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';
import { handleAPIError } from '../utils/error';
import { copyToClipboard } from '../utils/clipboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { OBJETIVOS } from '../constants/options';

function StudentList() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        nome: '',
        objetivo: '',
        status: ''
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentAPI.getAll(filters);
            setStudents(response.data.data);
        } catch (error) {
            handleAPIError(error, 'Erro ao carregar alunos');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadStudents();
    };

    const handleDelete = async (id, nome) => {
        if (!confirm(`Tem certeza que deseja excluir o aluno ${nome}?`)) return;

        try {
            await studentAPI.delete(id);
            alert('Aluno excluído com sucesso!');
            loadStudents();
        } catch (error) {
            handleAPIError(error, 'Erro ao excluir aluno');
        }
    };

    if (loading) return <LoadingSpinner message="Carregando alunos..." />;

    return (
        <div className="container">
            <button onClick={() => navigate('/management')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <h2>👥 Alunos</h2>
                <Link to="/register" className="btn btn-primary">➕ Novo Aluno</Link>
            </div>

            <div className="card">
                <form onSubmit={handleSearch} className="filters-form">
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="nome"
                                placeholder="Buscar por nome..."
                                value={filters.nome}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <select name="objetivo" value={filters.objetivo} onChange={handleFilterChange}>
                                <option value="">Todos os Objetivos</option>
                                {OBJETIVOS.map(obj => (
                                    <option key={obj.value} value={obj.value}>{obj.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">Todos os Status</option>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-secondary">🔍 Filtrar</button>
                    </div>
                </form>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Objetivo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.nome}</td>
                                    <td>{student.email}</td>
                                    <td>{student.objetivo_principal}</td>
                                    <td>
                                        <span className={`badge ${student.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>
                                            {student.status || 'Ativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <Link to={`/student/${student.id}`} className="btn btn-sm">
                                                👁️ Ver
                                            </Link>
                                            <Link to={`/student/${student.id}/edit`} className="btn btn-sm">
                                                ✏️ Editar
                                            </Link>

                                            {student.has_premium_access && (
                                                <div style={{ display: 'inline-flex', gap: '5px' }}>
                                                    {student.tokens?.[0]?.token ? (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    const token = student.tokens?.[0]?.token;
                                                                    const link = `${window.location.origin}/area-aluno/token/${token}`;
                                                                    copyToClipboard(link, 'Link de acesso copiado! ✅');
                                                                }}
                                                                className="btn btn-sm btn-primary"
                                                                title="Copiar Link"
                                                            >
                                                                🔗
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm(`Gerar novo token para ${student.nome}? O link anterior será invalidado.`)) return;
                                                                    try {
                                                                        await studentAPI.regenerateToken(student.id);
                                                                        alert('Novo token gerado!');
                                                                        loadStudents();
                                                                    } catch (e) {
                                                                        alert('Erro ao gerar token');
                                                                    }
                                                                }}
                                                                className="btn btn-sm btn-warning"
                                                                title="Gerar Novo Token"
                                                                style={{ padding: '5px 8px' }}
                                                            >
                                                                🔄
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await studentAPI.regenerateToken(student.id);
                                                                    alert('Token gerado com sucesso!');
                                                                    loadStudents();
                                                                } catch (e) {
                                                                    alert('Erro ao gerar token');
                                                                }
                                                            }}
                                                            className="btn btn-sm btn-success"
                                                            title="Gerar Token de Acesso"
                                                        >
                                                            🪄 Gerar Token
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleDelete(student.id, student.nome)}
                                                className="btn btn-sm"
                                                style={{ background: '#dc3545', color: 'white' }}
                                            >
                                                🗑️ Excluir
                                            </button>
                                        </div>
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

export default StudentList;

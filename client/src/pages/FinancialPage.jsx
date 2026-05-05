import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { financialAPI, studentAPI } from '../services/api';

function FinancialPage() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, overdueCount: 0, pendingCount: 0 });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    const [newPayment, setNewPayment] = useState({
        student_id: '',
        amount: '',
        due_date: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadPayments();
    }, [filterStatus]);

    const loadData = async () => {
        try {
            const [statsRes, studentsRes] = await Promise.all([
                financialAPI.getStats(),
                studentAPI.getAll()
            ]);
            setStats(statsRes.data.data);
            setStudents(studentsRes.data.data);
            loadPayments();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar lista de alunos: ' + (error.message || 'Erro desconhecido'));
        }
    };

    const loadPayments = async () => {
        setLoading(true);
        try {
            const response = await financialAPI.list({ status: filterStatus });
            setPayments(response.data.data);
        } catch (error) {
            console.error('Erro ao listar pagamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await financialAPI.create(newPayment);
            alert('Pagamento registrado com sucesso!');
            setShowModal(false);
            setNewPayment({ student_id: '', amount: '', due_date: '', notes: '' });
            loadData();
        } catch (error) {
            alert('Erro ao registrar pagamento');
        }
    };

    const handleMarkAsPaid = async (id) => {
        if (!confirm('Confirmar recebimento deste pagamento?')) return;
        try {
            await financialAPI.updateStatus(id, { status: 'PAID', method: 'CASH' }); // Default to CASH for simplicity
            loadData();
        } catch (error) {
            alert('Erro ao atualizar pagamento');
        }
    };

    return (
        <div className="container">
            <button onClick={() => navigate('/management')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <h2>💰 Controle Financeiro</h2>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">➕ Registrar Pagamento</button>
            </div>

            {/* KPIs */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>R$ {Number(stats.totalRevenue).toFixed(2)}</h3>
                    <p>Receita (Mês)</p>
                </div>
                <div className={`stat-card ${stats.overdueCount > 0 ? 'alert' : ''}`}>
                    <h3>{stats.overdueCount}</h3>
                    <p>Atrasados</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.pendingCount}</h3>
                    <p>A Vencer (7 dias)</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Pagamentos</h3>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', minWidth: '150px' }}
                    >
                        <option value="">Todos os Status</option>
                        <option value="PENDING">Pendentes</option>
                        <option value="PAID">Pagos</option>
                        <option value="OVERDUE">Atrasados</option>
                    </select>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>Valor</th>
                                <th>Vencimento</th>
                                <th>Status</th>
                                <th>Pagamento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>{payment.student?.nome}</td>
                                    <td>R$ {Number(payment.amount).toFixed(2)}</td>
                                    <td>{new Date(payment.due_date).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <span className={`badge ${payment.status === 'PAID' ? 'badge-success' :
                                            payment.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {payment.status === 'PAID' ? 'PAGO' :
                                                payment.status === 'PENDING' ? 'PENDENTE' : 'ATRASADO'}
                                        </span>
                                    </td>
                                    <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('pt-BR') : '-'}</td>
                                    <td>
                                        {payment.status !== 'PAID' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(payment.id)}
                                                className="btn btn-sm btn-success"
                                            >
                                                ✅ Receber
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">Nenhum pagamento encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Novo Pagamento */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Novo Pagamento ({students.length} alunos)</h3>
                            <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="modal-body">
                            <div className="form-group">
                                <label>Aluno *</label>
                                <select
                                    value={newPayment.student_id}
                                    onChange={e => setNewPayment({ ...newPayment, student_id: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Valor (R$) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newPayment.amount}
                                    onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Vencimento *</label>
                                <input
                                    type="date"
                                    value={newPayment.due_date}
                                    onChange={e => setNewPayment({ ...newPayment, due_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Obs</label>
                                <textarea
                                    rows="2"
                                    value={newPayment.notes}
                                    onChange={e => setNewPayment({ ...newPayment, notes: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                                Salvar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FinancialPage;

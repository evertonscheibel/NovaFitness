import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkinAPI, studentAPI } from '../services/api';
import { handleAPIError } from '../utils/error';
import { formatTime } from '../utils/date';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentSelect from '../components/StudentSelect';

function CheckInPage() {
    const navigate = useNavigate();
    const [todayCheckIns, setTodayCheckIns] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [checkInsRes, studentsRes] = await Promise.all([
                checkinAPI.getToday(),
                studentAPI.getAll() // Em um sistema real, buscaria apenas ativos e usaria um autocomplete
            ]);
            setTodayCheckIns(checkInsRes.data.data);
            setStudents(studentsRes.data.data);
        } catch (error) {
            handleAPIError(error, 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return;

        try {
            await checkinAPI.doCheckIn({ student_id: selectedStudent });
            alert('Check-in realizado! Bom treino! 💪');
            setSelectedStudent('');
            loadData(); // Atualiza a lista
        } catch (error) {
            handleAPIError(error, 'Erro ao realizar check-in');
        }
    };

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                ← Voltar
            </button>
            <div className="dashboard-header">
                <h2>📍 Check-in de Alunos</h2>
            </div>

            <div className="dashboard-grid">
                {/* Cartão de Check-in */}
                <div className="card">
                    <h3>Registrar Presença</h3>
                    <form onSubmit={handleCheckIn}>
                        <div className="form-group">
                            <StudentSelect
                                students={students}
                                value={selectedStudent}
                                onChange={setSelectedStudent}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '1.2rem' }}
                            disabled={!selectedStudent}
                        >
                            ✅ Confirmar Presença
                        </button>
                    </form>
                </div>

                {/* Lista de Hoje */}
                <div className="card">
                    <div className="card-header">
                        <h3>Presenças de Hoje ({todayCheckIns.length})</h3>
                        <span className="badge badge-success">{new Date().toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div className="list-group">
                        {todayCheckIns.length === 0 ? (
                            <p className="empty-state">Nenhum aluno treinou hoje ainda.</p>
                        ) : (
                            todayCheckIns.map(checkin => (
                                <div key={checkin.id} className="list-item">
                                    <div className="info">
                                        <strong>{checkin.student?.nome}</strong>
                                        <span>
                                            🕒 {formatTime(checkin.checkin_time)}
                                        </span>
                                    </div>
                                    <span className="badge badge-success">Presente</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckInPage;

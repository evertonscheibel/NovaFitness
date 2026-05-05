import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAreaAPI } from '../../services/api';
import '../../styles/StudentArea.css';

function StudentTokenAuth() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await studentAreaAPI.getByToken(token);
                if (response.data.success) {
                    const { student, activePublication } = response.data.data;

                    // Persistir dados básicos
                    localStorage.setItem('studentId', student.id);
                    localStorage.setItem('studentName', student.nome);
                    localStorage.setItem('isPremium', student.has_premium_access);
                    localStorage.setItem('publicationId', activePublication?.id || '');

                    // Redirecionar removendo token da URL
                    navigate('/area-aluno', { replace: true });
                } else {
                    setError('Link inválido ou expirado.');
                }
            } catch (err) {
                console.error('Erro na auth:', err);
                setError('Erro ao validar acesso. Tente novamente mais tarde.');
            }
        };

        if (token) validateToken();
    }, [token, navigate]);

    if (error) {
        return (
            <div className="student-area-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="sa-container">
                    <div className="sa-card">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                        <h2 className="sa-title">Acesso Negado</h2>
                        <p className="sa-subtitle">{error}</p>
                        <button className="sa-btn-primary" onClick={() => window.location.reload()}>
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-area-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="sa-container" style={{ textAlign: 'center' }}>
                <div className="sa-skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px' }}></div>
                <h2 className="sa-title">Validando Acesso...</h2>
                <div className="sa-skeleton" style={{ width: '200px', height: '16px', margin: '0 auto' }}></div>
            </div>
        </div>
    );
}

export default StudentTokenAuth;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAreaAPI } from '../../services/api';
import { Dumbbell, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import '../../styles/StudentArea.css';

function StudentLogin() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);

        try {
            const response = await studentAreaAPI.loginPublic(email);
            if (response.data.success) {
                const { student, activePublication } = response.data.data;

                // Persistir dados
                localStorage.setItem('studentId', student.id);
                localStorage.setItem('studentName', student.nome);
                localStorage.setItem('isPremium', student.hasPremium || 'true');
                localStorage.setItem('publicationId', activePublication?.id || '');
                localStorage.setItem('studentEmail', student.email);

                // Sucesso! Redirecionar para o dashboard
                navigate('/area-aluno');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Email não encontrado. Verifique com seu treinador.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-area-root" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <div className="sa-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src="/logo.jpeg" alt="NovaFitness" style={{ height: '120px', margin: '0 auto 16px', display: 'block' }} />
                    <h1 className="sa-title" style={{ fontSize: '24px', letterSpacing: '1px' }}>ÁREA DO ALUNO</h1>
                </div>

                <div className="sa-card" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Bem-vindo de volta!</h2>
                    <p className="sa-subtitle" style={{ fontSize: '14px' }}>Digite seu email cadastrado para acessar seus treinos.</p>

                    <form onSubmit={handleLogin} style={{ marginTop: '24px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: error ? '1px solid var(--sa-error)' : '1px solid var(--sa-border)',
                            height: '56px',
                            marginBottom: '16px'
                        }}>
                            <Mail size={20} color="var(--sa-text-sec)" />
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '16px',
                                    width: '100%',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sa-error)', fontSize: '13px', marginBottom: '20px' }}>
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="sa-btn-primary"
                            disabled={loading || !email}
                            style={{ opacity: (loading || !email) ? 0.6 : 1 }}
                        >
                            {loading ? 'Entrando...' : (
                                <>Acessar Treino <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--sa-text-sec)', marginTop: '24px' }}>
                    Não consegue acessar? Fale com seu treinador.
                </p>
            </div>
        </div>
    );
}

export default StudentLogin;

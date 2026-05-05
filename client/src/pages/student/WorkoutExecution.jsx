import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, Timer, History, Dumbbell } from 'lucide-react';
import { studentAreaAPI } from '../../services/api';
import '../../styles/StudentArea.css';

function WorkoutExecution() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const session = state?.session;

    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = sessionStorage.getItem('workout_currentIndex');
        return saved ? parseInt(saved) : 0;
    });
    const [currentSet, setCurrentSet] = useState(0);
    const [load, setLoad] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [persistedSession, setPersistedSession] = useState(null);

    const studentId = localStorage.getItem('studentId');
    const publicationId = state?.publicationId || localStorage.getItem('publicationId');

    // Persistence Effect
    useEffect(() => {
        if (session) {
            sessionStorage.setItem('workout_session', JSON.stringify(session));
            sessionStorage.setItem('workout_pubId', publicationId);
        }
    }, [session, publicationId]);

    useEffect(() => {
        sessionStorage.setItem('workout_currentIndex', currentIndex);
    }, [currentIndex]);

    // Handle Refresh/Reload
    useEffect(() => {
        if (!session) {
            const savedSession = sessionStorage.getItem('workout_session');
            if (savedSession) {
                try {
                    setPersistedSession(JSON.parse(savedSession));
                } catch (e) {
                    console.error('Erro ao restaurar sessão:', e);
                }
            }
        }
    }, [session]);

    const activeSession = session || persistedSession;
    const exercise = activeSession?.itens?.[currentIndex];
    const totalExercises = activeSession?.itens?.length || 0;

    const handleSelectExercise = (index) => {
        setCurrentIndex(index);
        setCurrentSet(0);
        setLoad('');
    };

    const handleNextSet = () => {
        const totalSets = parseInt(exercise?.series) || 3;
        if (currentSet < totalSets - 1) {
            setCurrentSet(prev => prev + 1);
        }
    };

    const handleFinishExercise = async () => {
        try {
            const freshStudentId = localStorage.getItem('studentId');
            const freshPublicationId = publicationId || sessionStorage.getItem('workout_pubId');

            // Generate a deterministic 24-char hex ID for fallbacks (to satisfy Prisma/Mongo)
            const generateFallbackId = (name) => {
                const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16);
                return (hash + '000000000000000000000000').substring(0, 24);
            };

            const exId = exercise.catalogExerciseId || exercise.exercicio_id || exercise.id || generateFallbackId(exercise.nome_exercicio);

            if (!freshStudentId || !freshPublicationId || !exId) {
                console.warn('[ACCES_ERROR] Missing data:', {
                    studentId: !!freshStudentId,
                    publicationId: !!freshPublicationId,
                    exerciseId: !!exId,
                    fromState: !!state?.publicationId
                });
                alert(`Erro: Dados de acesso incompletos (${!freshStudentId ? 'Aluno ' : ''}${!freshPublicationId ? 'Treino ' : ''}${!exId ? 'Exercício' : ''}). Tente sair e entrar novamente.`);
                return;
            }

            await studentAreaAPI.logExercise({
                studentId: freshStudentId,
                publicationId: freshPublicationId,
                exerciseId: exId,
                status: 'FEITO',
                loadUsed: load,
                note: ''
            });

            if (currentIndex < totalExercises - 1) {
                setCurrentIndex(prev => prev + 1);
                setCurrentSet(0);
                setLoad('');
            } else {
                setIsFinished(true);
            }
        } catch (err) {
            console.error('Erro ao salvar exercício:', err);
            alert('Erro ao salvar progresso. Verifique sua conexão.');
        }
    };

    if (!activeSession) return (
        <div className="student-area-root" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
            <h2 className="sa-title">Sessão não encontrada</h2>
            <p className="sa-subtitle">Ocorreu um erro ao carregar os dados do treino.</p>
            <button className="sa-btn-primary" onClick={() => navigate('/area-aluno')}>Voltar para Início</button>
        </div>
    );

    if (isFinished) {
        return (
            <div className="student-area-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="sa-container">
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
                    <h1 className="sa-title">Treino Concluído!</h1>
                    <p className="sa-subtitle">Parabéns, {localStorage.getItem('studentName')?.split(' ')[0]}! Você concluiu a Sessão {activeSession.label}.</p>

                    <div className="sa-card" style={{ marginTop: '32px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Como foi o treino hoje?</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '32px', marginBottom: '24px' }}>
                            <span>😫</span><span>😐</span><span>😊</span><span>🔥</span><span>💪</span>
                        </div>
                        <button className="sa-btn-primary" onClick={() => {
                            sessionStorage.removeItem('workout_session');
                            sessionStorage.removeItem('workout_currentIndex');
                            navigate('/area-aluno');
                        }}>Salvar e Sair</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-area-root" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
            {/* Header */}
            <header style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>Sessão {activeSession.label}</div>
                    <div style={{ fontWeight: '600' }}>Exercício {currentIndex + 1} de {totalExercises}</div>
                </div>
                <div style={{ width: '24px' }}></div>
            </header>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '4px', padding: '0 16px', marginBottom: '16px' }}>
                {Array.from({ length: totalExercises }).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleSelectExercise(i)}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: i === currentIndex ? 'var(--sa-primary)' : i < currentIndex ? 'var(--sa-success)' : 'var(--sa-border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    ></div>
                ))}
            </div>

            <main className="sa-container">
                <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: '220px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                        {exercise?.image_url ? (
                            <img
                                src={exercise.image_url.startsWith('http') ? exercise.image_url : (exercise.image_url.startsWith('/') ? exercise.image_url : `/api/uploads/${exercise.image_url}`)}
                                alt={exercise.nome_exercicio}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <Dumbbell size={48} />
                        )}
                    </div>
                    <div style={{ padding: '16px' }}>
                        <h2 className="sa-title" style={{ fontSize: '22px', marginBottom: '4px' }}>{exercise.nome_exercicio || 'Exercício'}</h2>
                        <span style={{ fontSize: '13px', color: 'var(--sa-text-sec)', textTransform: 'uppercase' }}>{exercise.grupo_muscular || 'Geral'}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    <div className="sa-card" style={{ textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ color: 'var(--sa-text-sec)', fontSize: '12px', marginBottom: '4px' }}>Séries</div>
                        <div style={{ fontSize: '20px', fontWeight: '700' }}>{exercise.series || '-'}</div>
                    </div>
                    <div className="sa-card" style={{ textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ color: 'var(--sa-text-sec)', fontSize: '12px', marginBottom: '4px' }}>Reps</div>
                        <div style={{ fontSize: '20px', fontWeight: '700' }}>{exercise.reps || '-'}</div>
                    </div>
                    <div className="sa-card" style={{ textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ color: 'var(--sa-text-sec)', fontSize: '12px', marginBottom: '4px' }}>Tempo</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <Timer size={16} /> {exercise.descanso_seg || '60'}s
                        </div>
                    </div>
                </div>

                <div className="sa-card">
                    <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--sa-text-sec)' }}>Progresso das Séries</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {Array.from({ length: parseInt(exercise.series) || 3 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: '44px',
                                    borderRadius: '8px',
                                    background: i <= currentSet ? 'var(--sa-primary)' : 'var(--sa-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700'
                                }}
                            >
                                {i < currentSet ? <Check size={20} /> : i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sa-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sa-primary)' }}>
                        <History size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: 'var(--sa-text-sec)' }}>Carga utilizada (kg)</div>
                        <input
                            type="number"
                            inputMode="decimal"
                            value={load}
                            onChange={(e) => setLoad(e.target.value)}
                            placeholder="Ex: 24"
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', fontWeight: '700', width: '100%', outline: 'none' }}
                        />
                    </div>
                </div>
            </main>

            {/* Footer Action */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', background: 'var(--sa-bg)' }}>
                {currentSet < (parseInt(exercise.series) || 3) - 1 ? (
                    <button className="sa-btn-primary" onClick={handleNextSet}>
                        Concluir Série {currentSet + 1}
                    </button>
                ) : (
                    <button className="sa-btn-primary" style={{ background: 'var(--sa-success)' }} onClick={handleFinishExercise}>
                        <Check size={20} /> Concluir Exercício
                    </button>
                )}
            </div>

        </div>
    );
}

export default WorkoutExecution;

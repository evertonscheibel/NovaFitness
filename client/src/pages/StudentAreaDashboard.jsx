import { useState, useEffect } from 'react';
import { Calendar, Check, X, ChevronDown, PlayCircle, MessageCircle, AlertCircle, Trophy } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { studentAreaAPI } from '../services/api';
import { SKIP_REASONS } from '../constants/options';
import { handleAPIError } from '../utils/error';
import { todayISO } from '../utils/date';
import RestTimer from './student-area/RestTimer';
import SkipModal from './student-area/SkipModal';
import MessageModal from './student-area/MessageModal';

// ==========================================
// Stat Block for exercise details
// ==========================================
const StatBlock = ({ label, value }) => (
    <div className="bg-slate-800/80 rounded-lg p-2 text-center border border-slate-700/50">
        <p className="text-[10px] text-slate-500 font-medium uppercase">{label}</p>
        <p className="text-sm font-bold text-white font-outfit">{value || '—'}</p>
    </div>
);

function StudentAreaDashboard() {
    const { activePublication, isPremium, student, logs: initialLogs, sessionExecutions: initialExecs } = useOutletContext();
    const [logs, setLogs] = useState(initialLogs || []);
    const [sessionExecs, setSessionExecs] = useState(initialExecs || []);
    const [expandedItem, setExpandedItem] = useState(null);
    const [logging, setLogging] = useState(false);
    const [activeTimer, setActiveTimer] = useState(null); // { seconds }
    const [loadUsed, setLoadUsed] = useState('');

    // Modals state
    const [skipModal, setSkipModal] = useState({ open: false, exercise: null, sessaoIdx: null, itemIdx: null });
    const [messageModal, setMessageModal] = useState({ open: false, content: '' });
    const [finishingSession, setFinishingSession] = useState(false);

    // Map logs for quick lookup
    const [logsMap, setLogsMap] = useState({});

    useEffect(() => {
        const map = {};
        logs.forEach(log => {
            map[log.exerciseId] = log;
        });
        setLogsMap(map);
    }, [logs]);

    const handleToggleExpand = (id) => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    const handleLogExercise = async (exerciseId, status = 'FEITO', skipReason = null, note = '', restSeconds = 0) => {
        if (!isPremium) return alert('Funcionalidade exclusiva para alunos Premium! 🌟');
        if (logging) return;

        setLogging(true);
        try {
            console.log('[DEBUG] Logging exercise:', { studentId: student.id, publicationId: activePublication.id, exerciseId });
            const response = await studentAreaAPI.logExercise({
                studentId: student.id,
                publicationId: activePublication.id,
                exerciseId: exerciseId,
                status,
                skipReason,
                note,
                loadUsed: loadUsed || undefined
            });

            if (response.data.success) {
                setLogs(prev => [response.data.data, ...prev]);
                setSkipModal({ open: false, exercise: null, sessaoIdx: null, itemIdx: null });
                setLoadUsed('');
                if (status === 'FEITO' && restSeconds > 0) {
                    setActiveTimer({ seconds: restSeconds });
                }
            } else {
                alert(response.data.message || 'Erro ao registrar.');
            }
        } catch (error) {
            handleAPIError(error, 'Erro de conexão');
        } finally {
            setLogging(false);
        }
    };

    const handleFinishSession = async (session) => {
        if (!isPremium) return alert('Funcionalidade exclusiva para alunos Premium! 🌟');
        if (finishingSession) return;

        setFinishingSession(true);
        try {
            const response = await studentAreaAPI.finishSession({
                studentId: student.id,
                publicationId: activePublication.id,
                sessionName: session.nome || session.dia
            });

            if (response.data.success) {
                setSessionExecs(prev => [response.data.data, ...prev]);
                alert(`Treino ${session.nome || session.dia} finalizado com sucesso! Parabéns! 🏆`);
            }
        } catch (error) {
            handleAPIError(error, 'Erro ao finalizar treino');
        } finally {
            setFinishingSession(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageModal.content.trim()) return;

        try {
            const response = await studentAreaAPI.sendMessage({
                studentId: student.id,
                content: messageModal.content,
                type: 'feedback'
            });

            if (response.data.success) {
                alert('Mensagem enviada para o Gestor! Obrigado pelo feedback.');
                setMessageModal({ open: false, content: '' });
            }
        } catch (error) {
            handleAPIError(error, 'Erro ao enviar mensagem');
        }
    };

    // Determine suggested session
    const lastSession = sessionExecs[0]?.sessionName;

    // Fallback for potential double nesting in publication data
    let sessions = activePublication?.data?.sessoes || [];
    if (sessions.length === 0 && activePublication?.data?.prescricao?.sessoes) {
        sessions = activePublication.data.prescricao.sessoes;
    }

    let suggestedSessionIdx = 0;
    if (lastSession && sessions.length > 0) {
        const lastIdx = sessions.findIndex(s => (s.nome || s.dia) === lastSession);
        if (lastIdx !== -1) {
            suggestedSessionIdx = (lastIdx + 1) % sessions.length;
        }
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    Treino de Hoje
                </h2>
                <button
                    onClick={() => setMessageModal({ ...messageModal, open: true })}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-orange-400 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-500/20 transition-all font-outfit"
                >
                    <MessageCircle className="w-4 h-4" />
                    Falar com Gestor
                </button>
            </div>

            {activePublication ? (
                <div className="space-y-10">
                    {sessions.map((sessao, sessaoIdx) => {
                        const isSuggested = sessaoIdx === suggestedSessionIdx;
                        const sessionName = sessao.nome || sessao.dia;
                        const isFinishedToday = sessionExecs.some(e => e.sessionName === sessionName && e.date === todayISO());

                        return (
                            <div key={sessaoIdx} className={`space-y-4 rounded-2xl p-4 transition-all ${isSuggested ? 'bg-orange-500/5 ring-1 ring-orange-500/20' : 'bg-transparent'}`}>
                                <div className="flex items-center justify-between px-1">
                                    <h3 className={`font-bold uppercase text-sm tracking-widest flex items-center gap-2 ${isSuggested ? 'text-orange-500' : 'text-slate-400'}`}>
                                        {isSuggested && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                                        {sessionName}
                                        {isSuggested && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full normal-case tracking-normal">Sugestão do Dia</span>}
                                    </h3>
                                    {isFinishedToday && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Trophy className="w-3 h-3" /> Concluído
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {sessao.itens?.map((item, itemIdx) => {
                                        const uniqueId = `${sessaoIdx}-${itemIdx}`;
                                        const exerciseLog = logsMap[item.catalogExerciseId];
                                        const isCompleted = exerciseLog?.status === 'FEITO';
                                        const isSkipped = exerciseLog?.status === 'NAO_FEITO';
                                        const isExpanded = expandedItem === uniqueId;

                                        return (
                                            <div key={itemIdx} className={`bg-slate-800/80 backdrop-blur-md border rounded-xl overflow-hidden shadow-xl transition-all ${isCompleted ? 'border-green-500/40 bg-green-900/10' : isSkipped ? 'border-red-500/40 bg-red-900/10' : 'border-slate-700 hover:border-slate-600'}`}>
                                                <div className="p-4 flex gap-3">
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const restSec = parseInt(item.intervalo || item.descanso_seg || '60', 10) || 60;
                                                                const exId = item.catalogExerciseId || item.exercicio_id || item.slug || item.nome_exercicio || item.id;
                                                                handleLogExercise(exId, 'FEITO', null, '', restSec);
                                                            }}
                                                            disabled={isCompleted || logging}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-700/50 text-slate-400 hover:bg-green-500 hover:text-white'}`}
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setSkipModal({ open: true, exercise: item, sessaoIdx, itemIdx })}
                                                            disabled={isSkipped || logging}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSkipped ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-700/50 text-slate-400 hover:bg-red-500 hover:text-white'}`}
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleToggleExpand(uniqueId)}>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className={`font-semibold text-lg truncate pr-2 font-outfit ${isCompleted ? 'text-green-400' : isSkipped ? 'text-red-400' : 'text-white'}`}>
                                                                {item.nome_exercicio}
                                                            </h4>
                                                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="bg-slate-900/50 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium">{item.series} SETS</span>
                                                            <span className="bg-slate-900/50 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium">{item.reps} REPS</span>
                                                            {item.carga && <span className="bg-orange-500/10 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-500/20 font-mono font-bold">{item.carga}</span>}
                                                        </div>
                                                        {isSkipped && (
                                                            <p className="text-[10px] text-red-300 mt-2 bg-red-900/20 px-2 py-1 rounded inline-block">
                                                                Pulei: {SKIP_REASONS.find(r => r.id === exerciseLog.skipReason)?.label || 'Não informado'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="bg-slate-900/50 p-4 border-t border-slate-700/50 space-y-4">
                                                        {item.observacoes && (
                                                            <div className="text-sm text-sky-200/80 bg-sky-900/20 p-3 rounded-lg border border-sky-900/30 flex gap-2">
                                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                                <span>{item.observacoes}</span>
                                                            </div>
                                                        )}

                                                        {item.image_url && (
                                                            <div className="w-full rounded-xl overflow-hidden border border-slate-700">
                                                                <img src={item.image_url} alt={item.nome_exercicio} className="w-full h-48 object-contain bg-black/40" loading="lazy" />
                                                            </div>
                                                        )}

                                                        {item.descricao && (
                                                            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                                                <h5 className="text-xs font-bold text-orange-400 uppercase mb-1 font-outfit">Como Executar</h5>
                                                                <p className="text-sm text-slate-300 leading-relaxed">{item.descricao}</p>
                                                            </div>
                                                        )}

                                                        {item.video_url && (
                                                            <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl p-3 transition">
                                                                <PlayCircle className="w-8 h-8 text-orange-500" />
                                                                <div>
                                                                    <span className="text-white font-medium text-sm font-outfit">Ver vídeo demonstrativo</span>
                                                                    <span className="text-slate-400 text-xs block">YouTube</span>
                                                                </div>
                                                            </a>
                                                        )}

                                                        <div className="grid grid-cols-4 gap-2">
                                                            <StatBlock label="Séries" value={item.series} />
                                                            <StatBlock label="Reps" value={item.reps} />
                                                            <StatBlock label="Descanso" value={item.intervalo || '60s'} />
                                                            <StatBlock label="Carga" value={item.carga || '—'} />
                                                        </div>

                                                        {!isCompleted && !isSkipped && (
                                                            <div>
                                                                <label className="text-xs text-slate-500 font-medium uppercase block mb-1">Carga usada (opcional)</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ex: 40kg, 20kg cada lado..."
                                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-slate-600 font-outfit"
                                                                    value={loadUsed}
                                                                    onChange={(e) => setLoadUsed(e.target.value)}
                                                                />
                                                            </div>
                                                        )}

                                                        {item.cadencia && (
                                                            <div className="text-[10px] text-slate-500 font-medium px-1">CADÊNCIA: {item.cadencia}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handleFinishSession(sessao)}
                                    disabled={finishingSession || isFinishedToday}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg font-outfit ${isFinishedToday ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20'}`}
                                >
                                    {isFinishedToday ? <Check /> : <Calendar className="w-4 h-4" />}
                                    {isFinishedToday ? 'TREINO FINALIZADO' : `FINALIZAR TREINO ${sessionName}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed p-16 text-center">
                    <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 font-outfit">Sem treino ativo</h3>
                    <p className="text-slate-400">Entre em contato com seu treinador para receber seu novo planejamento.</p>
                </div>
            )}

            {activeTimer && (
                <RestTimer
                    seconds={activeTimer.seconds}
                    onComplete={() => setActiveTimer(null)}
                    onDismiss={() => setActiveTimer(null)}
                />
            )}

            <SkipModal
                isOpen={skipModal.open}
                exercise={skipModal.exercise}
                onClose={() => setSkipModal({ open: false, exercise: null })}
                onSkip={(reasonId) => handleLogExercise(skipModal.exercise.catalogExerciseId || skipModal.exercise.exercicio_id || skipModal.exercise.id, 'NAO_FEITO', reasonId)}
            />

            <MessageModal
                isOpen={messageModal.open}
                content={messageModal.content}
                setContent={(content) => setMessageModal({ ...messageModal, content })}
                onClose={() => setMessageModal({ ...messageModal, open: false })}
                onSend={handleSendMessage}
            />

            {!isPremium && (
                <div className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 backdrop-blur text-white p-4 rounded-xl shadow-xl z-40 flex items-center justify-between border border-orange-400/50 shadow-orange-500/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
                        <div className="text-sm">
                            <p className="font-bold font-outfit">Acesso Limitado</p>
                            <p className="opacity-90 font-medium">Recursos de registro são exclusivos Premium!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentAreaDashboard;

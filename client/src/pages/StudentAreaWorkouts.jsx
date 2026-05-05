import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Calendar, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function StudentAreaWorkouts() {
    const { student } = useOutletContext();
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublications();
    }, [student.id]);

    const fetchPublications = async () => {
        try {
            const response = await fetch(`${API_BASE}/publications/student/${student.id}`);
            const result = await response.json();
            if (result.success) {
                setPublications(result.data);
            }
        } catch (error) {
            console.error('Erro ao buscar publicações:', error);
        } finally {
            setLoading(false);
        }
    };

    const [expandedRequest, setExpandedRequest] = useState(null);

    const toggleExpand = (id) => {
        if (expandedRequest === id) {
            setExpandedRequest(null);
        } else {
            setExpandedRequest(id);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-400">Carregando treinos...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Histórico de Treinos
            </h2>

            {publications.length > 0 ? (
                publications.map((pub) => (
                    <div
                        key={pub.id}
                        onClick={() => toggleExpand(pub.id)}
                        className={`bg-slate-800/50 rounded-xl border border-slate-700 p-4 transition cursor-pointer ${expandedRequest === pub.id ? 'bg-slate-700/50 border-orange-500/30' : 'hover:bg-slate-700/30'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Versão {pub.version}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(pub.validFrom).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{pub.data.sessoes?.length || 0} sessões</span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedRequest === pub.id ? 'rotate-90 text-orange-500' : ''}`} />
                        </div>

                        {/* Detalhes Expandidos */}
                        {expandedRequest === pub.id && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                                {pub.data.sessoes?.map((sessao, sIdx) => (
                                    <div key={sIdx} className="bg-slate-900/40 rounded-lg p-3">
                                        <p className="text-orange-400 text-sm font-semibold mb-2">{sessao.nome || sessao.dia || 'Sessão'}</p>
                                        <ul className="space-y-2">
                                            {sessao.itens?.map((item, iIdx) => (
                                                <li key={iIdx} className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-gray-300 text-sm font-medium">{item.nome_exercicio}</span>
                                                        <span className="text-gray-500 text-xs">{item.series}x{item.reps}</span>
                                                    </div>

                                                    {/* Mídia Read-Only */}
                                                    {(item.image_url || item.video_url) && (
                                                        <div className="flex gap-2 text-xs pt-1 border-t border-slate-700/50 mt-1">
                                                            {item.image_url && (
                                                                <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                                                    📷 Ver Foto
                                                                </a>
                                                            )}
                                                            {item.video_url && (
                                                                <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 flex items-center gap-1">
                                                                    🎥 Ver Vídeo
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-400 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
                    Nenhum histórico encontrado.
                </div>
            )}
        </div>
    );
}

export default StudentAreaWorkouts;

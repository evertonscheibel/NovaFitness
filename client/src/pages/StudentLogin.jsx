import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Lock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function StudentLogin() {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTokenChange = (e) => {
        const value = e.target.value;

        // Se colar uma URL completa
        if (value.includes('/area-aluno/')) {
            // Caso 1: URL com Token Explícito (/area-aluno/token/XYZ)
            if (value.includes('/token/')) {
                const parts = value.split('/token/');
                if (parts[1]) {
                    const extracted = parts[1].split('/')[0].trim();
                    setToken(extracted);
                    setError('');
                    return;
                }
            }

            // Caso 2: Pode ser URL antiga OU URL mal formatada com token direto
            // Ex: /area-aluno/TOKEN_GIGANTE_AQUI
            const urlParts = value.split('/area-aluno/');
            if (urlParts[1]) {
                const possibleTokenOrId = urlParts[1].split('/')[0].trim();

                // Se for um ID do Mongo (legacy), tem 24 chars.
                // Se for nosso token, tem 64 chars.
                // Vamos ser flexíveis: se tiver mais que 30 chars, assumimos que é token.
                if (possibleTokenOrId.length > 30 && !value.includes('/login')) {
                    setToken(possibleTokenOrId);
                    setError(''); // Aceitamos como token válido
                    return;
                }

                // Se for curto (ID) e não for login, aí sim é legacy
                if (!value.includes('/login')) {
                    setError('⚠️ Link antigo detectado! Este link contém apenas o ID (antigo). Solicite o NOVO LINK com token (chave longa).');
                    setToken(value);
                    return;
                }
            }
        }

        setToken(value);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const cleanToken = token.trim();

        if (!cleanToken) return;

        // Bloquear envio se parecer URL antiga ou inválida
        // Bloquear envio se parecer URL antiga (curta)
        if (cleanToken.includes('/area-aluno/') && !cleanToken.includes('/token/')) {
            // Re-verificar comprimento novamente para segurança
            const parts = cleanToken.split('/area-aluno/');
            const potentialId = parts[1]?.split('/')[0];

            if (potentialId && potentialId.length < 30) {
                setError('⚠️ Link antigo detectado! O ID é muito curto. Use o novo link com token.');
                return;
            }
            // Se for longo, deixamos passar pois o backend vai validar
        }

        if (cleanToken.includes('http') || cleanToken.includes('/')) {
            setError('O código inserido parece ser um link inválido. Cole apenas o código ou o link novo completo.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Verificar se o token é válido
            const response = await fetch(`${API_BASE}/student-area/by-token/${cleanToken}`);
            const result = await response.json();

            if (result.success) {
                navigate(`/area-aluno/token/${cleanToken}`);
            } else {
                setError(result.message || 'Token inválido ou expirado.');
            }
        } catch (err) {
            setError('Erro ao conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 mb-4 shadow-lg shadow-orange-500/20">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">NovaFitness</h1>
                    <p className="text-gray-400">Entre com seu código de acesso</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Token de Acesso
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    value={token}
                                    onChange={handleTokenChange}
                                    placeholder="Cole seu token ou o link completo..."
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Aceita o código hexadecimal ou o link novo completo.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all ${loading
                                ? 'bg-slate-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verificando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Entrar
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    Não tem um código? Peça ao seu treinador para gerar o <strong>novo link</strong>.
                </p>
            </div>
        </div>
    );
}

export default StudentLogin;

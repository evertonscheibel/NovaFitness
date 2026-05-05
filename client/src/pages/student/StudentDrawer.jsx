import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, X, ShieldCheck } from 'lucide-react';
import '../../styles/StudentArea.css';

function StudentDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();
    const studentName = localStorage.getItem('studentName') || 'Aluno';
    const isPremium = localStorage.getItem('isPremium') === 'true';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="sa-drawer-overlay" onClick={onClose}>
            <div className="sa-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="sa-drawer-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--sa-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '800' }}>
                            {studentName[0]}
                        </div>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--sa-text-sec)' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>{studentName}</div>
                    {isPremium && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'var(--sa-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                            <ShieldCheck size={14} /> Premium User
                        </div>
                    )}
                </div>

                <nav style={{ flex: 1 }}>
                    <div className="sa-drawer-item" onClick={onClose}>
                        <User size={20} />
                        <span>Meu Perfil</span>
                    </div>
                    <div className="sa-drawer-item" onClick={onClose}>
                        <Settings size={20} />
                        <span>Configurações</span>
                    </div>
                    <div className="sa-drawer-item" onClick={onClose}>
                        <HelpCircle size={20} />
                        <span>Suporte Central</span>
                    </div>
                </nav>

                <div className="sa-drawer-footer">
                    <div className="sa-drawer-item" onClick={handleLogout} style={{ color: 'var(--sa-error)', paddingLeft: 0 }}>
                        <LogOut size={20} />
                        <span>Sair do Aplicativo</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--sa-text-sec)', marginTop: '8px', textAlign: 'center' }}>
                        NovaFitness v1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDrawer;

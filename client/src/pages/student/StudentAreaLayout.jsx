import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, ClipboardList, TrendingUp, Menu } from 'lucide-react';
import StudentDrawer from './StudentDrawer';
import '../../styles/StudentArea.css';

function StudentAreaLayout() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const studentId = localStorage.getItem('studentId');


    useEffect(() => {
        if (!studentId) {
            navigate('/area-aluno/login', { replace: true });
        }
    }, [studentId, navigate]);

    if (!studentId) return null;

    return (
        <div className="student-area-root">
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'var(--sa-bg)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--sa-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        style={{ background: 'var(--sa-card)', border: '1px solid var(--sa-border)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Menu size={22} color="var(--sa-primary)" />
                    </button>
                    <img src="/logo.jpeg" alt="NovaFitness" style={{ height: '32px', objectFit: 'contain' }} />
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sa-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>
                    {localStorage.getItem('studentName')?.[0]}
                </div>
            </header>

            <StudentDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Outlet />

            <nav className="sa-bottom-nav">
                <NavLink to="/area-aluno" end className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={24} />
                    <span>Hoje</span>
                </NavLink>
                <NavLink to="/area-aluno/treinos" className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}>
                    <ClipboardList size={24} />
                    <span>Treinos</span>
                </NavLink>
                <NavLink to="/area-aluno/evolucao" className={({ isActive }) => `sa-nav-item ${isActive ? 'active' : ''}`}>
                    <TrendingUp size={24} />
                    <span>Evolução</span>
                </NavLink>
            </nav>
        </div>
    );
}

export default StudentAreaLayout;

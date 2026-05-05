import { useState, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Admin Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RegisterForm = lazy(() => import('./pages/RegisterForm'));
const TrainerReview = lazy(() => import('./pages/TrainerReview'));
const StudentList = lazy(() => import('./pages/StudentList'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const StudentEdit = lazy(() => import('./pages/StudentEdit'));
const WorkoutBuilder = lazy(() => import('./pages/WorkoutBuilder'));
const WorkoutList = lazy(() => import('./pages/WorkoutList'));
const WorkoutDetail = lazy(() => import('./pages/WorkoutDetail'));
const FinancialPage = lazy(() => import('./pages/FinancialPage'));
const CheckInPage = lazy(() => import('./pages/CheckInPage'));
const ManagementHub = lazy(() => import('./pages/ManagementHub'));
const ExerciseCatalog = lazy(() => import('./pages/ExerciseCatalog'));
const StandardWorkoutsPage = lazy(() => import('./pages/StandardWorkoutsPage'));
const WorkoutPDF = lazy(() => import('./pages/WorkoutPDF'));

// Student Area PWA Routes (Phase 1)
const StudentTokenAuth = lazy(() => import('./pages/student/StudentTokenAuth'));
const StudentAreaLogin = lazy(() => import('./pages/student/StudentLogin'));
const StudentAreaLayout = lazy(() => import('./pages/student/StudentAreaLayout'));

const StudentHoje = lazy(() => import('./pages/student/StudentHoje'));
const StudentTreinos = lazy(() => import('./pages/student/StudentTreinos'));
const StudentEvolucao = lazy(() => import('./pages/student/StudentEvolucao'));
const WorkoutExecution = lazy(() => import('./pages/student/WorkoutExecution'));


function App() {
    const location = useLocation();
    const isPublicRoute = location.pathname === '/cadastro-aluno' || location.pathname.startsWith('/area-aluno/');

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="app">
            {!isPublicRoute && (
                <nav className="navbar">
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src="/logo.jpeg" alt="NovaFitness" style={{
                                height: '65px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))', // Orange glow
                                borderRadius: '8px'
                            }} />
                        </div>

                        <button
                            className="desktop-hide btn-close"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>

                        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
                            <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/management" onClick={() => setMenuOpen(false)}>Gestão</Link>
                            <Link to="/checkin" onClick={() => setMenuOpen(false)}>Check-in</Link>
                        </div>
                    </div>
                </nav>
            )}


            <main className="main-content">
                <Suspense fallback={<LoadingSpinner message="Carregando página..." />}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/cadastro-aluno" element={<RegisterForm isPublic={true} />} />
                        <Route path="/trainer" element={<TrainerReview />} />
                        <Route path="/students" element={<StudentList />} />
                        <Route path="/student/:id" element={<StudentProfile />} />
                        <Route path="/student/:id/edit" element={<StudentEdit />} />
                        <Route path="/student/:id/workout/new" element={<WorkoutBuilder />} />
                        <Route path="/workout/:workoutId/edit" element={<WorkoutBuilder />} />
                        <Route path="/workouts" element={<WorkoutList />} />
                        <Route path="/workout/:id" element={<WorkoutDetail />} />
                        <Route path="/review/:suggestionId" element={<TrainerReview />} />
                        <Route path="/workout-pdf/:workoutId" element={<WorkoutPDF />} />
                        <Route path="/financial" element={<FinancialPage />} />
                        <Route path="/checkin" element={<CheckInPage />} />
                        <Route path="/management" element={<ManagementHub />} />
                        <Route path="/standard-workouts" element={<StandardWorkoutsPage />} />
                        <Route path="/exercises" element={<ExerciseCatalog />} />
                        {/* Student Area PWA (Mobile-first) */}
                        <Route path="/area-aluno/login" element={<StudentAreaLogin />} />
                        <Route path="/area-aluno/token/:token" element={<StudentTokenAuth />} />

                        <Route path="/area-aluno" element={<StudentAreaLayout />}>
                            <Route index element={<StudentHoje />} />
                            <Route path="treinos" element={<StudentTreinos />} />
                            <Route path="evolucao" element={<StudentEvolucao />} />
                        </Route>
                        <Route path="/area-aluno/execucao/:sessionId" element={<WorkoutExecution />} />

                    </Routes>
                </Suspense>
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} NovaFitness AI Trainer</p>
            </footer>
        </div>
    );
}

export default App;

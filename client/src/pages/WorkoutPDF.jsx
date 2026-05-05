import { useParams, useNavigate } from 'react-router-dom';
import { trainerAPI } from '../services/api';

function WorkoutPDF() {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const pdfUrl = trainerAPI.getPDF(workoutId);

    return (
        <div className="container">
            <div className="card">
                <button onClick={() => navigate(-1)} className="btn btn-sm" style={{ marginBottom: '10px' }}>
                    ← Voltar
                </button>
                <h2>📄 Ficha de Treino</h2>
                <div className="pdf-actions">
                    <a
                        href={pdfUrl}
                        download
                        className="btn btn-primary"
                    >
                        ⬇️ Baixar PDF
                    </a>
                </div>
                <div className="pdf-container">
                    <iframe
                        src={pdfUrl}
                        title="Workout PDF"
                        width="100%"
                        height="800px"
                        style={{ border: 'none', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default WorkoutPDF;

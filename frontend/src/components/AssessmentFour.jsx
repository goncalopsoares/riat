import { useProject } from "../contexts/ProjectContext";
import ErrorIcon from '@mui/icons-material/Error';
import SelectPhase from "./SelectPhase";

const AssessmentFour = ({ handlePhaseUpdate }) => {

    const { error, loading } = useProject();

    return (
        <div className="mt-5" style={{ marginBottom: '8rem' }}>
            < SelectPhase />
            {error && <p className="error-message" style={{ marginLeft: '4rem', marginRight: '4rem' }}><ErrorIcon className="me-3" />{error}</p>}
            <div className="button-container mt-5 text-end" style={{ marginRight: '4rem' }}>
                <button onClick={handlePhaseUpdate} disabled={loading} className='forms-button'>
                    {loading ? "Submitting..." : "Next"}
                </button>
            </div>
        </div>
    );
}

export default AssessmentFour;
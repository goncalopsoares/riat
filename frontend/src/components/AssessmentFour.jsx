import { useProject } from "../contexts/ProjectContext";
import SelectPhase from "./SelectPhase";

const AssessmentFour = ({ handlePhaseUpdate }) => {

    const { error, success, loading } = useProject();

    return (
        <div className="mt-5" style={{ marginBottom: '8rem' }}>
            < SelectPhase />
            {error && <p className="error-message" style={{ marginLeft: '4rem', marginRight: '4rem' }}><ErrorIcon className="me-3" />{error}</p>}
            {success && <p className="success-message" style={{ marginLeft: '4rem', marginRight: '4rem' }}><CheckCircleIcon className='me-3' />{success}</p>}
            <div className="button-container mt-5 text-end" style={{ marginRight: '4rem' }}>
                <button onClick={handlePhaseUpdate} disabled={loading} className='forms-button'>
                    {loading ? "Submitting..." : "Next"}
                </button>
            </div>
        </div>
    );
}

export default AssessmentFour;
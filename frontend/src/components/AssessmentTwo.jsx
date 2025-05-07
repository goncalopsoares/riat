import { useProject } from "../contexts/ProjectContext";
import ErrorIcon from '@mui/icons-material/Error';

const AssessmentTwo = ({ handleAgreement }) => {

    const { error, loading } = useProject();

    return (
        <div className="global-container mt-5" style={{ minHeight: '60vh' }}>
            <div className="create-project-container">
                <h2>Informed Consent & Data Privacy Agreement</h2>
                <p>The RIAT (Tesponsible Innovation Assessment Tool) is a self assessment and reflexive tool that introduces accountability among innovators, encouraging a proactive approach to address potential risks and unintended consequences of their innovation projects.
                    This is an interactive process by which  innovators assume a responsible approach towards innovation that creates change and positive impacts on society and the environment.
                    It does not intent to provoque judgements, but  help reflect on impact and practices in a continuous improuvement mode. Though, it should be conducted by the responsible of the innovation project in 3 different phases of the project:</p>
                {error && <p className="error-message"><ErrorIcon className="me-3" />{error}</p>}
                <form className="form-container w-100 d-flex flex-column">
                    <label>
                        <input type="checkbox" id="agreement" name="agreement" />
                        <span className="ms-2">Yes, I agree to the terms and conditions</span>
                </label>
                <div className="button-container mt-5 text-end">
                    <button onClick={handleAgreement} disabled={loading} className='forms-button'>
                        {loading ? "Submitting..." : "Next"}
                    </button>
                </div>
            </form>
        </div>
        </div >
    )

}

export default AssessmentTwo;
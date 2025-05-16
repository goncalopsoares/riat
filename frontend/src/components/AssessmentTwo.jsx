import { useProject } from "../contexts/ProjectContext";
import ErrorIcon from '@mui/icons-material/Error';

const AssessmentTwo = ({ handleAgreement }) => {

    const { error, loading } = useProject();

    return (
        <div className="global-container mt-5" style={{ minHeight: '72vh' }}>
            <div className="create-project-container">
                <h2>Informed Consent & Data Privacy Agreement</h2>
                <p>The RIAT tool has been developed as part of the  Horizon Europe SoTecIn Factory project and any personal data will be processed in accordance with applicable national and EU legislation and will only be used by researchers for the purposes of scientific research within the scope of the SoTecIn Factory project.</p>
                {error && <p className="error-message"><ErrorIcon className="me-3" />{error}</p>}
                <form className="form-container w-100 d-flex flex-column">
                    <label>
                        <input type="checkbox" id="agreement" name="agreement" />
                        <span className="ms-2">Yes, I've read the <a href="/privacy_policy_riat.pdf">Privacy Policy</a> thoroughly and I'm ready to continue</span>
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
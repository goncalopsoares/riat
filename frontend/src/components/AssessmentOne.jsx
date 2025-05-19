import { useProject } from "../contexts/ProjectContext";
import ErrorIcon from '@mui/icons-material/Error';

const AssessmentOne = ({ handleInstructionsRead }) => {

    const { error, loading } = useProject();

    return (
        <div className="global-container mt-5" style={{ minHeight: '72vh' }}>
            <div className="create-project-container">
                <h2>Instructions</h2>
                <p>The RIAT should be conducted by the responsible of the innovation project in 3 different phases of the innovation project:</p>
                <ul>
                    <li><b>Phase 1</b> - At the beginning of the project planning while defining the scope and engaging the project team </li>
                    <li><b>Phase 2</b> - During project development (with at least 25% of project activities executed, before testing and it is recommended to repeat every 6 months)</li>
                    <li><b>Phase 3</b> - At the end of the project, before launching the project results and go-to-market</li>
                </ul>
                <p>This self-assessment provides a set of statements by each of the Responsible Innovation dimensions to be scored in a seven-degree scale. Please use "Prefer not to answer" as last option. The overall assessment score level and final report will provide you the information of the dimensions to be improved and recommendations to be followed before future reassessments.</p>
                {error && <p className="error-message"><ErrorIcon className="me-3" />{error}</p>}
                <form className="form-container w-100 d-flex flex-column">
                    <label>
                        <input type="checkbox" id="instructions" name="instructions" />
                        <span className="ms-2">Yes, I read the instructions throughly and I am ready to start the assessment</span>
                    </label>
                    <div className="button-container mt-5 text-end">
                        <button onClick={handleInstructionsRead} disabled={loading} className='forms-button'>
                            {loading ? "Submitting..." : "Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default AssessmentOne;
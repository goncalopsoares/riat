import { useProject } from "../contexts/ProjectContext";
import ErrorIcon from '@mui/icons-material/Error';

const AssessmentOne = ({ handleInstructionsRead }) => {

    const { error, loading } = useProject();

    return (
        <div className="global-container mt-5" style={{ minHeight: '60vh' }}>
            <div className="create-project-container">
                <h2>Instructions</h2>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi quisquam rerum cupiditate rem ut recusandae consequatur enim est itaque nostrum asperiores odio quia at omnis hic dolorum amet neque, maiores ducimus dignissimos tenetur laboriosam quo numquam. Placeat culpa architecto quidem ad, est rerum ipsum nostrum facilis! Quas, sapiente provident enim alias sit hic eaque impedit et rem non in illo totam id consectetur corrupti asperiores iure veniam fuga? Quia ratione, nulla cupiditate quas cumque at officiis sunt ducimus doloribus veritatis quis itaque voluptatibus illo quibusdam! Facilis neque error quia odio impedit nihil quidem cum eveniet inventore a, esse saepe totam.</p>
                {error && <p className="error-message"><ErrorIcon className="me-3" />{error}</p>}
                <form className="form-container w-100 d-flex flex-column">
                    <label>
                        <input type="checkbox" id="instructions" name="instructions" />
                        <span className="ms-2">Yes, I read the Instructions throughly and I am ready to start the assessment</span>
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
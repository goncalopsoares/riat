import CreateProject from './CreateProject';
import { useProject } from "../contexts/ProjectContext";

const AssessmentOne = ({ handleProjectSubmit }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            <CreateProject />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button onClick={handleProjectSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Next"}
            </button>
        </>
    )

}

export default AssessmentOne;
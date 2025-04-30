import CreateProject from './CreateProject';
import { useProject } from "../contexts/ProjectContext";

const AssessmentThree = ({ handleProjectSubmit }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            <CreateProject />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button onClick={handleProjectSubmit} disabled={loading} className='forms-button'>
                {loading ? "Submitting..." : "Next"}
            </button>
        </>
    )

}

export default AssessmentThree;
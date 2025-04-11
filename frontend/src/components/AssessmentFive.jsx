import { useProject } from "../contexts/ProjectContext";
import SelectPhase from "./SelectPhase";

const AssessmentFive = ({  }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            < SelectPhase />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button onClick={handlePhaseUpdate} disabled={loading}>
                {loading ? "Submitting..." : "Next"}
            </button>
        </>
    );
}

export default AssessmentFive;
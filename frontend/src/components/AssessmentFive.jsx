import { useProject } from "../contexts/ProjectContext";

const AssessmentFive = ({  }) => {

    const { error, success, loading } = useProject();

    return (
        <>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button disabled={loading}>
                {loading ? "Submitting..." : "Next"}
            </button>
        </>
    );
}

export default AssessmentFive;
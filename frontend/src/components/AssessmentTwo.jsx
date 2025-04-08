import { useProject } from "../contexts/ProjectContext";

const AssessmentTwo = ({ handleAgreement }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            <h2>Informed Consent & Data Privacy Agreement</h2>
            <p>The RIAT (Tesponsible Innovation Assessment Tool) is a self assessment and reflexive tool that introduces accountability among innovators, encouraging a proactive approach to address potential risks and unintended consequences of their innovation projects.
                This is an interactive process by which  innovators assume a responsible approach towards innovation that creates change and positive impacts on society and the environment.
                It does not intent to provoque judgements, but  help reflect on impact and practices in a continuous improuvement mode. Though, it should be conducted by the responsible of the innovation project in 3 different phases of the project:</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <label>
                <input type="checkbox" id="agreement" name="agreement" />
                Yes, I agree to the terms and conditions
            </label>
            <button onClick={handleAgreement} disabled={loading}>
                {loading ? "Submitting..." : "Next"}
            </button>
        </>
    )

}

export default AssessmentTwo;
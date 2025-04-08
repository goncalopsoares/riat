import { useProject } from "../contexts/ProjectContext";

const AssessmentOne = ({ handleInstructionsRead }) => {

    const { error, success, loading } = useProject();

    return (
        <>
            <h2>Instructions</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi quisquam rerum cupiditate rem ut recusandae consequatur enim est itaque nostrum asperiores odio quia at omnis hic dolorum amet neque, maiores ducimus dignissimos tenetur laboriosam quo numquam. Placeat culpa architecto quidem ad, est rerum ipsum nostrum facilis! Quas, sapiente provident enim alias sit hic eaque impedit et rem non in illo totam id consectetur corrupti asperiores iure veniam fuga? Quia ratione, nulla cupiditate quas cumque at officiis sunt ducimus doloribus veritatis quis itaque voluptatibus illo quibusdam! Facilis neque error quia odio impedit nihil quidem cum eveniet inventore a, esse saepe totam.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <form>
                <label>
                    <input type="checkbox" id="instructions" name="instructions" />
                    Yes, I read the Instructions throughly and I am ready to start the assessment
                </label>
                <button onClick={handleInstructionsRead} disabled={loading}>
                    {loading ? "Submitting..." : "Next"}
                </button>
            </form>
        </>
    )

}

export default AssessmentOne;
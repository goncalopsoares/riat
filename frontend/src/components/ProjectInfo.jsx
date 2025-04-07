const ProjectInfo = ({ surveyName, surveyDescription, surveyCreatedBy, surveyCreationTime, surveyModifiedBy, surveyLastModifiedByDate, editingDescription, setEditingDescription, handleSurveySubmit }) => {

    return (
        <div>
            <h1>{surveyName}</h1>
            {editingDescription ? (
                <form onSubmit={(e) => { setEditingDescription(false); handleSurveySubmit(e); }}>
                    <input
                        name="survey_description"
                        type="text"
                        defaultValue={surveyDescription}
                    />
                    <button type="submit">Save</button>
                </form>
            ) : (
                <p onClick={() => setEditingDescription(true)}>{surveyDescription}</p>
            )}

            <p>Created by {surveyCreatedBy} on {surveyCreationTime}</p>
            <p>Last modified by {surveyModifiedBy} on {surveyLastModifiedByDate}</p>
        </div>
    );
}

export default ProjectInfo;
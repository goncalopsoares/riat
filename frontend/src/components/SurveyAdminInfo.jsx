const SurveyAdminInfo = ({ surveyName, surveyDescription, surveyCreatedBy, surveyCreationTime, surveyModifiedBy, surveyLastModifiedByDate, editingDescription, setEditingDescription, handleSurveySubmit }) => {

    return (
        <div className="ms-3">
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
                <p className="fs-5" onClick={() => setEditingDescription(true)}>{surveyDescription}</p>
            )}
            <div className="d-flex flex-row gap-5">
                <p>Created by <b>{surveyCreatedBy}</b> on <b>{surveyCreationTime}</b></p>
                <p>Last modified by <b>{surveyModifiedBy}</b> on <b>{surveyLastModifiedByDate}</b></p>
            </div>
        </div>
    );
}

export default SurveyAdminInfo;
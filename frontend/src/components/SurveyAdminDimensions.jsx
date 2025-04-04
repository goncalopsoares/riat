import SurveyAdminStatements from "./SurveyAdminStatements";

const SurveyAdminDimensions = ({ allDimensions, isShowing, setIsShowing, editingDimensionDescription, setEditingDimensionDescription, handleDimensionSubmit, setUpdateDimensionDescription }) => {

    return (
        <div>
            <ul>
                {allDimensions.map(dimension => (
                    <li key={dimension.id_dimensions}>
                        <h3 onClick={() => {
                            if (isShowing === dimension.id_dimensions) {
                                setIsShowing(null);
                            } else {
                                setIsShowing(dimension.id_dimensions);
                            }
                        }}>{dimension.dimension_name}</h3>
                        {isShowing === dimension.id_dimensions && (
                            editingDimensionDescription ? (
                                <form onSubmit={(e) => { 
                                    e.preventDefault();
                                    setEditingDimensionDescription(false);
                                    setUpdateDimensionDescription(true);
                                    handleDimensionSubmit(e, dimension.id_dimensions, dimension.dimension_name); 
                                }}>
                                    <textarea
                                        name="dimension_description"
                                        defaultValue={dimension.dimension_description}
                                    >
                                    </textarea>
                                    <button type="submit">Save</button>
                                </form>
                            ) : (
                                <p onClick={() => setEditingDimensionDescription(true)}>
                                    {dimension.dimension_description}
                                </p>
                            )
                        )}
                        {isShowing === dimension.id_dimensions && <SurveyAdminStatements statements={dimension.statements} />}
                    </li>
                ))}
            </ul>
        </div >
    )
}

export default SurveyAdminDimensions;
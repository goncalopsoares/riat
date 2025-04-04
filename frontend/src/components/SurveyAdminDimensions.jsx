import SurveyAdminStatements from "./SurveyAdminStatements";
import DimensionStatementDialog from './DimensionStatementDialog';

const SurveyAdminDimensions = ({ allDimensions, isShowing, setIsShowing, editingDimensionDescription, setEditingDimensionDescription, handleDimensionSubmit, setUpdateDimensionDescription, editingDimensionName, setEditingDimensionName, allScales, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription, setUpdateStatementName, handleStatementSubmit, addStatement, setAddStatement, dialogRef, currentDimensionForStatement, setCurrentDimensionForStatement }) => {



    return (
        <>
            <div>
                <ul>
                    {allDimensions.map(dimension => (
                        <li key={dimension.id_dimensions}>
                            {editingDimensionName === dimension.id_dimensions ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleDimensionSubmit(e, dimension.id_dimensions, dimension.dimension_description);
                                    setEditingDimensionName(false);
                                }}>
                                    <input
                                        name="dimension_name"
                                        type="text"
                                        defaultValue={dimension.dimension_name}
                                        autoFocus
                                    />
                                    <button type="submit">Save</button>
                                </form>
                            ) : (
                                <h3 onClick={() => {
                                    if (isShowing === dimension.id_dimensions) {
                                        setIsShowing(false);
                                    } else {
                                        setIsShowing(dimension.id_dimensions);
                                    }
                                }}
                                    onDoubleClick={() => {
                                        setEditingDimensionName(dimension.id_dimensions);
                                    }}>
                                    {dimension.dimension_name}
                                </h3>
                            )}
                            {isShowing === dimension.id_dimensions && (
                                editingDimensionDescription ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        setEditingDimensionDescription(true);
                                        handleDimensionSubmit(e, dimension.id_dimensions, dimension.dimension_name);
                                    }}>
                                        <textarea
                                            name="dimension_description"
                                            defaultValue={dimension.dimension_description}
                                            autoFocus
                                        >
                                        </textarea>
                                        <button type="submit">Save</button>
                                    </form>
                                ) : (
                                    <p onDoubleClick={() => {
                                        setEditingDimensionDescription(true);
                                        setUpdateDimensionDescription(true);
                                    }}>
                                        {dimension.dimension_description}
                                    </p>
                                )
                            )}
                            {isShowing === dimension.id_dimensions && <SurveyAdminStatements statements={dimension.statements} allScales={allScales} handleDimensionSubmit={handleDimensionSubmit} editingStatementName={editingStatementName} setEditingStatementName={setEditingStatementName} editingStatementDescription={editingStatementDescription} setEditingStatementDescription={setEditingStatementDescription} setUpdateStatementDescription={setUpdateStatementDescription} handleStatementSubmit={handleStatementSubmit} setUpdateStatementName={setUpdateStatementName} />}
                            {isShowing === dimension.id_dimensions && <button onClick={() => {
                                setAddStatement(true);
                                setCurrentDimensionForStatement(dimension.id_dimensions);
                            }
                            }>Add New Statement</button>}
                        </li>

                    ))}
                </ul>
            </div >
            {addStatement ? (
                <DimensionStatementDialog dialogRef={dialogRef} setAddStatement={setAddStatement} id={currentDimensionForStatement} handleStatementSubmit={handleStatementSubmit}
                />) : null}
        </>
    )
}

export default SurveyAdminDimensions;
import SurveyAdminStatements from "./SurveyAdminStatements";
import DimensionStatementDialog from './DimensionStatementDialog';

const SurveyAdminDimensions = ({ allDimensions, isShowing, setIsShowing, editingDimensionShortDescription, setEditingDimensionShortDescription, setUpdateDimensionShortDescription, editingDimensionDescription, setEditingDimensionDescription, handleDimensionSubmit, setUpdateDimensionDescription, editingDimensionName, setEditingDimensionName, allScales, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription, setUpdateStatementName, handleStatementSubmit, addStatement, setAddStatement, dialogRef, currentDimensionForStatement, setCurrentDimensionForStatement }) => {

    return (
        <>
            <div className="container my-4">
                <ul className="list-group">
                    {allDimensions.map((dimension) => (
                        <li key={dimension.id_dimensions} className="list-group-item">
                            {editingDimensionName === dimension.id_dimensions ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleDimensionSubmit(
                                            e,
                                            dimension.id_dimensions,
                                            {
                                                dimension_description: dimension.dimension_description,
                                                dimension_short_description: dimension.dimension_short_description,
                                            },
                                            'name'
                                        );
                                        setEditingDimensionName(false);
                                    }}
                                    className="d-flex align-items-center"
                                >
                                    <input
                                        name="dimension_name"
                                        type="text"
                                        defaultValue={dimension.dimension_name}
                                        autoFocus
                                        className="form-control me-2"
                                    />
                                    <button type="submit" className="btn btn-sm btn-primary">
                                        Save
                                    </button>
                                </form>
                            ) : (
                                <h2
                                    className="h2 my-4"
                                    onClick={() =>
                                        setIsShowing(
                                            isShowing === dimension.id_dimensions ? false : dimension.id_dimensions
                                        )
                                    }
                                    onDoubleClick={() => setEditingDimensionName(dimension.id_dimensions)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {dimension.dimension_name}
                                </h2>
                            )}

                            {isShowing === dimension.id_dimensions && (
                                <div className="mt-3">
                                    {editingDimensionShortDescription ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleDimensionSubmit(
                                                    e,
                                                    dimension.id_dimensions,
                                                    {
                                                        dimension_name: dimension.dimension_name,
                                                        dimension_description: dimension.dimension_description,
                                                        dimension_short_description: dimension.dimension_short_description,
                                                    },
                                                    'short_description'
                                                )
                                            }
                                            className="mb-3"
                                        >
                                            <textarea
                                                name="dimension_short_description"
                                                defaultValue={dimension.dimension_short_description}
                                                autoFocus
                                                className="form-control mb-2"
                                                rows={2}
                                            />
                                            <button type="submit" className="btn btn-sm btn-primary">
                                                Save
                                            </button>
                                        </form>
                                    ) : (
                                        <p
                                            className="mb-2 fs-4"
                                            onDoubleClick={() => {
                                                setEditingDimensionShortDescription(true);
                                                setUpdateDimensionShortDescription(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {dimension.dimension_short_description}
                                        </p>
                                    )}

                                    {editingDimensionDescription ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleDimensionSubmit(
                                                    e,
                                                    dimension.id_dimensions,
                                                    {
                                                        dimension_name: dimension.dimension_name,
                                                        dimension_description: dimension.dimension_description,
                                                        dimension_short_description: dimension.dimension_short_description,
                                                    },
                                                    'description'
                                                )
                                            }
                                            className="mb-3"
                                        >
                                            <textarea
                                                name="dimension_description"
                                                defaultValue={dimension.dimension_description}
                                                autoFocus
                                                className="form-control mb-2"
                                                rows={4}
                                            />
                                            <button type="submit" className="btn btn-sm btn-success">
                                                Save
                                            </button>
                                        </form>
                                    ) : (
                                        <p
                                            onDoubleClick={() => {
                                                setEditingDimensionDescription(true);
                                                setUpdateDimensionDescription(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {dimension.dimension_description}
                                        </p>
                                    )}



                                    {isShowing === dimension.id_dimensions && (
                                        <SurveyAdminStatements
                                            statements={dimension.statements}
                                            allScales={allScales}
                                            handleDimensionSubmit={handleDimensionSubmit}
                                            editingStatementName={editingStatementName}
                                            setEditingStatementName={setEditingStatementName}
                                            editingStatementDescription={editingStatementDescription}
                                            setEditingStatementDescription={setEditingStatementDescription}
                                            setUpdateStatementDescription={setUpdateStatementDescription}
                                            handleStatementSubmit={handleStatementSubmit}
                                            setUpdateStatementName={setUpdateStatementName}
                                        />
                                    )}
                                    <div className="d-flex gap-2 my-4">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                setAddStatement(true);
                                                setCurrentDimensionForStatement(dimension.id_dimensions);
                                            }}
                                        >
                                            Add New Statement
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {addStatement && (
                <DimensionStatementDialog
                    dialogRef={dialogRef}
                    setAddStatement={setAddStatement}
                    id={currentDimensionForStatement}
                    handleStatementSubmit={handleStatementSubmit}
                />
            )}
        </>
    );
}

export default SurveyAdminDimensions;
import { useState } from "react";
import DeleteStatementDialog from "./DeleteStatementDialog";

const SurveyAdminStatements = ({ statements, allScales, handleStatementSubmit, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription, setUpdateStatementName, handleDeleteStatement, dialogRef }) => {

    const [deletingStatementId, setDeletingStatementId] = useState(null);

    return (
        <div className="mt-4">
            <ul className="p-0 mx-3" style={{ listStyleType: 'none' }}>
                {statements.map(statement => (
                    <li key={statement.id_statements} className="my-5 bg-body-secondary p-4 rounded-1">
                        {editingStatementName === statement.id_statements ? (
                            <form
                                onSubmit={(e) => {
                                    handleStatementSubmit(
                                        e,
                                        statement.id_statements,
                                        {
                                            statement_description: statement.statement_description,
                                            scales_id_scales: statement.scale.id_scales,
                                        },
                                        'name'
                                    );
                                }}
                            >
                                <input
                                    name="statement_name"
                                    type="text"
                                    defaultValue={statement.statement_name}
                                    autoFocus
                                    className="form-control mb-2"
                                />
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        ) : (
                            <div className="tooltip-wrapper w-100">
                                <h3
                                    title="Double click to edit"
                                    onDoubleClick={() => {
                                        setEditingStatementName(statement.id_statements);
                                        setUpdateStatementName(true);
                                    }}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    {statement.statement_name}
                                </h3>
                                <span className="tooltip-text" style={{ bottom: '100%' }}>Double click to edit</span>
                            </div>
                        )}

                        {editingStatementDescription === statement.id_statements ? (
                            <form
                                onSubmit={(e) => {
                                    handleStatementSubmit(e,
                                        statement.id_statements,
                                        {
                                            statement_name: statement.statement_name,
                                            scales_id_scales: statement.scales_id_scales,
                                        },
                                        'description');
                                }}
                            >
                                <textarea
                                    name="statement_description"
                                    defaultValue={statement.statement_description}
                                    autoFocus
                                />
                                <button type="submit">Save</button>
                            </form>
                        ) : (
                            <div className="tooltip-wrapper w-100">
                                <p
                                    onDoubleClick={() => {
                                        setEditingStatementDescription(statement.id_statements);
                                        setUpdateStatementDescription(true);
                                    }}
                                    className="fs-5"
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    {statement.statement_description}
                                </p>
                                <span className="tooltip-text" style={{ bottom: '100%' }}>Double click to edit</span>
                            </div>
                        )}
                        <div className="d-flex flex-row">
                            <p className="mb-1"><b>Currently used scale for this statement</b></p>
                            <p className="mb-0 ms-3">{statement.scale.scale_name}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginBottom: '10px' }}>
                            {statement.scale.scale_labels.split(',').map((label, index, arr) => (
                                <p key={index}>
                                    {label.trim()}
                                    {index !== arr.length - 1 && ' | '}
                                </p>
                            ))}
                        </div>

                        <div className="d-flex flex-row align-items-center mb-1" style={{ gap: '5px' }}>
                            <p className="mb-0 me-3"><b>Select another scale</b></p>
                            <div>
                                <select
                                    name="scales_id_scales"
                                    className="form-control"
                                    defaultValue={statement.scale.id_scales}
                                    onChange={(e) => {
                                        const newScale = Number(e.target.value);
                                        handleStatementSubmit(
                                            null,
                                            statement.id_statements,
                                            {
                                                statement_name: statement.statement_name,
                                                statement_description: statement.statement_description,
                                                scales_id_scales: newScale,
                                            },
                                            'scale'
                                        );
                                    }}
                                >
                                    <option value="" disabled>Select scale</option>
                                    {allScales.map(scale => (
                                        <option key={scale.id_scales} value={scale.id_scales}>
                                            {scale.scale_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button onClick={() => setDeletingStatementId(statement.id_statements)} className="btn btn-sm btn-danger mt-3" style={{ height: '2.5rem' }}>Delete</button>
                        {deletingStatementId === statement.id_statements && (
                            <DeleteStatementDialog
                                setDeletingStatement={() => setDeletingStatementId(null)}
                                id={statement.id_statements}
                                handleDeleteStatement={handleDeleteStatement}
                                dialogRef={dialogRef}
                            />
                        )}

                    </li>
                ))}
            </ul>
        </div >
    );
}

export default SurveyAdminStatements;
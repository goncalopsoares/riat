const SurveyAdminStatements = ({ statements, allScales, handleStatementSubmit, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription, setUpdateStatementName }) => {

    console.log(statements)

    return (
        <div className="mt-4">
            <ul>
                {statements.map(statement => (
                    <li key={statement.id_statements} className="my-5">
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
                            <h3
                                onDoubleClick={() => {
                                    setEditingStatementName(statement.id_statements);
                                    setUpdateStatementName(true);
                                }}
                            >
                                {statement.statement_name}
                            </h3>
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
                            <p
                                onDoubleClick={() => {
                                    setEditingStatementDescription(statement.id_statements);
                                    setUpdateStatementDescription(true);
                                }}
                            >
                                {statement.statement_description}
                            </p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginBottom: '10px' }}>
                            {statement.scale.scale_labels.split(',').map((label, index) => (
                                <p key={index}>{label.trim()}</p>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginBottom: '10px' }}>
                                <select
                                    name="scales_id_scales"
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
                                <a href="/scaletools">Edit scale</a>
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
        </div >
    );
}

export default SurveyAdminStatements;
const SurveyAdminStatements = ({ statements, allScales, handleStatementSubmit, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription }) => {

    return (
        <div>
            <ul>
                {statements.map(statement => (
                    <li key={statement.id_statements}>
                        {editingStatementName === statement.id_statements ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleStatementSubmit(e, statement.id_statements, statement.statement_description);
                                setEditingStatementName(false);
                            }}>
                                <input
                                    name="statement_name"
                                    type="text"
                                    defaultValue={statement.statement_name}
                                    autoFocus
                                />
                                <button type="submit">Save</button>
                            </form>
                        ) : (
                            <h3
                                onDoubleClick={() => setEditingStatementName(statement.id_statements)}
                            >
                                {statement.statement_name}
                            </h3>
                        )}

                        {editingStatementDescription === statement.id_statements ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setEditingStatementDescription(true);
                                handleStatementSubmit(e, statement.id_statements, statement.statement_name);
                            }}>
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
                            <select
                                name="statement_scale"
                                defaultValue={statement.scale.id_scales}
                                onChange={(e) => handleStatementSubmit(statement.id_statements, e.target.value)}
                            >
                                <option value="" disabled>Select scale</option>
                                {allScales.map(scale => (
                                    <option key={scale.id_scales} value={scale.id_scales}>
                                        {scale.scale_name}
                                    </option>
                                ))}
                            </select>
                            <a href='/scaletools'>Edit scale</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div >
    )
}

export default SurveyAdminStatements;
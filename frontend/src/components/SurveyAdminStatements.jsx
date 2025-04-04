const SurveyAdminStatements = ({ statements }) => {

    return (
        <div>
            <ul>
                {statements.map(statement => (
                    <li key={statement.id_statements}>
                        <h3>{statement.statement_name}</h3>
                        <p>{statement.statement_description}</p>
                        <button>Edit Statement</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SurveyAdminStatements;
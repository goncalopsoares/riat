const reportAnswers = ({ dimensionsData, showAnswers, setShowAnswers, sanitizeSimple }) => {
    
    return (
        <div className="mt-5">
            <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                <h3><b>Answers</b></h3>
                {
                    showAnswers ? (
                        <button onClick={() => setShowAnswers(false)} className="forms-button">Hide</button>
                    ) : (
                        <button onClick={() => setShowAnswers(true)} className="forms-button">Show All</button>
                    )
                }
            </div>
            <div>
                {dimensionsData && dimensionsData.length > 0 && !showAnswers && (
                    <div className="answers-container mt-3">
                        <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                            <h4>1. {dimensionsData[0].name}</h4>
                            <div className="d-flex flex-row align-items-center">
                                <div className="dot"></div>
                                <p className="m-0 ms-2"><b style={{ color: "#0091be" }}>Your answer</b></p>
                            </div>
                        </div>
                        <p style={{ color: '#002d46' }}><b>{dimensionsData[0].short_description}</b></p>
                        <p>{dimensionsData[0].description}</p>
                        <div>
                            {dimensionsData[0].statements.map((statement, index) => (
                                <div key={statement.id}>
                                    <div key={statement.id} className="mt-5 mb-2">
                                        <b>1.{index + 1}. {statement.name}</b>
                                        <p
                                            className="statement-description"
                                            style={{ color: '#002d46', fontStyle: 'italic' }}
                                            dangerouslySetInnerHTML={{ __html: sanitizeSimple(statement.description) }}
                                        />
                                    </div>
                                    {statement.answers.map(answer => (
                                        statement.scale_labels && statement.scale_labels !== 'n/a' && statement.scale_labels.search(answer.value) >= 0 ? (
                                            <div key={answer.id} className="text-sm text-gray-600">
                                                {statement.scale_labels.split(",").map((label, index) => (
                                                    label === answer.value ? (
                                                        <div key={index} className="d-inline-flex flex-column align-items-center">
                                                            <div className="dot me-3"></div>
                                                            <span className="scale-labels me-3 mb-1"><b style={{ color: '#0091be' }}>{label}</b></span>
                                                        </div>
                                                    ) : (
                                                        <div key={index} className="d-inline-flex flex-column align-items-center">
                                                            <div className="dot-invis"></div>
                                                            <span className="scale-labels me-3 mb-1">{label}</span>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        ) : statement.scale_labels && statement.scale_labels !== 'n/a' ? (
                                            <div key={answer.id} className="text-sm text-gray-600">
                                                <p className="mb-0" style={{ color: '#002d46' }}><b>Prefer not to answer</b></p>
                                                <p style={{ color: '#0091be' }}>{answer.value}</p>
                                            </div>

                                        ) : (
                                            <div key={answer.id} className="text-sm text-gray-600">
                                                <p style={{ color: '#0091be' }}>{answer.value}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ))}
                            <div className="w-100 text-center my-4">
                                <a onClick={() => setShowAnswers(true)} className="text-decoration-underline" style={{ cursor: 'pointer', color: '#0091be' }}><b>Show more</b></a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {
                showAnswers && (
                    <div className="answers-container">
                        {dimensionsData.map((dimension, dimensionIndex) => (
                            <div key={dimension.id} className="mb-4">
                                <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                                    <h4>{dimensionIndex + 1}. {dimension.name}</h4>
                                    <div className="d-flex flex-row align-items-center">
                                        <div className="dot"></div>
                                        <p className="m-0 ms-2"><b style={{ color: "#0091be" }}>Your answer</b></p>
                                    </div>
                                </div>
                                {dimension.short_description !== dimension.description && (
                                    <p style={{ color: '#002d46' }}><b>{dimension.short_description}</b></p>
                                )}
                                <p>{dimension.description}</p>
                                {dimension.statements.map((statement, statementIndex) => (

                                    <div key={statement.id} className="my-5">
                                        <b>{dimensionIndex + 1}.{statementIndex + 1}. {statement.name}</b>
                                        <p
                                                        className="statement-description"
                                                        style={{ color: '#002d46', fontStyle: 'italic' }}
                                                        dangerouslySetInnerHTML={{ __html: sanitizeSimple(statement.description) }}
                                                    />
                                        {statement.answers.map(answer => (
                                            statement.scale_labels && statement.scale_labels !== 'n/a' && statement.scale_labels.search(answer.value) >= 0 ? (
                                                < div key={answer.id} className="text-sm text-gray-600" >
                                                    {
                                                        statement.scale_labels.split(",").map((label, index) => (
                                                            label === answer.value ? (
                                                                <div key={index} className="d-inline-flex flex-column align-items-center">
                                                                    <div className="dot me-3"></div>
                                                                    <span className="scale-labels me-3 mb-1"><b style={{ color: '#0091be' }}>{label}</b></span>
                                                                </div>
                                                            ) : (
                                                                <div key={index} className="d-inline-flex flex-column align-items-center">
                                                                    <div className="dot-invis"></div>
                                                                    <span className="scale-labels me-3 mb-1">{label}</span>
                                                                </div>
                                                            )
                                                        ))
                                                    }
                                                </div>
                                            ) : statement.scale_labels && statement.scale_labels !== 'n/a' ? (
                                                <div key={answer.id} className="text-sm text-gray-600">
                                                    <p className="mb-0" style={{ color: '#002d46' }}><b>Prefer not to answer</b></p>
                                                    <p style={{ color: '#0091be' }}>{answer.value}</p>
                                                </div>

                                            ) : (
                                                <div key={answer.id} className="text-sm text-gray-600">
                                                    <p style={{ color: '#0091be' }}>{answer.value}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ))}
                                {dimensionIndex !== dimensionsData.length - 1 && (
                                    <div className="border-bottom border-3 mb-4"></div>
                                )}
                            </div>
                        ))}
                        <div className="w-100 text-center my-4">
                            <a onClick={() => setShowAnswers(false)} className="text-decoration-underline" style={{ cursor: 'pointer', color: '#0091be' }}><b>Hide</b></a>
                        </div>
                    </div>

                )
            }
        </div >
    );
}

export default reportAnswers;
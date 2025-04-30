const AssessmentFive = ({ loading, allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage, selectedValues, setSelectedValues, handleStatementAnswerSubmit, existingAnswers, handleAssessmentSubmit }) => {

    return (

        <>
            {allDimensions.length > 0 && loading === false && (
                <div className="global-container">
                    <div className="create-project-container">
                        <div className="progress-bar-container"
                        >
                            <div
                                className="progress-bar"
                                style={{ width: `${(currentDimension / dimensionsNumber) * 100}%` }} >
                            </div>
                        </div>
                        {dimensionStage === 1 && (
                            <div>
                                <h1 className="dimension-name">{allDimensions[currentDimension].dimension_name}</h1>
                                <p className="dimension-description">{allDimensions[currentDimension].dimension_description}</p>
                            </div>)}
                        {dimensionStage === 2 && (
                            <div>
                                <h1 className="dimension-name-small">{allDimensions[currentDimension].dimension_name}</h1>
                                <p className="dimension-description-small">{allDimensions[currentDimension].dimension_description}</p>
                                {allDimensions[currentDimension].statements.map(statement => {

                                    const scaleLabels = statement.scale.scale_labels.split(',').map(label => label.trim());

                                    // Skip the "Provide Examples" statement
                                    if (statement.statement_name === 'Provide Examples') {
                                        return null;
                                    }

                                    return (
                                        <div key={statement.id_statements} className="statement-container">
                                            <h4 className="statement-name">{statement.statement_name}</h4>
                                            <p className="statement-description">{statement.statement_description}</p>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                {scaleLabels.map((label, index) => (
                                                    <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                                        {(selectedValues[`${statement.id_statements}`] === undefined ||
                                                            selectedValues[`${statement.id_statements}`] === null ||
                                                            selectedValues[`${statement.id_statements}`] === "" ||
                                                            (
                                                                selectedValues[`${statement.id_statements}`] !== "N/A" &&
                                                                !isNaN(selectedValues[`${statement.id_statements}`])
                                                            )
                                                        ) && (
                                                                <>
                                                                    <label className="radio-label mb-2">{label}</label>
                                                                    <input
                                                                        className="radio-input mt-1"
                                                                        type="radio"
                                                                        name={statement.id_statements}
                                                                        value={index + 1}
                                                                        checked={selectedValues[`${statement.id_statements}`] === index + 1}
                                                                        onChange={(e) => {
                                                                            const selectedValue = parseInt(e.target.value, 10);
                                                                            setSelectedValues(prev => ({
                                                                                ...prev,
                                                                                [statement.id_statements]: selectedValue
                                                                            }));
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                className="checkbox-input me-3 mt-5"
                                                type="checkbox"
                                                name={`${statement.id_statements}_na`}
                                                checked={
                                                    (selectedValues[`${statement.id_statements}`] === "N/A" || isNaN(selectedValues[`${statement.id_statements}`])) &&
                                                    selectedValues[`${statement.id_statements}`] !== "" &&
                                                    selectedValues[`${statement.id_statements}`] !== null &&
                                                    selectedValues[`${statement.id_statements}`] !== undefined
                                                }
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setSelectedValues(prev => {
                                                        const updatedValues = { ...prev };
                                                        if (isChecked) {
                                                            updatedValues[`${statement.id_statements}`] = "N/A";
                                                        } else {
                                                            delete updatedValues[`${statement.id_statements}`];
                                                        }
                                                        return updatedValues;
                                                    });
                                                }}
                                            />
                                            <label>{selectedValues[`${statement.id_statements}`] === "N/A" ? (<b>N/A</b>) : ('N/A')}</label>
                                            {(selectedValues[`${statement.id_statements}`] === "N/A" || isNaN(selectedValues[`${statement.id_statements}`])) &&
                                                selectedValues[`${statement.id_statements}`] !== "" &&
                                                selectedValues[`${statement.id_statements}`] !== null &&
                                                selectedValues[`${statement.id_statements}`] !== undefined ? (
                                                <div>
                                                    <p style={{ marginLeft: '2rem' }}>Please explain why you selected this option.</p>
                                                    <textarea
                                                        className="textarea"
                                                        placeholder="200 char. max"
                                                        maxLength={200}
                                                        defaultValue={selectedValues[`${statement.id_statements}`] === 'N/A' ? "" : selectedValues[`${statement.id_statements}`]}
                                                        onChange={(e) => {
                                                            const naValue = e.target.value;
                                                            setSelectedValues(prev => ({
                                                                ...prev,
                                                                [`${statement.id_statements}`]: naValue
                                                            }));
                                                        }}
                                                    ></textarea>
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>)}
                        {dimensionStage === 3 && (() => {
                            const examplesStatement = allDimensions[currentDimension].statements.find(statement => statement.statement_name === 'Provide Examples');

                            if (!examplesStatement) {
                                return null; // No "Provide Examples" statement found
                            }

                            return (
                                <div className="w-100">
                                    <h1 className="dimension-name-small">{allDimensions[currentDimension].dimension_name}</h1>
                                    <p className="dimension-description-small">{allDimensions[currentDimension].dimension_description}</p>
                                    <p className="statement-description">{examplesStatement.statement_description}</p>

                                    <textarea
                                        className="textarea"
                                        placeholder="1000 char. max"
                                        maxLength={1000}
                                        defaultValue={Object.values(selectedValues)[0]}
                                        onChange={(e) => {
                                            const exampleInput = e.target.value;
                                            setSelectedValues(prev => ({
                                                ...prev,
                                                [`${examplesStatement.id_statements}`]: exampleInput
                                            }));
                                        }}
                                    >
                                    </textarea>
                                </div>
                            );
                        })
                        }
                        <div className={`button-container d-flex justify-content-between w-100 ${dimensionStage === 1 ? 'mt-5' : ''}`} style={{ marginRight: '4rem' }}>
                            {currentDimension === 0 && dimensionStage === 1 ? (
                                null // No back button on the first dimension
                            ) : (
                                <button onClick={() => {

                                    if (dimensionStage === 1) {
                                        if (allDimensions[currentDimension - 1].statements.filter(statement => statement.statement_name === 'Provide Examples').length > 0) {

                                            handleDimensionChange(currentDimension - 1);
                                            setDimensionStage(3);


                                        } else {
                                            handleDimensionChange(currentDimension - 1);
                                            setDimensionStage(2);

                                        }
                                    } else if (dimensionStage === 2) {
                                        setDimensionStage(dimensionStage - 1);
                                    } else if (dimensionStage === 3) {
                                        setDimensionStage(dimensionStage - 1);

                                    }
                                }} className="forms-button">Back</button>)
                            }
                            {currentDimension === dimensionsNumber - 1 && dimensionStage === 3 ? (

                                <button onClick={(e) => {

                                    if ((Object.keys(selectedValues).length > 0 && Object.values(selectedValues).every(value => value !== ''))) {

                                        handleAssessmentSubmit(e);

                                    } else {
                                        alert("Please provide an answer before proceeding.");
                                    }

                                }}>Submit Assessment</button>

                            ) : (
                                <button onClick={() => {
                                    if (dimensionStage === 1) {
                                        setDimensionStage(dimensionStage + 1);
                                    } else if (dimensionStage === 2) {
                                        const selectedValuesCount = Object.keys(selectedValues).length;

                                        if (allDimensions[currentDimension].statements.filter(statement => statement.statement_name === 'Provide Examples').length > 0) {
                                            if (
                                                (selectedValuesCount === allDimensions[currentDimension].statements.length - 1 &&
                                                    !Object.values(selectedValues).includes("N/A")) ||
                                                selectedValuesCount === allDimensions[currentDimension].statements.length
                                            ) {
                                                handleStatementAnswerSubmit();
                                                setDimensionStage(dimensionStage + 1);
                                            } else {
                                                alert("Please provide an answer to every statement and write an explanation for N/A options.");
                                            }
                                        } else {
                                            if (selectedValuesCount === allDimensions[currentDimension].statements.length) {
                                                handleStatementAnswerSubmit();
                                                handleDimensionChange(currentDimension + 1);
                                                setDimensionStage(1);
                                            } else {
                                                alert("Please provide an answer to every statement.");
                                            }
                                        }
                                    } else if (dimensionStage === 3) {
                                        if (Object.keys(selectedValues).length > 0 && Object.values(selectedValues).every(value => value !== '')) {
                                            handleStatementAnswerSubmit();
                                            handleDimensionChange(currentDimension + 1);
                                        } else {
                                            alert("Please provide an answer before proceeding.");
                                        }
                                    }
                                }} className="forms-button">Next</button>)}

                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
};


export default AssessmentFive;
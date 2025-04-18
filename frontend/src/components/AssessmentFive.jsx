import { useEffect } from "react";

const AssessmentFive = ({ allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage, selectedValues, setSelectedValues, handleStatementAnswerSubmit, existingAnswers, firstRender }) => {


    useEffect(() => {
        console.log("current", currentDimension, "stage", dimensionStage);
        const currentDimensionStatements = allDimensions[currentDimension]?.statements || [];
        if (dimensionStage === 2) {
            const filteredAnswers = Object.keys(existingAnswers)
                .filter(key => currentDimensionStatements.some(statement =>
                    statement.id_statements.toString() === key && statement.statement_name !== 'Provide Examples'
                ))
                .reduce((obj, key) => {
                    obj[key] = existingAnswers[key];
                    return obj;
                }, {});
            setSelectedValues(filteredAnswers);
        } else if (dimensionStage === 3) {
            const examplesStatement = currentDimensionStatements.find(statement => statement.statement_name === 'Provide Examples');
            if (examplesStatement) {
                const examplesAnswer = { [examplesStatement.id_statements]: existingAnswers[examplesStatement.id_statements] || "" };
                setSelectedValues(examplesAnswer);
            }
        }
    }, [existingAnswers, currentDimension, dimensionStage]);

    return (
        <>
            {allDimensions.length > 0 && (
                <>
                    <div style={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: "8px",
                        height: "0.5rem",
                        width: "100%",
                        margin: "20px 0",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${(currentDimension / dimensionsNumber) * 100}%`,
                            backgroundColor: "#4285F4",
                            height: "100%",
                            borderRadius: "8px",
                            transition: "width 0.3s ease-in-out"
                        }}>
                        </div>
                    </div>
                    {dimensionStage === 1 && (
                        <div>
                            <h1>{allDimensions[currentDimension].dimension_name}</h1>
                            <p>{allDimensions[currentDimension].dimension_description}</p>
                        </div>)}
                    {dimensionStage === 2 && (
                        <div>
                            <h1>{allDimensions[currentDimension].dimension_name}</h1>
                            <p>{allDimensions[currentDimension].dimension_description}</p>
                            {allDimensions[currentDimension].statements.map(statement => {

                                const scaleLabels = statement.scale.scale_labels.split(',').map(label => label.trim());

                                // Skip the "Provide Examples" statement
                                if (statement.statement_name === 'Provide Examples') {
                                    return null;
                                }

                                return (
                                    <div key={statement.id_statements}>
                                        <h4>{statement.statement_name}</h4>
                                        <p>{statement.statement_description}</p>
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
                                                                <label>{label}</label>
                                                                <input
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
                                            type="checkbox"
                                            name={`${statement.id_statements}_na`}
                                            checked={existingAnswers[`${statement.id_statements}`] === "N/A"}
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
                                        <label>N/A</label>
                                        {(selectedValues[`${statement.id_statements}`] === "N/A" || isNaN(selectedValues[`${statement.id_statements}`])) &&
                                            selectedValues[`${statement.id_statements}`] !== "" &&
                                            selectedValues[`${statement.id_statements}`] !== null &&
                                            selectedValues[`${statement.id_statements}`] !== undefined ? (
                                            <div>
                                                <p>Please explain why you selected this option.</p>
                                                <textarea
                                                    placeholder="200 char. max"
                                                    defaultValue={existingAnswers[`${statement.id_statements}`]}
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
                            <div>
                                <h1>{allDimensions[currentDimension].dimension_name}</h1>
                                <p>{allDimensions[currentDimension].dimension_description}</p>
                                <p>{examplesStatement.statement_name}</p>
                                <p>{examplesStatement.statement_description}</p>

                                <textarea
                                    placeholder="1000 char. max"
                                    defaultValue={existingAnswers[`${examplesStatement.id_statements}`]}
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
                    })()}
                    <div>
                        <button onClick={() => {
                            if (dimensionStage === 1) {
                                setDimensionStage(dimensionStage + 1);
                            } else if (dimensionStage === 2) {
                                const selectedValuesCount = Object.keys(selectedValues).length;
                                if (
                                    selectedValuesCount === allDimensions[currentDimension].statements.length - 1 &&
                                    !Object.values(selectedValues).includes("N/A")
                                ) {
                                    handleStatementAnswerSubmit();
                                    setDimensionStage(dimensionStage + 1);
                                } else {
                                    alert("Please provide an answer to every statement and to write an explanation for N/A options.");
                                }
                            } else if (dimensionStage === 3) {
                                if (Object.keys(selectedValues).length > 0) {
                                    handleStatementAnswerSubmit();
                                    handleDimensionChange(currentDimension + 1);
                                } else {
                                    alert("Please provide an answer before proceeding.");
                                }
                            }
                        }}>Next</button>
                    </div>
                </>
            )}
        </>
    );
};

export default AssessmentFive;
const AssessmentFive = ({ allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage, selectedValues, setSelectedValues, exampleInput, setExampleInput }) => {

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
                                                    <label>{label}</label>
                                                    <input
                                                        type="radio"
                                                        name={statement.id_statements}
                                                        value={index + 1}
                                                        onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            setSelectedValues(prev => ({
                                                                ...prev,
                                                                [statement.id_statements]: selectedValue
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
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
                                    type="text"
                                    placeholder="Max 1000 char."
                                    value={exampleInput}
                                    onChange={(e) => setExampleInput(e.target.value)}
                                ></textarea>
                            </div>
                        );
                    })()}
                    <div>
                        <button onClick={() => {
                            if (dimensionStage === 1) {
                                setDimensionStage(dimensionStage + 1);
                            } else if (dimensionStage === 2) {
                                const selectedValuesCount = Object.keys(selectedValues).length;
                                if (selectedValuesCount === allDimensions[currentDimension].statements.length-1) {
                                    setDimensionStage(dimensionStage + 1);
                                } else {
                                    alert("Please provide an answer to every statement before proceeding.");
                                }
                            } else if (dimensionStage === 3) {
                                if (exampleInput !== "") {
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
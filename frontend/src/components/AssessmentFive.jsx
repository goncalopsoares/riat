const AssessmentFive = ({ allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage }) => {

    const getAllScaleLabels = () => {
        return allDimensions.map((dimension) => ({
            dimensionId: dimension.id_dimensions,
            dimensionName: dimension.dimension_name,
            statements: (dimension.statements || []).map((statement) => ({
                statementId: statement.id_statements,
                statementName: statement.statement_name,
                scaleLabels: statement.scale.scale_labels.split(',').map(label => label.trim()),

            }))
        }));
    };

    if (allDimensions.length > 0) {
        console.log(getAllScaleLabels());
    }

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

                                return (
                                    <div key={statement.id_statements}>
                                        <h4>{statement.statement_name}</h4>
                                        <p>{statement.statement_description}</p>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                                            {scaleLabels.map((label, index) => (

                                                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                                    <label>{label}</label>
                                                    <input type="radio" name={statement.id_statements} value={label} />

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>)}
                    <div>
                        <button onClick={() => {
                            dimensionStage < 3
                                ? setDimensionStage(dimensionStage + 1)
                                : handleDimensionChange(currentDimension + 1);
                        }}>Next</button>
                    </div>
                </>
            )}
        </>
    );
};

export default AssessmentFive;
import { useState } from 'react';

const AssessmentFive = ({ loading, allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage, selectedValues, setSelectedValues, handleStatementAnswerSubmit, existingAnswers, handleAssessmentSubmit, statementCounter }) => {

    const [naSelected, setNaSelected] = useState({});
    const [naReason, setNaReason] = useState({});

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
                                <h1 className="dimension-name-small">{currentDimension + 1}. {allDimensions[currentDimension].dimension_name}</h1>
                                <p className="dimension-description-small">{allDimensions[currentDimension].dimension_description}</p>
                                {allDimensions[currentDimension].statements.map(statement => {

                                    statementCounter++;

                                    const scaleLabels = statement.scale.scale_levels > 0
                                        ? statement.scale.scale_labels.split(',').map(label => label.trim())
                                        : [];

                                    return (
                                        <div key={statement.id_statements} className="statement-container">
                                            <h4 className="statement-name"><span className="statement-number">{currentDimension + 1}.{statementCounter}</span> {statement.statement_name}</h4>
                                            <p className="statement-description">{statement.statement_description}</p>



                                            <>
                                                {(selectedValues[`${statement.id_statements}`] === undefined ||
                                                    selectedValues[`${statement.id_statements}`] === null ||
                                                    selectedValues[`${statement.id_statements}`] === "" ||
                                                    !naSelected[statement.id_statements]) && (

                                                        statement.scale.scale_levels > 0 ? (
                                                            <>
                                                                <div className="statemet-radio-buttons-container">
                                                                    {scaleLabels.map((label, index) => (
                                                                        <label key={index} className="statement-radio-buttons">
                                                                            <span className="label-text">{label}</span>
                                                                            <input
                                                                                className="radio-input"
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
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                                <div>
                                                                    <input
                                                                        className="checkbox-input me-3 mt-5"
                                                                        type="checkbox"
                                                                        name={`${statement.id_statements}_na`}
                                                                        checked={naSelected[statement.id_statements] || false}
                                                                        onChange={(e) => {
                                                                            const isChecked = e.target.checked;
                                                                            setNaSelected(prev => ({
                                                                                ...prev,
                                                                                [statement.id_statements]: isChecked
                                                                            }));
                                                                            if (!isChecked) {
                                                                                setNaReason(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: ""
                                                                                }));
                                                                                setSelectedValues(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: null
                                                                                }));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label>
                                                                        {naSelected[statement.id_statements] ? <b>N/A</b> : 'N/A'}
                                                                    </label>

                                                                    {naSelected[statement.id_statements] && (
                                                                        <div>
                                                                            <p style={{ marginLeft: '2rem' }}>
                                                                                Please explain why you selected this option.
                                                                            </p>
                                                                            <textarea
                                                                                className="textarea"
                                                                                placeholder="200 char. max"
                                                                                maxLength={200}
                                                                                value={naReason?.[statement.id_statements] ?? ""}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    console.log("Saving reason for:", statement.id_statements, "->", value);

                                                                                    setNaReason(prev => ({
                                                                                        ...prev,
                                                                                        [statement.id_statements]: value
                                                                                    }));

                                                                                    setSelectedValues(prev => ({
                                                                                        ...prev,
                                                                                        [statement.id_statements]: value
                                                                                    }));
                                                                                }}
                                                                            ></textarea>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>

                                                        ) : (
                                                            <textarea
                                                                className="textarea"
                                                                placeholder="1000 char. max"
                                                                maxLength={1000}
                                                                defaultValue={selectedValues[`${statement.id_statements}`]}
                                                                onChange={(e) => {
                                                                    const selectedValue = e.target.value;
                                                                    setSelectedValues(prev => ({
                                                                        ...prev,
                                                                        [statement.id_statements]: selectedValue
                                                                    }));
                                                                }}
                                                            />
                                                        )
                                                    )}
                                            </>





                                        </div>
                                    );
                                })}
                            </div>)}
                        <div className={`button-container d-flex justify-content-between w-100 ${dimensionStage === 1 ? 'mt-5' : ''}`} style={{ marginRight: '4rem' }}>
                            {currentDimension === 0 && dimensionStage === 1 ? (
                                null // No back button on the first dimension
                            ) : (
                                <button onClick={() => {

                                    if (dimensionStage === 1) {

                                        handleDimensionChange(currentDimension - 1);
                                        setDimensionStage(2);

                                    } else if (dimensionStage === 2) {

                                        setDimensionStage(dimensionStage - 1);
                                    }
                                }

                                } className="forms-button">Back</button>)
                            }
                            {currentDimension === dimensionsNumber - 1 && dimensionStage === 2 ? (

                                <button onClick={(e) => {

                                    if ((Object.keys(selectedValues).length > 0 && Object.values(selectedValues).every(value => value !== ''))) {

                                        handleAssessmentSubmit(e);

                                    } else {
                                        alert("Please provide an answer before proceeding.");
                                    }

                                    className = "forms-button"

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
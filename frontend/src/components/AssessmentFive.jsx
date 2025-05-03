import { useState } from 'react';

const AssessmentFive = ({ loading, allDimensions, dimensionsNumber, currentDimension, handleDimensionChange, dimensionStage, setDimensionStage, selectedValues, setSelectedValues, handleStatementAnswerSubmit, handleAssessmentSubmit, statementCounter, setSubmittingAssessment }) => {

    const [naSelected, setNaSelected] = useState({});
    const [explanation, setExplanation] = useState('');
    const [example, setExample] = useState('');

    return (
        <>
            {allDimensions.length > 0 && loading === false && (
                <div className="global-container">
                    <div className="create-project-container">
                        {dimensionStage === 3 ? (
                            <div className="progress-bar-container"
                            >
                                <div
                                    className="progress-bar"
                                    style={{ width: '100%' }} >
                                </div>
                            </div>)
                            : (
                                <div className="progress-bar-container"
                                >
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${(currentDimension / dimensionsNumber) * 100}%` }} >
                                    </div>
                                </div>)}
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
                                            <p className="statement-description"><em>{statement.statement_description}</em></p>
                                            <>
                                                {

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
                                                                                setNaSelected(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: false
                                                                                }));

                                                                            }}
                                                                        />
                                                                    </label>
                                                                ))}
                                                            </div>

                                                            <div>
                                                                <label>
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
                                                                            if (isChecked) {
                                                                                setSelectedValues(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: ''
                                                                                }));



                                                                            } else {
                                                                                setSelectedValues(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: ''
                                                                                }));


                                                                            }

                                                                        }}
                                                                    />

                                                                    {naSelected[statement.id_statements] ? <b>Prefer not to answer</b> : 'Prefer not to answer'}
                                                                </label>
                                                                {naSelected[statement.id_statements] || typeof (selectedValues[statement.id_statements]) === 'string' ? (
                                                                    <>

                                                                        <p>Explain why you chose this option</p>
                                                                        <textarea
                                                                            className="textarea"
                                                                            name={`${statement.id_statements}_explanation`}
                                                                            placeholder="200 char. max"
                                                                            maxLength={200}
                                                                            value={explanation || selectedValues[`${statement.id_statements}`] || ''}
                                                                            onChange={(e) => {
                                                                                const newValue = e.target.value;
                                                                                setExplanation(newValue);
                                                                            }}
                                                                            onBlur={() => {

                                                                                setSelectedValues(prev => ({
                                                                                    ...prev,
                                                                                    [statement.id_statements]: explanation
                                                                                }));
                                                                                setExplanation('');

                                                                            }}
                                                                        />

                                                                    </>
                                                                ) : null
                                                                }

                                                            </div>
                                                        </>

                                                    ) : (
                                                        <textarea
                                                            className="textarea"
                                                            placeholder="1000 char. max"
                                                            maxLength={1000}
                                                            value={example || selectedValues[`${statement.id_statements}`] || ''}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setExample(newValue);
                                                            }}
                                                            onBlur={() => {

                                                                setSelectedValues(prev => ({
                                                                    ...prev,
                                                                    [statement.id_statements]: example
                                                                }));
                                                                setExample('');

                                                            }}
                                                        />
                                                    )
                                                }
                                            </>

                                        </div>
                                    );
                                })}
                            </div>)}
                        {dimensionStage === 3 && (
                            <div>
                                <button onClick={(e) => {



                                    handleAssessmentSubmit(e);


                                    <p>Generating your results, please wait a moment.</p>;
                                }


                                } className="forms-button">Submit Assessment</button>
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

                                <button onClick={
                                    () => {

                                        const selectedValuesCount = Object.keys(selectedValues).length;


                                        if (
                                            (selectedValuesCount === allDimensions[currentDimension].statements.length &&
                                                !Object.values(selectedValues).includes(''))
                                        ) {
                                            const handleSubmit = async () => {
                                                await handleStatementAnswerSubmit(); // Espera
                                                setSubmittingAssessment(true);
                                                setDimensionStage(3); // Só aqui!
                                            };
                                            handleSubmit();
                                            
                                        } else {
                                            alert("Please provide an answer to every statement and write an explanation for 'Prefer not to answer' options.");
                                        }


                                    }} className="forms-button">Next</button>




                            ) : (
                                <button onClick={
                                    () => {
                                        if (dimensionStage === 1) {
                                            setDimensionStage(dimensionStage + 1);
                                        } else if (dimensionStage === 2) {
                                            const selectedValuesCount = Object.keys(selectedValues).length;


                                            if (
                                                (selectedValuesCount === allDimensions[currentDimension].statements.length &&
                                                    !Object.values(selectedValues).includes(''))
                                            ) {
                                                handleStatementAnswerSubmit();
                                                handleDimensionChange(currentDimension + 1);
                                                setDimensionStage(1);
                                            } else {
                                                alert("Please provide an answer to every statement and write an explanation for 'Prefer not to answer' options.");
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
const SubDimensions = ({ subDimensionsInfo, selectedValues, setSelectedValues, naSelected, setNaSelected, explanation, setExplanation, example, setExample, currentDimension }) => {

    let statementCounter = 0;
    let currentSubDimension = 0;

    return (
        <>
            {subDimensionsInfo.map((subDimension, subDimensionIndex) => {
                statementCounter = 0;
                return (
                    <div key={subDimension.id} className="sub-dimension-container">
                        <h2 className="sub-dimension-name">
                            {currentDimension + 1}.{subDimensionIndex + 2}. {subDimension.dimension_name}
                        </h2>
                        <p className="sub-dimension-description">{subDimension.dimension_description}</p>

                        {subDimension.statements?.map((statement, statementIndex) => {
                            currentSubDimension++;
                            statementCounter++;
                            return (
                                <div key={statement.id_statements} className="statement-container">
                                    <h4 className="statement-name">
                                        {statement.scale.scale_levels > 0 && (
                                            <span className="statement-number">
                                                {currentDimension + 1}.{subDimensionIndex + 2}.{statementCounter}
                                            {" "}</span>)}
                                        {statement.statement_name}
                                    </h4>
                                    <p className="statement-description">
                                        <em>{statement.statement_description}</em>
                                    </p>

                                    {statement.scale.scale_levels > 0 ? (
                                        <>
                                            <div className="statemet-radio-buttons-container">
                                                {statement.scale.scale_labels.split(",").map((label, index) => (
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
                                                                setSelectedValues((prev) => ({
                                                                    ...prev,
                                                                    [statement.id_statements]: selectedValue,
                                                                }));
                                                                setNaSelected((prev) => ({
                                                                    ...prev,
                                                                    [statement.id_statements]: false,
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
                                                            setNaSelected((prev) => ({
                                                                ...prev,
                                                                [statement.id_statements]: isChecked,
                                                            }));
                                                            setSelectedValues((prev) => ({
                                                                ...prev,
                                                                [statement.id_statements]: "",
                                                            }));
                                                        }}
                                                    />
                                                    {naSelected[statement.id_statements] ? (
                                                        <b>Prefer not to answer</b>
                                                    ) : (
                                                        "Prefer not to answer"
                                                    )}
                                                </label>
                                                {naSelected[statement.id_statements] ||
                                                    typeof selectedValues[statement.id_statements] === "string" ? (
                                                    <>
                                                        <p>Explain why you chose this option</p>
                                                        <textarea
                                                            className="textarea"
                                                            name={`${statement.id_statements}_explanation`}
                                                            placeholder="200 char. max"
                                                            maxLength={200}
                                                            value={explanation || selectedValues[`${statement.id_statements}`] || ""}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setExplanation(newValue);
                                                            }}
                                                            onBlur={() => {
                                                                setSelectedValues((prev) => ({
                                                                    ...prev,
                                                                    [statement.id_statements]: explanation,
                                                                }));
                                                                setExplanation("");
                                                            }}
                                                        />
                                                    </>
                                                ) : null}
                                            </div>
                                        </>
                                    ) : (
                                        <textarea
                                            className="textarea"
                                            placeholder="1000 char. max"
                                            maxLength={1000}
                                            value={example || selectedValues[`${statement.id_statements}`] || ""}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setExample(newValue);
                                            }}
                                            onBlur={() => {
                                                setSelectedValues((prev) => ({
                                                    ...prev,
                                                    [statement.id_statements]: example,
                                                }));
                                                setExample("");
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
};

export default SubDimensions;

import { useState } from "react";
import { useProject } from "../contexts/ProjectContext";

const SelectPhase = () => {

    const { setProjectPhase } = useProject();

    setProjectPhase(1); // Default value

    const [selectedValue, setSelectedValue] = useState(1);

    const handleChange = (e) => {
        const phase = Number(e.target.value);
        setSelectedValue(phase);
        setProjectPhase(phase);
    };

    return (
        <div>
            <h1>What phase is your project in?</h1>
            <p>This will help us tailor the questions to your current needs.</p>

            <div>
                <input
                    type="radio"
                    id="option1"
                    value="1"
                    checked={selectedValue === 1}
                    onChange={handleChange}
                />
                <label htmlFor="option1">
                    Phase 1 - At the beginning of the project planning while defining the scope and engaging the project team
                </label>
            </div>

            <div>
                <input
                    type="radio"
                    id="option2"
                    value="2"
                    checked={selectedValue === 2}
                    onChange={handleChange}
                />
                <label htmlFor="option2">
                    Phase 2 - During project development (with at least 25% of project activities executed, after prototyping, ...)
                </label>
            </div>

            <div>
                <input
                    type="radio"
                    id="option3"
                    value="3"
                    checked={selectedValue === 3}
                    onChange={handleChange}
                />
                <label htmlFor="option3">
                    Phase 3 - At the end of the project, before launching the project results
                </label>
            </div>
        </div>
    );
};

export default SelectPhase;
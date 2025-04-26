import { useProject } from "../contexts/ProjectContext";

const SelectPhase = () => {

    const { projectPhase, setProjectPhase } = useProject();

    console.log("Project phase:", projectPhase);

    return (
        <div>
            <h1>What phase is your project in?</h1>
            <p>This will help us tailor the questions to your current needs.</p>

            <div>
                <input
                    disabled={parseInt(projectPhase) >= 1}
                    type="radio"
                    name="phase"
                    id="option1"
                    value="1"
                    checked={projectPhase === "1"}
                    onChange={(e) => setProjectPhase(e.target.value)}
                />
                <label htmlFor="option1">
                    Phase 1 - At the beginning of the project planning while defining the scope and engaging the project team
                </label>
            </div>

            <div>
                <input
                    disabled={parseInt(projectPhase) >= 2}
                    type="radio"
                    name="phase"
                    id="option2"
                    value="2"
                    checked={projectPhase === "2"}
                    onChange={(e) => setProjectPhase(e.target.value)}
                />
                <label htmlFor="option2">
                    Phase 2 - During project development (with at least 25% of project activities executed, after prototyping, ...)
                </label>
            </div>

            <div>
                <input
                    disabled={parseInt(projectPhase) >= 3}
                    type="radio"
                    name="phase"
                    id="option3"
                    value="3"
                    checked={projectPhase === "3"}
                    onChange={(e) => setProjectPhase(e.target.value)}
                />
                <label htmlFor="option3">
                    Phase 3 - At the end of the project, before launching the project results
                </label>
            </div>
        </div>
    );
};

export default SelectPhase;
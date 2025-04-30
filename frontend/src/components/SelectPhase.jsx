import { useProject } from "../contexts/ProjectContext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const SelectPhase = () => {

    const { projectPhase, setProjectPhase } = useProject();

    return (
        <div className="global-container">
            <div className="create-project-container">
                <h1>What phase is your project in?</h1>
                <p>This will help us tailor the questions to your current needs.</p>

                <p className="helper-text">
                    <HelpOutlineIcon /> If your project is at phase 1, just click next.
                </p>

                <div className="radio-group">
                    <label
                        htmlFor="option1"
                        className={`radio-label border border-1 py-4 px-3 rounded-2 my-2 ${projectPhase === "1" ? "" : "bg-light "
                            }`}
                        style={projectPhase === "1" ? { backgroundColor: "#64c8eb" } : {}}
                    >
                        <input
                            className="radio-input"
                            disabled={parseInt(projectPhase) >= 1}
                            type="radio"
                            name="phase"
                            id="option1"
                            value="1"
                            checked={projectPhase === "1"}
                            onChange={(e) => setProjectPhase(e.target.value)}
                        />
                        <b className="ms-3">Phase 1</b> - At the beginning of the project planning while defining the scope and engaging the project team
                    </label>
                    <label
                        htmlFor="option2"
                        className={`radio-label border border-1 py-4 px-3 rounded-2 my-2 ${projectPhase === "2" ? "" : "bg-light "
                            }`}
                        style={projectPhase === "2" ? { backgroundColor: "#64c8eb" } : {}}
                    >
                        <input
                            className="radio-input"
                            disabled={parseInt(projectPhase) >= 2}
                            type="radio"
                            name="phase"
                            id="option2"
                            value="2"
                            checked={projectPhase === "2"}
                            onChange={(e) => setProjectPhase(e.target.value)}
                        />
                        <b className="ms-3">Phase 2</b> - During project development (with at least 25% of project activities executed, after prototyping, ...)
                    </label>
                    <label
                        htmlFor="option3"
                        className={`radio-label  border border-1 py-4 px-3 rounded-2 my-2 ${projectPhase === "3" ? "" : "bg-light"
                            }`}
                        style={projectPhase === "3" ? { backgroundColor: "#64c8eb" } : {}}
                    >
                        <input
                            className="radio-input"
                            disabled={parseInt(projectPhase) >= 3}
                            type="radio"
                            name="phase"
                            id="option3"
                            value="3"
                            checked={projectPhase === "3"}
                            onChange={(e) => setProjectPhase(e.target.value)}
                        />
                        <b className="ms-3">Phase 3</b> - At the end of the project, before launching the project results
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SelectPhase;
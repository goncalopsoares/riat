import { useProject } from "../contexts/ProjectContext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "../styles/forms.css";

const CreateProject = () => {
  const {
    projectName,
    setProjectName,
    projectValueChain,
    setProjectValueChain,
    projectTrl,
    setProjectTrl,
    projectMrl,
    setProjectMrl,
    projectSrl,
    setProjectSrl,
    userRole,
    setUserRole,
  } = useProject();

  return (
    <div className="global-container">
      <div className="create-project-container me-4">
        <h1 className="create-project-title">
          Responsible Innovation Assessment
        </h1>
        <h4 className="create-project-subtitle mb-4">
          Identification of your project
        </h4>
        <div className="mb-3 w-100">
          <label className="form-label">Project name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Insert the name of the project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="mb-3 w-100">
          <label className="form-label">Project Role</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                className="radio-input my-3"
                type="radio"
                name="role"
                value="Project Manager"
                checked={userRole === "Project Manager"}
                onChange={(e) => setUserRole(e.target.value)}
              />
              Project Manager
            </label>
          </div>
          <div className="w-100">
            <label className="radio-label">
              <input
                className="radio-input"
                type="radio"
                name="role"
                value="Other"
                checked={userRole === "Other"}
                onChange={(e) => setUserRole(e.target.value)}
              />
              Other
            </label>
          </div>
        </div>
        <div className="w-100 mb-3">
          <label className="form-label">Value Chain</label>
          <p className="helper-text">
            <HelpOutlineIcon /> Choose one of the following answers
          </p>
          <div className="radio-group">
            <label className="radio-label">
              <input
                className="radio-input"
                type="radio"
                name="value-chain"
                value="Food, Water and Nutrients"
                checked={projectValueChain === "Food, Water and Nutrients"}
                onChange={(e) => setProjectValueChain(e.target.value)}
              />
              Food, Water and Nutrients
            </label>
            <label className="radio-label">
              <input
                className="radio-input"
                type="radio"
                name="value-chain"
                value="Plastics and Packaging"
                checked={projectValueChain === "Plastics and Packaging"}
                onChange={(e) => setProjectValueChain(e.target.value)}
              />
              Plastics and Packaging
            </label>
            <label className="radio-label">
              <input
                className="radio-input"
                type="radio"
                name="value-chain"
                value="Textiles"
                checked={projectValueChain === "Textiles"}
                onChange={(e) => setProjectValueChain(e.target.value)}
              />
              Textiles
            </label>
          </div>
        </div>
        <div className="w-100 mb-3">
          <p className="section-description">
            Technology Readiness Level (TRL), Manufacturing Readiness Level (MRL),
            and Service Readiness Level (SRL) are indices used to determine the
            maturity of a technology or product. They are ranged between 1-9.
          </p>
          <div className="w-100 mb-3">
            <label className="form-label">
              Indicate the current TRL of your project
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="TRL (1-9)"
              value={projectTrl}
              onChange={(e) => setProjectTrl(e.target.value)}
            />
          </div>
          <div className="w-100 mb-3">
            <label className="form-label">
              Indicate the current MRL of your project
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="MRL (1-9)"
              value={projectMrl}
              onChange={(e) => setProjectMrl(e.target.value)}
            />
          </div>
          <div className="w-100 mb-3">
            <label className="form-label">
              Indicate the current SRL of your project
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="SRL (1-9)"
              value={projectSrl}
              onChange={(e) => setProjectSrl(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default CreateProject;

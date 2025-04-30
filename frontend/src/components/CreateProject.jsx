import { useProject } from "../contexts/ProjectContext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "../styles/forms.css";

const CreateProject = () => {
  const {
    projectName,
    setProjectName,
    projectOrrganization,
    setProjectOrganization,
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
    userFunction,
    setUserFunction,
  } = useProject();

  return (
    <div className="global-container">
      <div className="create-project-container">
        <h1 className="create-project-title">
          Responsible Innovation Assessment
        </h1>
        <h4 className="create-project-subtitle">
          Identification of your venture
        </h4>

        <label className="form-label">Project name</label>
        <input
          className="form-input"
          type="text"
          placeholder="Insert the name of the project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <label className="form-label">Venture</label>
        <input
          className="form-input"
          type="text"
          placeholder="Insert the name of the organization"
          value={projectOrrganization}
          onChange={(e) => setProjectOrganization(e.target.value)}
        />

        <label className="form-label">Project Role</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              className="radio-input"
              type="radio"
              name="role"
              value="Project Manager"
              checked={userRole === "Project Manager"}
              onChange={(e) => setUserRole(e.target.value)}
            />
            Project Manager
          </label>
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

        <label className="form-label">Function</label>
        <input
          className="form-input"
          type="text"
          placeholder="Function (in the organization) of the responsible for the Assessment"
          value={userFunction}
          onChange={(e) => setUserFunction(e.target.value)}
        />

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

        <p className="section-description">
          Technology Readiness Level (TRL), Manufacturing Readiness Level (MRL),
          and Service Readiness Level (SRL) are indices used to determine the
          maturity of a technology or product. They are ranged between 1-9.
        </p>

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
  );
};

export default CreateProject;

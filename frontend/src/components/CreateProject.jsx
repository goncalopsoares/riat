import { useProject } from "../contexts/ProjectContext";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import "../styles/forms.css";

const CreateProject = () => {
  const {
    projectName,
    setProjectName,
    projectAcronym,
    setProjectAcronym,
    projectOrrganization,
    setProjectOrganization,
    projectOwnerName,
    setProjectOwnerName,
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

  //tooltips
  const tooltipTextsSrl = [
    "Identification of the generic societal need and associated readiness aspects",
    "Formulation of proposed solution concept and potential impacts; appraisal of societal readiness issues; identification of relevant stakeholders for the development of the solution",
    "Initial sharing of the proposed solution with relevant stakeholders (e.g. through visual mock-ups): a limited group of the society knows the solution or similar initiatives",
    "Solution validated through pilot testing in controlled environments to substantiate proposed impacts and societal readiness: a limited group of the society tests the solution or similar initiatives",
    "Solution validated through pilot testing in real or realistic environments and by relevant stakeholders: the society knows the solution or similar initiatives but is not aware of their benefits",
    "Solution demonstrated in real world environments and in cooperation with relevant stakeholders to gain feedback on potential impacts: the society knows the solution or similar initiatives and awareness of their benefits increases",
    "Refinement of the solution and, if needed, retesting in real world environments with relevant stakeholders: the society is completely aware of the solution's benefits, a part of the society starts to adopt similar solutions",
    "Targeted solution, as well as a plan for societal adaptation, complete and qualified; society is ready to adopt the solution and have used similar solutions on the market",
    "Actual solution proven in relevant societal environments after launch on the market; the society is using the solution available on the market"
  ];

  const tooltipTextsTrl = [
    "Basic principles observed",
    "Technology concept formulated",
    "Experimental proof of concept",
    "Technology validated in lab",
    "Technology validated in relevant environment (industrially relevant environment in the case of key enabling technologies)",
    "Technology demonstrated in relevant environment (industrially relevant environment in the case of key enabling technologies)",
    "System prototype demonstration in operational environment",
    "System complete and qualified",
    "Actual system proven in operational environment (competitive manufacturing in the case of key enabling technologies; or in space)"
  ];

  const tooltipTextsMrl = [
    "Basic research - An acceptance that viable improvements can be made",
    "Needs formulation - Ability to highlight where the improvement can be made",
    "Needs validation - Being able to identify what the system should do",
    "Small Scale Stakeholder Campaign - Putting numbers on what is expected in terms of a solution, financially and technically",
    "Large Scale Early Adopter Campaign - Ability to define how the system should operate and integrate",
    "Proof of Traction - Identify on component level what the system should be comprised of",
    "Proof of satisfaction - An understanding on who should be planning, designing and implementing the solution",
    "Proof of Scalability - Having contact with the people, internally or externally, who will design and create the solution",
    "Proof of Stability - Solution is being created to solve a defined problem"
  ];

  const [showDefinitionTrl, setShowDefinitionTrl] = useState(false);
  const [showDefinitionMrl, setShowDefinitionMrl] = useState(false);
  const [showDefinitionSrl, setShowDefinitionSrl] = useState(false);

  return (
    <div className="global-container">
      <div className="create-project-container">
        <h1 className="create-project-title">
          Responsible Innovation Assessment
        </h1>
        <h4 className="create-project-subtitle mb-4">
          Identification of your project
        </h4>

        <div className="mb-3 w-100">
          <label className="form-label">Extended project name <em>(300 characters max)</em></label>
          <textarea
            className="form-input"
            placeholder="Insert the name of the project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            rows={1}
            maxLength={300}
            style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", resize: "vertical" }}
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Project acroynm <em>(25 characters max)</em></label>
          <input
            className="form-input"
            type="text"
            placeholder="Insert the acronym of the project"
            value={projectAcronym}
            onChange={(e) => setProjectAcronym(e.target.value)}
            minLength={2}
            maxLength={25}
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Organization <em>(100 characters max)</em></label>
          <input
            className="form-input"
            type="text"
            placeholder="Insert the name of the organization"
            value={projectOrrganization}
            onChange={(e) => setProjectOrganization(e.target.value)}
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Person responsible for the project <em>(100 characters max)</em></label>
          <input
            className="form-input"
            type="text"
            placeholder="Insert the name of the person responsible for the project"
            value={projectOwnerName}
            onChange={(e) => setProjectOwnerName(e.target.value)}
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Role in the project</label>
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
                value="Team Member"
                checked={userRole === "Team Member"}
                onChange={(e) => setUserRole(e.target.value)}
              />
              Team Member
            </label>
          </div>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Function in the organization <em>(45 characters max)</em></label>
          <input
            className="form-input"
            type="text"
            placeholder="Function (in the organization) of the responsible for the Assessment"
            value={userFunction}
            onChange={(e) => setUserFunction(e.target.value)}
            maxLength={45}
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Value Chain</label>
          <p className="helper-text my-2">
            <HelpOutlineIcon style={{ color: '#002d46' }} /> Choose one of the following answers
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

        <div className="mt-3 w-100">
          <p className="section-description">
            Technology Readiness Level (TRL), Market Readiness Level (MRL),
            and Societal Readiness Level (SRL) are indices used to determine the
            maturity of a technology or product. They are ranged between 1-9.
          </p>
          <p className="helper-text my-2">
            <HelpOutlineIcon style={{ color: '#002d46' }} /> Hover on each level to read more info
          </p>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">
            <button
              className="btn btn-link text-black p-0 text-decoration-none"
              onClick={() => setShowDefinitionTrl(!showDefinitionTrl)}
              type="button"
            >
              Indicate the current TRL of your project
              {showDefinitionTrl ? (
                <ArrowDropUpIcon style={{ fontSize: '2rem' }} />
              ) : (
                <ArrowDropDownIcon style={{ fontSize: '2rem' }} />
              )}
            </button>
          </label>
          {showDefinitionTrl && (
            <div className="d-flex align-items-center mb-2">
              <p className="mb-3" style={{ fontSize: '0.9rem' }}><em>Technology Readiness Levels are a type of measurement system used to assess the maturity level of a particular technology. Each technology project is evaluated against the parameters for each technology level and is then assigned a TRL rating based on the projects progress.</em></p>
            </div>
          )}
          <div className="d-flex flex-row gap-5">
            {[...Array(9)].map((_, i) => (
              <div className="tooltip-wrapper" key={`trl-${i + 1}`}>
                <label className="radio-label">
                  <input
                    className="radio-input"
                    type="radio"
                    name="trl"
                    value={i + 1}
                    checked={projectTrl === String(i + 1)}
                    onChange={(e) => setProjectTrl(e.target.value)}
                  />
                  {i + 1}
                  <span className="tooltip-text">{tooltipTextsTrl[i]}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">
            <button
              className="btn btn-link text-black p-0 text-decoration-none"
              onClick={() => setShowDefinitionMrl(!showDefinitionMrl)}
              type="button"
            >
              Indicate the current MRL of your project
              {showDefinitionMrl ? (
                <ArrowDropUpIcon style={{ fontSize: '2rem' }} />
              ) : (
                <ArrowDropDownIcon style={{ fontSize: '2rem' }} />
              )}
            </button>
          </label>
          {showDefinitionMrl && (
            <div className="d-flex align-items-center mb-2">
              <p className="mb-3" style={{ fontSize: '0.9rem' }}><em>Market Readiness Level refers to how ready your product or service is to take to market as a commercial offering for a group of customers.</em></p>
            </div>
          )}
          <div className="d-flex flex-row gap-5">
            {[...Array(9)].map((_, i) => (
              <div className="tooltip-wrapper" key={`mrl-${i + 1}`}>
                <label className="radio-label">
                  <input
                    className="radio-input"
                    type="radio"
                    name="mrl"
                    value={i + 1}
                    checked={projectMrl === String(i + 1)}
                    onChange={(e) => setProjectMrl(e.target.value)}
                  />
                  {i + 1}
                  <span className="tooltip-text">{tooltipTextsMrl[i]}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">
            <button
              className="btn btn-link text-black p-0 text-decoration-none"
              onClick={() => setShowDefinitionSrl(!showDefinitionSrl)}
              type="button"
            >
              Indicate the current SRL of your project
              {showDefinitionSrl ? (
                <ArrowDropUpIcon style={{ fontSize: '2rem' }} />
              ) : (
                <ArrowDropDownIcon style={{ fontSize: '2rem' }} />
              )}
            </button>
          </label>
          {showDefinitionSrl && (
            <div className="d-flex align-items-center mb-2">
              <p className="mb-3" style={{ fontSize: '0.9rem' }}><em>Societal Readiness Level is a way of assessing the level of societal adaptation of, for instance, a particular social project, a technology, a product, a process, an intervention, or an innovation (whether social or technical) to be integrated into society.</em></p>
            </div>
          )}
          <div className="d-flex flex-row gap-5">
            {[...Array(9)].map((_, i) => (
              <div className="tooltip-wrapper" key={`srl-${i + 1}`}>
                <label className="radio-label">
                  <input
                    className="radio-input"
                    type="radio"
                    name="srl"
                    value={i + 1}
                    checked={projectSrl === String(i + 1)}
                    onChange={(e) => setProjectSrl(e.target.value)}
                  />
                  {i + 1}
                  <span className="tooltip-text">{tooltipTextsSrl[i]}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

export default CreateProject;

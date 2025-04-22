import { useProject } from "../contexts/ProjectContext";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CreateProject = () => {

    const { projectName, setProjectName, projectOrrganization, setProjectOrganization, projectValueChain, setProjectValueChain, projectTrl, setProjectTrl, projectMrl, setProjectMrl, projectSrl, setProjectSrl, userRole, setUserRole, userFunction, setUserFunction } = useProject();

    return (
        <div>
            <h1>Responsible Innovation Assessment</h1>
            <h4>Identification of your venture</h4>
            <p>Project name</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the name of the project'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            >
            </input>
            <p>Venture</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the name of the organization'
                value={projectOrrganization}
                onChange={(e) => setProjectOrganization(e.target.value)}
            >
            </input>
            <p>Project role</p>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="Project Manager"
                    checked={userRole === "Project Manager"}
                    onChange={(e) => setUserRole(e.target.value)}
                />
                Project Manager
            </label>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="Other"
                    checked={userRole === "Other"}
                    onChange={(e) => setUserRole(e.target.value)}
                />
                Other
            </label>
            <p>Function</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the function of the user'
                value={userFunction}
                onChange={(e) => setUserFunction(e.target.value)}
            >
            </input>
            <p>Value Chain</p>
            <p><HelpOutlineIcon />Choose one of the following answers</p>
            <label>
                <input
                    type="radio"
                    name="value-chain"
                    value="Food, Water and Nutrients"
                    checked={projectValueChain === "Food, Water and Nutrients"}
                    onChange={(e) => setProjectValueChain(e.target.value)}
                />
                Food, Water and Nutrients
            </label>
            <label>
                <input
                    type="radio"
                    name="value-chain"
                    value="Plastics and Packaging"
                    checked={projectValueChain === "Plastics and Packaging"}
                    onChange={(e) => setProjectValueChain(e.target.value)}
                />
                Plastics and Packaging
            </label>
            <label>
                <input
                    type="radio"
                    name="value-chain"
                    value="Textiles"
                    checked={projectValueChain === "Textiles"}
                    onChange={(e) => setProjectValueChain(e.target.value)}
                />
                Textiles
            </label>
            <p>Technology Readiness Level (TRL), Manufacturing Readiness Level (MRL), and Service Readiness Level (SRL) are indices used to determine the maturity of a technology or product.</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the TRL of the project'
                value={projectTrl}
                onChange={(e) => setProjectTrl(e.target.value)}
            >
            </input>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the MRL of the project'
                value={projectMrl}
                onChange={(e) => setProjectMrl(e.target.value)}
            >
            </input>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the SRL of the project'
                value={projectSrl}
                onChange={(e) => setProjectSrl(e.target.value)}
            >
            </input>
        </div >
    )
}

export default CreateProject;
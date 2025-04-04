import { useProject } from "../contexts/ProjectContext";

const CreateProject = () => {

    const { projectName, setProjectName, projectOrrganization, setProjectOrganization, projectTrl, setProjectTrl, projectMrl, setProjectMrl, projectSrl, setProjectSrl, userRole, setUserRole, userFunction, setUserFunction } = useProject();

    return (
        <div>
            <h1>Create a new project</h1>
            <p>Innovation project name</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the name of the project'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            >
            </input>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the organization responsible for the project'
                value={projectOrrganization}
                onChange={(e) => setProjectOrganization(e.target.value)}
            >
            </input>
            <p>Responsible person for the assessment</p>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the role of the user'
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
            >
            </input>
            <input
                className='login-form-input'
                type='text'
                placeholder='Insert the function of the user'
                value={userFunction}
                onChange={(e) => setUserFunction(e.target.value)}
            >
            </input>
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
        </div>
    )
}

export default CreateProject;
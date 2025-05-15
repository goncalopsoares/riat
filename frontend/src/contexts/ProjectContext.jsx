import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);

    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [projectAcronym, setProjectAcronym] = useState('');
    const [projectOrganization, setProjectOrganization] = useState('');
    const [projectPhase, setProjectPhase] = useState(1);
    const [projectValueChain, setProjectValueChain] = useState('');
    const [projectTrl, setProjectTrl] = useState('');
    const [projectMrl, setProjectMrl] = useState('');
    const [projectSrl, setProjectSrl] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userFunction, setUserFunction] = useState('');

    return (
        <ProjectContext.Provider value={{
            error, setError,
            success, setSuccess,
            loading, setLoading,
            step, setStep,
            projectId, setProjectId,
            projectName, setProjectName,
            projectAcronym, setProjectAcronym,
            projectOrganization, setProjectOrganization,
            projectPhase, setProjectPhase,
            projectValueChain, setProjectValueChain,
            projectTrl, setProjectTrl,
            projectMrl, setProjectMrl,
            projectSrl, setProjectSrl,
            userRole, setUserRole,
            userFunction, setUserFunction
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);

import AssessmentOne from "../components/AssessmentOne"
import AssessmentTwo from "../components/AssessmentTwo";
import AssessmentThree from "../components/AssessmentThree";
import AssessmentFour from "../components/AssessmentFour";
import { useProject } from "../contexts/ProjectContext";
import { useState } from "react";
import api from '../api';

const Assessment = () => {

    const { projectId, setProjectId, step, setStep, projectName, projectOrganization, projectPhase, projectTrl, projectMrl, projectSrl, userRole, userFunction, setError, setSuccess, setLoading } = useProject();

    const [agreement, setAgreement] = useState(false);
    const [instructionsRead, setInstructionsRead] = useState(false);

    /* STEP 1 - INSTRUCTIONS */

    const handleInstructionsRead = (e) => {
        e.preventDefault();

        const isChecked = document.getElementById("instructions").checked;
        setInstructionsRead(isChecked);
        if (isChecked) {
            setStep(2);
        }
    };


    /* STEP 2 - RGPD */

    const handleAgreement = (e) => {
        e.preventDefault();

        const isChecked = document.getElementById("agreement").checked;
        setAgreement(isChecked);
        if (isChecked) {
            setStep(3);
        }
    };

    /* STEP 3 - REGISTER PROJECT */

    const handleProjectSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (projectName === '') {
            setError("Project Name cannot be empty");
            setLoading(false);
            return;
        }

        if (projectOrganization === '') {
            setError("Project Organization cannot be empty");
            setLoading(false);
            return;
        }

        if (projectTrl === '') {
            setError("Project TRL cannot be empty");
            setLoading(false);
            return;
        }

        if (projectMrl === '') {
            setError("Project MRL cannot be empty");
            setLoading(false);
            return;
        }

        if (projectSrl === '') {
            setError("Project SRL cannot be empty");
            setLoading(false);
            return;
        }

        if (userRole === '') {
            setError("User Role cannot be empty");
            setLoading(false);
            return;
        }

        if (userFunction === '') {
            setError("User Function cannot be empty");
            setLoading(false);
            return;
        }

        setError('');

        try {

            const response = await api.post('/api/project/create/', {
                project_name: projectName, project_organization: projectOrganization, project_trl: projectTrl, project_mrl: projectMrl, project_srl: projectSrl, project_phase: 1, metadata: [
                    {
                        users_has_projects_role: userRole,
                        users_has_projects_function: userFunction,
                    }
                ]
            });

            setSuccess('Projeto criado com sucesso');
            console.log(response)
            const projectId = response.data.id_projects;
            setProjectId(projectId);
            setStep(4);

        } catch (error) {
            alert(error);
            console.error(error);

        } finally {
            setLoading(false);
        }

    }

    /* STEP 4 - SELECT PROJECT'S PHASE */

    const handlePhaseUpdate = async (e) => {

        setLoading(true)
        e.preventDefault();

        console.log(projectPhase)

        try {
            await api.patch(`/api/project/update/${projectId}/`, {
                project_phase: projectPhase,
            });

            setSuccess('Fase selecionada com sucesso');
            setStep(5);

        } catch (error) {
            alert(error);
            console.error(error);

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {projectId === null ? (
                <>
                    {step === 1 && (
                        <AssessmentOne handleInstructionsRead={handleInstructionsRead} />
                    )}
                    {step === 2 && (
                        <AssessmentTwo handleAgreement={handleAgreement} />
                    )}
                    {step === 3 && (
                        <AssessmentThree handleProjectSubmit={handleProjectSubmit} />
                    )}
                    {step === 4 && (
                        <AssessmentFour handlePhaseUpdate={handlePhaseUpdate} />
                    )}
                </>
            ) : (null
            )}
        </>
    );


}

export default Assessment;
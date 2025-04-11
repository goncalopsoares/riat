import AssessmentOne from "../components/AssessmentOne"
import AssessmentTwo from "../components/AssessmentTwo";
import AssessmentThree from "../components/AssessmentThree";
import AssessmentFour from "../components/AssessmentFour";
import AssessmentFive from "../components/AssessmentFive";
import { useProject } from "../contexts/ProjectContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';

const Assessment = () => {

    const { projectId, setProjectId, step, setStep, projectName, projectOrganization, projectPhase, projectTrl, projectMrl, projectSrl, userRole, userFunction, setError, setSuccess, setLoading } = useProject();

    const [agreement, setAgreement] = useState(false);
    const [instructionsRead, setInstructionsRead] = useState(false);
    const [surveyId, setSurveyId] = useState('');
    const [allDimensions, setAllDimensions] = useState([]);
    const [dimensionsNumber, setDimensionsNumber] = useState(0);

    const { id } = useParams();


    //GET SUBMISSION DATA

    useEffect(() => {

        if (id !== undefined) {

            const getSubmission = async () => {
                try {
                    const response = await api.get(`/api/submission/${id}/`);
                    console.log(response.data);

                    setSurveyId(response.data.surveys_id_surveys);
                    setStep(5);
                } catch (error) {
                    alert(error);
                    console.error(error);
                }
            }
            getSubmission();
        } else {
            setProjectId(null);
            setStep(1);
        }
    }, [id]);

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


    // STEP 5 - ASSESSMENT | GET DIMENSIONS AND STATEMENTS

    useEffect(() => {

        if (surveyId && surveyId !== undefined) {

            const getDimensionsAndStatements = async () => {

                setLoading(true);

                try {
                    const response = await api.get(`/api/dimension/get/${surveyId}/`);
                    const dimensions = response.data;

                    const dimensionsWithStatements = await Promise.all(
                        dimensions.map(async (dimension) => {
                            const statementsResponse = await api.get(`/api/statement/get/${dimension.id_dimensions}/`);

                            return {
                                ...dimension,
                                statements: statementsResponse.data,
                            };
                        })
                    );

                    setAllDimensions(dimensionsWithStatements);
                    setDimensionsNumber(dimensionsWithStatements.length);
                    console.log(dimensionsWithStatements);
                } catch (error) {
                    alert(error);
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            getDimensionsAndStatements();

        }

    }, [id, surveyId]);



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
                    {step === 5 && id !== null && (
                        <AssessmentFive />
                    )}
                </>
            ) : (null
            )}
        </>
    );


}

export default Assessment;
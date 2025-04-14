import AssessmentOne from "../components/AssessmentOne"
import AssessmentTwo from "../components/AssessmentTwo";
import AssessmentThree from "../components/AssessmentThree";
import AssessmentFour from "../components/AssessmentFour";
import AssessmentFive from "../components/AssessmentFive";
import { useProject } from "../contexts/ProjectContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api';

const Assessment = () => {

    const { projectId, setProjectId, step, setStep, projectName, projectOrganization, projectPhase, projectTrl, projectMrl, projectSrl, userRole, userFunction, setError, setSuccess, setLoading } = useProject();


    const [surveyId, setSurveyId] = useState('');

    // STEP 1 & 2
    const [agreement, setAgreement] = useState(false);
    const [instructionsRead, setInstructionsRead] = useState(false);

    // STEP 5
    const [allDimensions, setAllDimensions] = useState([]);
    const [dimensionsNumber, setDimensionsNumber] = useState(0);
    const [currentDimension, setCurrentDimension] = useState(0);
    const [dimensionStage, setDimensionStage] = useState(1);
    const [isAssessmentReady, setIsAssessmentReady] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [exampleInput, setExampleInput] = useState('');

    const { id } = useParams();

    const navigate = useNavigate();

    console.log(selectedValues);

    //GET SUBMISSION DATA

    useEffect(() => {

        if (id !== undefined) {

            const getSubmission = async () => {
                try {
                    const response = await api.get(`/api/submission/${id}/`);

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

        try {
            await api.patch(`/api/project/update/${projectId}/`, {
                project_phase: projectPhase,
            });

            setSuccess('Fase selecionada com sucesso');
            setStep(5);
            navigate('/projects/');

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

    useEffect(() => {
        if (step === 5 && surveyId && allDimensions.length > 0) {
            setIsAssessmentReady(true);
        }

    }, [step, surveyId, allDimensions]);

    const handleDimensionChange = (index) => {
        if (index >= 0 && index < allDimensions.length) {
            setCurrentDimension(index);
            setDimensionStage(1);
        }
    }

    return (
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
            {isAssessmentReady && (
                <AssessmentFive allDimensions={allDimensions} dimensionsNumber={dimensionsNumber} currentDimension={currentDimension} handleDimensionChange={handleDimensionChange} dimensionStage={dimensionStage} setDimensionStage={setDimensionStage} selectedValues={selectedValues} setSelectedValues={setSelectedValues} exampleInput={exampleInput} setExampleInput={setExampleInput} />
            )}
        </>
    );

}

export default Assessment;
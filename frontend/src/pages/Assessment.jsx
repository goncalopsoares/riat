import AssessmentOne from "../components/AssessmentOne"
import AssessmentTwo from "../components/AssessmentTwo";
import AssessmentThree from "../components/AssessmentThree";
import AssessmentFour from "../components/AssessmentFour";
import AssessmentFive from "../components/AssessmentFive";
import { useProject } from "../contexts/ProjectContext";
import { useEffect, useState, useRef, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api';

const Assessment = () => {

    const { projectId, setProjectId, step, setStep, projectName, projectOrganization, projectPhase, projectTrl, projectMrl, projectSrl, userRole, userFunction, setError, setSuccess, setLoading, loading } = useProject();

    const [surveyId, setSurveyId] = useState('');

    const navigate = useNavigate();

    //GET SUBMISSION ID FROM URL
    const { id } = useParams();

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
    const [existingAnswers, setExistingAnswers] = useState([]);

    const firstRender = useRef(true);


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

        if (projectPhase === 1) {
            setLoading(false);
            setSuccess('Phase selected successfully');
            setStep(5);
            navigate('/projects/');
            return;
        } else {

            try {
                await api.patch(`/api/project/update/${projectId}/`, {
                    project_phase: projectPhase,
                });

                setSuccess('Phase selected successfully');
                setStep(5);
                navigate('/projects/');

            } catch (error) {
                alert(error);
                console.error(error);

            } finally {
                setLoading(false);
            }
        }
    };


    // STEP 5 - ASSESSMENT | GET DIMENSIONS AND STATEMENTS

    useEffect(() => {

        if (surveyId && surveyId !== undefined) {

            const getDimensionsAndStatements = async () => {

                setLoading(true);

                try {
                    const responseAllSurveys = await api.get(`/api/survey/get/`);
                    const allSurveys = responseAllSurveys.data;

                    const responseCurrentSurvey = await api.get(`/api/survey/get/${surveyId}/`);
                    const survey = responseCurrentSurvey.data;

                    const surveyPhase = parseInt(survey[0].survey_name.match(/\d+/)?.[0], 10);

                    // 1. Filter surveys by phase and sort them
                    const surveysToLoad = allSurveys
                        .filter(s => {
                            const match = s.survey_name.match(/\d+/);
                            if (!match) return false;
                            const phase = parseInt(match[0], 10);
                            return phase <= surveyPhase;
                        })
                        .sort((a, b) => {
                            const phaseA = parseInt(a.survey_name.match(/\d+/)?.[0], 10);
                            const phaseB = parseInt(b.survey_name.match(/\d+/)?.[0], 10);
                            return phaseA - phaseB;
                        });

                    // 2. Get dimensions for each survey, first phase first, then second and so on
                    const dimensionResponses = await Promise.all(
                        surveysToLoad.map(s =>
                            api.get(`/api/dimension/get/${s.id_surveys}/`)
                        )
                    );

                    // 3. Get statements for each dimension and sort the dimensions by dimension_order
                    const dimensionsWithStatements = (
                        await Promise.all(
                            dimensionResponses.map(async res => {
                                const dims = res.data.sort((a, b) => a.dimension_order - b.dimension_order);
                                return await Promise.all(
                                    dims.map(async dimension => {
                                        const statementsRes = await api.get(`/api/statement/get/${dimension.id_dimensions}/`);
                                        return {
                                            ...dimension,
                                            statements: statementsRes.data
                                        };
                                    })
                                );
                            })
                        )
                    ).flat(); // 4. Flatten the array of arrays

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

    // STEP 5 - RENDER ASSESSMENT IF READY
    useEffect(() => {
        if (step === 5 && surveyId && allDimensions.length > 0) {
            setIsAssessmentReady(true);
        }

    }, [step, surveyId, allDimensions]);


    // STEP 5 - PROCEED TO NEXT DIMENSION
    const handleDimensionChange = (index) => {
        if (index >= 0 && index < allDimensions.length) {
            setCurrentDimension(index);
            setDimensionStage(1);
        }
    };

    // STEP 5 - REGISTER STATEMENTS ANSWERS
    const handleStatementAnswerSubmit = async () => {

        setLoading(true);

        const requests = Object.entries(selectedValues).map(([key, value]) =>
            api.get(`/api/answer/${id}/${key}/`)
                .then(async () => {

                    if (isNaN(value)) {

                        console.log(`Answer exists for statement ${key}. Creating...`);

                        await api.delete(`/api/answer/${id}/${key}/`);

                        return api.post(`/api/answer/${id}/`, {
                            submissions_id_submissions: id,
                            statements_id_statements: key,
                            value: value,
                        });

                    } else {


                        return api.patch(`/api/answer/${id}/${key}/`, {
                            submissions_id_submissions: id,
                            statements_id_statements: key,
                            value: value,
                        });
                    }
                })

                .catch((error) => {

                    console.log(`Answer does not exist for statement ${key}. Creating...`);

                    if (error.response && error.response.status === 404) {
                        return api.post(`/api/answer/${id}/`, {
                            submissions_id_submissions: id,
                            statements_id_statements: key,
                            value: value,
                        });
                    } else {
                        console.error(`Erro ao obter a resposta para a statement ${key}:`, error);
                        throw error;
                    }
                })
        );

        try {
            await Promise.all(requests);
            setSelectedValues({});
        } catch (error) {
            alert('Error submitting answers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // STEP 5 - GET EXISTING ANSWERS
    useEffect(() => {
        if (id !== undefined) {
            const getExistingAnswers = async () => {
                try {
                    const response = await api.get(`/api/answer/${id}/`);
                    const existingAnswers = response.data.reduce((acc, answer) => {
                        acc[answer.statements_id_statements] = {
                            value: answer.value,
                            answer_creation_time: answer.answer_creation_time
                        };
                        return acc;
                    }, {});
                    setExistingAnswers(existingAnswers);
                } catch (error) {
                    console.error('Error fetching existing answers:', error);
                } finally {
                    setLoading(false);
                }
            };
            getExistingAnswers();
        }
    }, [id, currentDimension]);


    // STEP 5 - SET CURRENT DIMENSION BASED ON LAST ANSWERED STATEMENT
    useEffect(() => {
        if (existingAnswers.length === 0 || allDimensions.length === 0 || firstRender.current === false) return;

        const lastAnsweredStatementId = Object.keys(existingAnswers)
            .map(key => ({
                id: Number(key),
                creationTime: existingAnswers[key].answer_creation_time
            }))
            .sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime))[0]?.id;

        const dimensionWithLastAnswer = allDimensions.find(dimension =>
            dimension.statements.some(statement => statement.id_statements === lastAnsweredStatementId)
        );

        if (dimensionWithLastAnswer) {
            const dimensionIndex = allDimensions.indexOf(dimensionWithLastAnswer);
            setCurrentDimension(dimensionIndex);
        }

        firstRender.current = false; // Ensure this effect runs only once after existingAnswers is set

    }, [existingAnswers, allDimensions]);


    // STEP 5 - SET SELECTED VALUES BASED ON EXISTING ANSWERS
    useEffect(() => {

        if (existingAnswers.length === 0) return;

        const currentDimensionStatements = allDimensions[currentDimension]?.statements || [];

        if (dimensionStage === 2) {
            const filteredAnswers = Object.keys(existingAnswers)
                .filter(key => currentDimensionStatements.some(statement =>
                    statement.id_statements.toString() === key && statement.statement_name !== 'Provide Examples'
                ))
                .reduce((obj, key) => {
                    obj[key] = existingAnswers[key].value; // Extract only the value
                    return obj;
                }, {});
            if (Object.keys(filteredAnswers).length !== 0 && loading === false) {
                setSelectedValues(filteredAnswers);
            }

        } else if (dimensionStage === 3) {

            const examplesStatement = currentDimensionStatements.find(statement => statement.statement_name === 'Provide Examples');
            if (examplesStatement) {

                const examplesAnswer = {
                    [examplesStatement.id_statements]:
                        existingAnswers[examplesStatement.id_statements]?.value || ""
                };

                if (examplesAnswer !== "" && loading === false) {

                    setSelectedValues(examplesAnswer);

                }
            }
        }

    }, [currentDimension, dimensionStage, loading]);

    useEffect(() => {
        console.log("existingAnswers", existingAnswers);
    }
        , [existingAnswers]);

    // STEP 5 - SUBMIT ASSESSMENT

    const handleAssessmentSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {
            await handleStatementAnswerSubmit();

            await api.patch(`/api/submission/${id}/`, {
                submission_state: 2,
            });

            const finalScore = Object.values(existingAnswers).reduce((sum, object) => {
                const value = object.value;
                return typeof value === 'number' ? sum + value : sum;
            }, 0);

            const totalStatements = allDimensions.flatMap(dimension => dimension.statements).filter(
                (statement) => statement.statement_name !== 'Provide Examples'
            ).length;

            const ponderatedScore = ((finalScore) / (totalStatements)).toFixed(2);

            const pointsByDimension = () => {
                return allDimensions.map(dimension => {
                    const totalPointsByDimension = dimension.statements.reduce((sum, statement) => {
                        const value = existingAnswers[statement.id_statements]?.value;
                        return typeof value === 'number' ? sum + value : sum;
                    }, 0);
                    return { dimensionId: dimension.id_dimensions, totalPointsByDimension };
                });
            };

            const dimensionsPoints = pointsByDimension();

            await api.post(`api/report/${id}/`, {
                submissions_id_submissions: id,
                final_score: finalScore,
                ponderated_score: ponderatedScore,
                surveys_id_surveys: surveyId,
                dimension_scores: dimensionsPoints,
            });

            const reportResponse = await api.get(`/api/report/${id}/`);
            const reportId = reportResponse.data.id_reports;

            navigate(`/report/${reportId}`);

        } catch (error) {
            alert(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                <AssessmentFive allDimensions={allDimensions} dimensionsNumber={dimensionsNumber} currentDimension={currentDimension} handleDimensionChange={handleDimensionChange} dimensionStage={dimensionStage} setDimensionStage={setDimensionStage} selectedValues={selectedValues} setSelectedValues={setSelectedValues} handleStatementAnswerSubmit={handleStatementAnswerSubmit} existingAnswers={existingAnswers} firstRender={firstRender} handleAssessmentSubmit={handleAssessmentSubmit} />
            )}
        </>
    );

}

export default Assessment;
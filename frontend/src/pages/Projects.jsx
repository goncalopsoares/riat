import { useState, useEffect, use } from 'react';
import { useUser } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import '../styles/projects.css';
import api from '../api';

const Projects = () => {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [allProjects, setAllProjects] = useState([]);
    const [allSurveys, setAllSurveys] = useState([]);
    const [surveySelector, setSurveySelector] = useState(false);
    const [selectedSurveyId, setSelectedSurveyId] = useState(1);
    const [selectedPhase, setSelectedPhase] = useState(null);


    const navigate = useNavigate();

    const user = useUser();
    const id_user = user.user.id;

    const { setProjectId, setStep, setProjectPhase } = useProject();

    //GET USER'S PROJECTS

    useEffect(() => {
        const getAllProjects = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/project/get/${id_user}/`);
                setAllProjects(response.data);
                

            } catch (error) {

                alert(error);
                console.error(error);

            } finally {

                setLoading(false);
            }
        };

        getAllProjects();

    }, [success, error]);

    //GET AVAILABLE SURVEYS

    useEffect(() => {

        const getAllSurveys = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/survey/get/`);
                
                setAllSurveys(response.data);

            } catch (error) {
                alert(error);
                console.error(error);

            } finally {
                setLoading(false);
            }
        };

        getAllSurveys();

    }, []);

    //RESUME ASSESSMENT OR SHOW SELECTOR FOR NEW ASSESSMENT

    const navigateToAssessement = (e, idProject, lastSubmission) => {

        if (!lastSubmission) {

            e.currentTarget.disabled = true;

            setSurveySelector(idProject);

            return;
        }

        setProjectId(idProject);

        setTimeout(() => {
            navigate('/assessment/' + lastSubmission);
        }, 0);
    };


    //START NEW ASSESSMENT

    const handleStartNewAssessment = async (e, idUserProject) => {

        e.preventDefault();

        setLoading(true);

        try {
            const response = await api.post(`/api/submission/`, {
                surveys_id_surveys: selectedSurveyId,
                users_has_projects_id_users_has_projects: idUserProject,
                submission_state: 1,
            });

            setSuccess('Started new assessment successfully');

            const lastSubmission = response.data.id_submissions;

            setTimeout(() => {
                navigateToAssessement(e, idUserProject, lastSubmission);
            }, 0);

        } catch (error) {
            setError('Error starting new assessment');
            console.error(error);

        } finally {
            setLoading(false);
        }

    };

    // HANDLE PHASE UPDATE

    const handlePhaseUpdate = async (e, idProject, projectPhase) => {

        e.preventDefault();

        setLoading(true);

        setStep(4);
        setProjectId(idProject);
        setProjectPhase(projectPhase);;

        setTimeout(() => {
            navigate('/assessment/');
        }, 0);


    }

    return (
        <div className='mt-5 mb-5' style={{ width: '90%', margin: 'auto', minHeight: '66vh' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Active Projects</h1>
                <button onClick={() => navigate('/assessment')} className='login-form-button'>
                    <p className='m-0'>Create Project</p>
                </button >
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className='table table-responsive text-left align-middle shadow-sm border-2' style={{ maxWidth: '100%', borderRadius: '0.5rem', borderCollapse: 'separate' }}>
                        <thead className='align-top' style={{ fontWeight: 'regular' }}>
                            <tr style={{ height: '6rem' }}>
                                <th className='table-headers-text pt-4 ps-5'>Project Name</th>
                                {surveySelector ? (
                                    <th className='table-headers-text pt-4'>Select Assessment</th>
                                ) : (
                                    <>
                                        <th className='table-headers-text pt-4 ps-5'>Acronym</th>
                                        <th className='table-headers-text pt-4 ps-5'>Current Phase</th>
                                        <th className='table-headers-text pt-4 ps-5'>Submissions</th>
                                        <th className='table-headers-text pt-4 ps-5'>Last Score Obtained</th>
                                        <th className='table-headers-text pt-4 ps-5'>Action</th>
                                    </>
                                )}

                            </tr>
                        </thead>
                        <tbody>
                            {allProjects.map(project => {

                                const lastSubmission = project.submissions[project.submissions.length - 1];
                                
                                const lastCompletedSubmission = project.submissions.filter(submission => submission.submission_state === 2).slice(-1)[0];
                                const idUserProject = project.metadata[0].id_users_has_projects;
                                const submissionsNumber = project.submissions.filter(submission => submission.submission_state === 2).length;

                                return (
                                    <tr key={project.id_projects} style={{ height: '6rem' }}>
                                        <td className='ps-5'>{project.project_name}</td>
                                        {surveySelector ? (
                                            <td>
                                                {surveySelector === project.id_projects ? (
                                                    <form onSubmit={(e) => handleStartNewAssessment(e, idUserProject)} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', alignItems: 'center' }} className="d-grid gap-0 row-gap-3">
                                                        <select
                                                            onChange={(e) => {
                                                                const [surveyIdStr, phaseStr] = e.target.value.split("|");
                                                                setSelectedSurveyId(Number(surveyIdStr));
                                                                setSelectedPhase(Number(phaseStr));
                                                            }}
                                                        >

                                                            {allSurveys.flatMap((survey) => {
                                                                const surveyName = survey.survey_name;

                                                                // Match all phase numbers
                                                                const phaseMatches = surveyName.match(/\d+/g);
                                                                const phases = phaseMatches?.map(Number) || [];

                                                                if (phases.length > 1) {
                                                                    // Remove the "Phase X+Y+Z" part from the survey name
                                                                    const baseName = surveyName.replace(/Phase\s*(\d+(\+\d+)*)/i, "").trim();

                                                                    return phases
                                                                        .filter((phase) => project.project_phase >= phase)
                                                                        .map((phase) => (
                                                                            <option
                                                                                key={`${survey.id_surveys}-phase-${phase}`}
                                                                                value={`${survey.id_surveys}|${phase}`}
                                                                            >
                                                                                {`${baseName} Phase ${phase}`}
                                                                            </option>
                                                                        ));
                                                                }

                                                                // Single-phase survey
                                                                const phase = phases[0];
                                                                return (
                                                                    project.project_phase >= phase && (
                                                                        <option key={survey.id_surveys} value={survey.id_surveys}>
                                                                            {surveyName}
                                                                        </option>
                                                                    )
                                                                );
                                                            })}


                                                        </select>
                                                        <button type="submit" className='create-project-button ms-3'>Start assessment</button>
                                                    </form>
                                                ) : null}
                                            </td>
                                            ) : (
                                            <>
                                                <td className='ps-5'>{project.project_acronym}</td>
                                                <td className='ps-5'>
                                                    {project.project_phase}
                                                    {((!lastSubmission && project.project_phase < 3) || (lastSubmission && lastSubmission.submission_state === 2 && project.project_phase < 3))  && (
                                                        <a
                                                            className='text-underline ms-3'
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={(e) => handlePhaseUpdate(e, project.id_projects, project.project_phase)}
                                                        >
                                                            Update
                                                        </a>
                                                    )}
                                                </td>
                                                <td className='ps-5'>{submissionsNumber}</td>
                                                <td className='ps-5'>
                                                    {lastCompletedSubmission ? (
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }} className="d-grid gap-0 row-gap-3">
                                                            <div className="score-bar-container">
                                                                <div
                                                                    className="score-bar"
                                                                    style={{
                                                                        width: `${(lastCompletedSubmission.reports_overall_score_value / lastCompletedSubmission.reports_overall_score_max_value) * 100}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className='m-0 align-middle' style={{ textAlign: 'center' }}>{`${lastCompletedSubmission.reports_overall_score_value} / ${lastCompletedSubmission.reports_overall_score_max_value}`}</p>
                                                        </div>
                                                    ) : 'No completed assessments'}
                                                </td>
                                                <td className='ps-5'>
                                                    <button
                                                        onClick={(e) => navigateToAssessement(
                                                            e,
                                                            project.id_projects,
                                                            lastSubmission && lastSubmission.submission_state === 1
                                                                ? lastSubmission.id_submissions
                                                                : null
                                                        )}
                                                        className='new-assessment-button'
                                                    >
                                                        {lastSubmission && lastSubmission.submission_state === 1 ? (
                                                            <p className='m-0 text-decoration-underline'>Resume Latest Assessment</p>
                                                        ) : (
                                                            <p className='m-0 text-decoration-underline'>New Assessment</p>
                                                        )}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Projects;
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Projects = () => {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [allProjects, setAllProjects] = useState([]);
    const [allSurveys, setAllSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(1);
    const [surveySelector, setSurveySelector] = useState(false);

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
                console.log(response.data);

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
                console.log(response.data);
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

    //SELECT SURVEY

    const handleSelectSurvey = (e) => {
        setSelectedSurvey(e.target.value);
    }

    //START NEW ASSESSMENT

    const handleStartNewAssessment = async (e, idUserProject) => {

        e.preventDefault();

        setLoading(true);

        try {
            const response = await api.post(`/api/submission/`, {
                surveys_id_surveys: selectedSurvey,
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
        <>
            <div>
                <button onClick={() => navigate('/assessment')}>
                    <p>Create Project</p>
                </button >
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Phase</th>
                                <th>Submissions</th>
                                <th>Score</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProjects.map(project => {

                                const lastSubmission = project.submissions[project.submissions.length - 1];
                                const idUserProject = project.metadata[0].id_users_has_projects;
                                const submissionsNumber = project.submissions.filter(submission => submission.submission_state === 2).length;

                                return (
                                    <tr key={project.id_projects}>
                                        <td>{project.project_name}</td>
                                        <td>{project.project_phase} {!lastSubmission && <a className='text-underline' onClick={(e) => handlePhaseUpdate(e, project.id_projects, project.project_phase)}>Update</a>}</td>
                                        <td>{submissionsNumber}</td>
                                        <td>lorem</td>
                                        <td>
                                            <button
                                                onClick={(e) => navigateToAssessement(
                                                    e,
                                                    project.id_projects,
                                                    lastSubmission && lastSubmission.submission_state === 1
                                                        ? lastSubmission.id_submissions
                                                        : null
                                                )}
                                            >
                                                {lastSubmission && lastSubmission.submission_state === 1 ? (
                                                    <p>Resume Latest Assessment</p>
                                                ) : (
                                                    <p>New Assessment</p>
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            {surveySelector === project.id_projects ? (
                                                <form onSubmit={(e) => handleStartNewAssessment(e, idUserProject)}>
                                                    <select value={selectedSurvey} onChange={handleSelectSurvey}>
                                                        {allSurveys.map((survey) => {
                                                            // Extract phase number from survey_name
                                                            const surveyPhase = parseInt(survey.survey_name.match(/\d+/)?.[0], 10);

                                                            return (
                                                                <option
                                                                    key={survey.id_surveys}
                                                                    value={survey.id_surveys}
                                                                    // Disable if project phase is less than survey phase
                                                                    disabled={project.project_phase < surveyPhase}
                                                                >
                                                                    {survey.survey_name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    <button type="submit">Start assessment</button>
                                                </form>
                                            ) : null}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Projects;
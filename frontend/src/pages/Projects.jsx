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
    const [selectedSurvey, setSelectedSurvey] = useState('');
    const [surveySelector, setSurveySelector] = useState(false);

    const navigate = useNavigate();

    const user = useUser();
    const id_user = user.user.id;

    const { setProjectId, setStep } = useProject();

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


    const navigateToAssessement = (e, id_project, lastSubmission) => {

        if (!lastSubmission) {

            e.currentTarget.disabled = true;

            setSurveySelector(id_project);

            return;
        }

        setProjectId(id_project);
        setStep(5);

        setTimeout(() => {
            navigate('/assessment/' + lastSubmission);
        }, 0);
    };

    const handleSelectSurvey = (e) => {
        setSelectedSurvey(e.target.value);
    }

    const handleChooseSurvey = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await api.patch(`/api/submissions/`, {
                surveys_id_surveys: selectedSurvey,



            });

            setSuccess('Survey updated successfully');
            setSelecting(false);

        } catch (error) {
            setError('Error updating survey');
            console.error(error);

        } finally {
            setLoading(false);
        }

    };


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

                                return (
                                    <tr key={project.id_projects}>
                                        <td>{project.project_name}</td>
                                        <td>{project.project_phase}</td>
                                        <td>lorem</td>
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
                                                <form onSubmit={handleChooseSurvey}>
                                                    <select value={selectedSurvey} onChange={handleSelectSurvey}>
                                                        {allSurveys.map((survey) => (
                                                            <option key={survey.id_surveys} value={survey.id_surveys}>
                                                                {survey.survey_name}
                                                            </option>
                                                        ))}
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
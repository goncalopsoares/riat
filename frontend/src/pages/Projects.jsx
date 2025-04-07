import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Projects = () => {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [allProjects, setAllProjects] = useState([]);

    const navigate = useNavigate();

    const user = useUser();
    const id_user = user.user.id;

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
                                            <a href={`/${project.id_projects}`}>
                                                {lastSubmission && lastSubmission.submission_state === 1 ? (
                                                    <p>Resume Latest Assessment</p>
                                                ) : (
                                                    <p>New Assessment</p>
                                                )}
                                            </a>
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
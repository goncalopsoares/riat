import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ProjectsAdmin = () => {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(10);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(projects.length / projectsPerPage);


    useEffect(() => {
        const getProjects = async () => {
            try {
                const response = await api.get("api/projects/get/");
                console.log(response.data);
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                console.log("Fetch attempt completed.");
            }
        };

        getProjects();
    }, []);



    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto' }}>
            <h1 className="mb-4 ms-4">Existing Projects</h1>
            <div className="mx-4">
                <table className='table table-responsive text-left align-middle shadow-sm border border-2' style={{ maxWidth: '100%', borderRadius: '0.5rem', borderCollapse: 'separate' }}>
                    <thead className='align-top' style={{ fontWeight: 'regular' }}>
                        <tr style={{ height: '6rem' }}>
                            <th className='table-headers-text pt-4 ps-4'>ID</th>
                            <th className='table-headers-text pt-4'>Project Name</th>
                            <th className='table-headers-text pt-4'>Phase</th>
                            <th className='table-headers-text pt-4'>MRL</th>
                            <th className='table-headers-text pt-4'>SRL</th>
                            <th className='table-headers-text pt-4'>TRL</th>
                            <th className='table-headers-text pt-4'>Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjects.map(project => (
                            <tr key={project.id_projects}>
                                <td className='ps-4 py-3'>
                                    <a href={``}>
                                        {project.id_projects}
                                    </a>
                                </td>
                                <td>{project.project_name}</td>
                                <td>{project.project_phase}</td>
                                <td>{project.project_mrl}</td>
                                <td>{project.project_srl}</td>
                                <td>{project.project_trl}</td>
                                <td>{project.metadata[0].users_has_projects_role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination d-flex justify-content-start align-items-center mt-3 mb-5">
                        <nav>
                            <ul className="pagination justify-content-center mb-0 me-5">
                                {[...Array(totalPages).keys()].map(pageNumber => (
                                    <li key={pageNumber + 1} className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(pageNumber + 1)}>
                                            {pageNumber + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <label htmlFor="projectsPerPage" className="me-2">Projects per page:</label>
                        <select
                            id="projectsPerPage"
                            className="form-select w-auto"
                            value={projectsPerPage}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setProjectsPerPage(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 50].map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
    );
}

export default ProjectsAdmin;
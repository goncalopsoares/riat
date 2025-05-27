const ProjectsAdminTable = ({ currentProjects, paginate, totalPages, currentPage, setCurrentPage, projectsPerPage, setProjectsPerPage, handleProjectClick }) => {

    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto', minHeight: 'calc(100vh - 20vh)' }}>
            <h1 className="mb-4 ms-4">Existing Projects</h1>
            <div className="mx-4">
                <table className='table table-responsive text-left align-middle shadow-sm border-2' style={{ maxWidth: '100%', borderRadius: '0.5rem', borderCollapse: 'separate' }}>
                    <thead className='align-top' style={{ fontWeight: 'regular' }}>
                        <tr style={{ height: '6rem' }}>
                            <th className='table-headers-text pt-4 ps-4'>Code</th>
                            <th className='table-headers-text pt-4'>Project Name</th>
                            <th className='table-headers-text pt-4'>Acronym</th>
                            <th className='table-headers-text pt-4'>Phase</th>
                            <th className='table-headers-text pt-4'>MRL</th>
                            <th className='table-headers-text pt-4'>SRL</th>
                            <th className='table-headers-text pt-4'>TRL</th>
                            <th className='table-headers-text pt-4'>Owner</th>
                            <th className='table-headers-text pt-4'>Latest Submission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjects.map(project => {

                            let mostRecentSubmissionEndingTime = "No concluded submissions yet";
                            if (project.submissions && project.submissions.length > 0) {
                                const lastCompletedSubmission = project.submissions
                                    .filter(submission => submission.submission_state === 2)
                                    .slice(-1)[0];

                                if (lastCompletedSubmission && lastCompletedSubmission.submission_ending_time) {
                                    mostRecentSubmissionEndingTime = new Date(lastCompletedSubmission.submission_ending_time).toLocaleString();
                                }
                            }

                        return (
                        <tr key={project.id_projects}>
                            <td className='ps-4 py-3'>
                                <a className="link"
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                                    onClick={() => { handleProjectClick(project.id_projects) }}>
                                    {project.project_unique_code}
                                </a>
                            </td>
                            <td style={{ maxWidth: '25rem' }}>{project.project_name}</td>
                            <td style={{ maxWidth: '5rem' }}>{project.project_acronym}</td>
                            <td>{project.project_phase}</td>
                            <td>{project.project_mrl}</td>
                            <td>{project.project_srl}</td>
                            <td>{project.project_trl}</td>
                            <td>{project.metadata[0].user_email}</td>
                            <td>{mostRecentSubmissionEndingTime}</td>
                        </tr>
                        );
                        })}
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

export default ProjectsAdminTable;
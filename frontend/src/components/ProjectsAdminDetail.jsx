const ProjectsAdminDetail = ({ selectedProject, handleBackClick }) => {

    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto' }}>
            <div className="d-flex flex-direction-row justify-content-between align-items-center mb-4 mx-4">
                <div>
                    <h1 className="">{selectedProject.id_projects}. {selectedProject.project_name} ({selectedProject.project_acronym})</h1>
                    <div className="d-flex flex-direction-row gap-1">
                        <p>Owned by <b>{selectedProject.metadata[0].user_email} ({selectedProject.project_owner_name})</b></p>
                        <p>with the project role <b>{selectedProject.metadata[0].users_has_projects_role}</b></p>
                    </div>
                </div>
                <a
                    onClick={() => {
                        handleBackClick();
                    }}
                    className="m-0"
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}>
                    Select Other Project
                </a>
            </div>
            <div className="mx-4">
                <div className="d-flex flex-direction-row gap-5">
                    <p>Organization <b>{selectedProject.project_organization}</b></p>
                    <p>Function <b>{selectedProject.metadata[0].users_has_projects_function}</b></p>
                </div>
                <p>Value chain <b>{selectedProject.project_value_chain}</b></p>
                <p>Phase <b>{selectedProject.project_phase}</b></p>
                <div className="d-flex flex-direction-row align-items-center mb-4 gap-4">
                    <p>MRL <b>{selectedProject.project_mrl}</b></p>
                    <p>SRL <b>{selectedProject.project_srl}</b></p>
                    <p>TRL <b>{selectedProject.project_trl}</b></p>
                </div>
                <div>
                    <table className='table table-responsive text-left align-middle shadow-sm border-2' style={{ maxWidth: '100%', borderRadius: '0.5rem', borderCollapse: 'separate' }}>
                        <thead className='align-top' style={{ fontWeight: 'regular' }}>
                            <tr style={{ height: '6rem' }}>
                                <th className='table-headers-text pt-4 ps-4'>Submissions</th>
                                <th className='table-headers-text pt-4'>ID</th>
                                <th className='table-headers-text pt-4'>Score</th>
                                <th className='table-headers-text pt-4'>Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProject.submissions.map((submission, index) => (
                                <tr key={index}>
                                    <td className='ps-4 py-3'>
                                        <p>Submission {index + 1}</p>
                                    </td>
                                    <td>{submission.id_submissions}</td>
                                    <td>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }} className="d-grid gap-0 row-gap-3">
                                            <div className="score-bar-container">
                                                <div
                                                    className="score-bar"
                                                    style={{
                                                        width: `${(submission.reports_overall_score_value / submission.reports_overall_score_max_value) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className='m-0 align-middle' style={{ textAlign: 'center' }}>{`${submission.reports_overall_score_value} / ${submission.reports_overall_score_max_value}`}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <a
                                            className="link"
                                            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                                            onClick={() => {
                                                window.open(`/report/${submission.report_token}`, '_blank');
                                            }}>
                                            View Report
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default ProjectsAdminDetail;
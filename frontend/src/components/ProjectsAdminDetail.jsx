const ProjectsAdminDetail = ({ selectedProject, handleBackClick }) => {

    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto' }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4 mx-4">
                <div style={{ maxWidth: '85%' }}>
                    <h1>{selectedProject.project_name} ({selectedProject.project_acronym}) <span className="display-6 fs-5">{selectedProject.project_unique_code}</span> </h1>
                    <div className="d-flex flex-column gap-1">
                        {selectedProject.metadata.map((meta, index) => (
                            <div key={index} className="d-flex flex-row gap-1">
                                <p>{index + 1 }. {index === 0 ? ("Owned by") : ("and")} <b>{meta.user_email} ({selectedProject.project_owner_name})</b></p>
                                <p>with the project role <b>{meta.users_has_projects_role}</b></p>
                                <p>and function <b>{meta.users_has_projects_function}</b></p>
                            </div>
                        ))}
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
                <p>Value chain <b>{selectedProject.project_value_chain}</b></p>
                <p>Phase <b>{selectedProject.project_phase}</b></p>
                <div className="d-flex flex-row align-items-center mb-4 gap-4">
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
                                <th className='table-headers-text pt-4'>Starting Time</th>
                                <th className='table-headers-text pt-4'>Ending Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProject.submissions.map((submission, index) => (
                                <tr key={index}>
                                    <td className='ps-4 py-3'>
                                        <p className="mb-0">Submission {index + 1}</p>
                                    </td>
                                    <td>{submission.id_submissions}</td>
                                    <td>
                                        {submission.submission_state === 2 ? (
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
                                            </div>) : (
                                            <p className="mb-0">Assessment not yet concluded</p>
                                        )}
                                    </td>
                                    <td>
                                        {submission.submission_state === 2 ? (
                                            <a
                                                className="link"
                                                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                                                onClick={() => {
                                                    window.open(`/report/${submission.report_token}`, '_blank');
                                                }}>
                                                View Report
                                            </a>
                                        ) : (
                                            <p className="mb-0">Report not available</p>
                                        )}
                                    </td>
                                    <td>{new Date(submission.submission_starting_time).toLocaleString()}</td>
                                    <td>{submission.submission_ending_time ? new Date(submission.submission_ending_time).toLocaleString() : 'Not concluded yet'}</td>
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
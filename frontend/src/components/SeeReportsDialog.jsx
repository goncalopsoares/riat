const SeeReportsDialog = ({ showingReportsId, setShowingReportsId, submissions }) => {

    if (showingReportsId === null) {
        return
    };

    return (
        <div id="request-access-project" className="modal">
            <div className="modal-content" style={{ width: '50rem', textAlign: 'start' }}>
                <div>
                    <h2 className='mb-4'>Reports</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Submission ID</th>
                                    <th>Score</th>
                                    <th>Submission Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission.id_submissions}>
                                        <td style={{padding: '1.5rem 1rem'}}>{submission.id_submissions}</td>
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
                                        <td style={{padding: '1.5rem 1rem'}}>{new Date(submission.submission_ending_time).toLocaleDateString()}</td>
                                        <td style={{padding: '1.5rem 1rem'}}><a href={`report/${submission.report_token}`}>View report</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-3'>
                        <a className="close-btn" onClick={() => setShowingReportsId(null)}>Close</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeeReportsDialog;
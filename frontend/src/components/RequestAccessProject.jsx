import '../styles/assessmentAlert.css';

const RequestAccessProject = ({ showRequestAccess, setShowRequestAccess, existingProjectCode, setExistingProjectCode }) => {
    if (!showRequestAccess) return null;

    return (
        <div id="assessment-alert" className="modal">
            <div className="modal-content" style={{width: '30rem'}}>

                <h3 className='mb-3'>Requesting access to an existing project</h3>
                <p>Please, insert the code of the project you want to access</p>
                <div className='d-flex flex-direction-row justify-content-between gap-4 mb-3'>
                    <div className="w-100">
                        <label className="form-label"></label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Insert the project's code"
                            value={existingProjectCode}
                            onChange={(e) => setExistingProjectCode(e.target.value)}
                            maxLength={6}
                        />
                    </div>
                    <button onClick={() => navigate('/')} className='login-form-button'>
                        <p className='m-0 text-white'>Submit</p>
                    </button>
                </div>
                <a onClick={() => setShowRequestAccess(false)} className="close-btn" aria-label="Close alert">Close</a>
            </div>
        </div>
    );
};

export default RequestAccessProject;
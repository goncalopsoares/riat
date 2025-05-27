import '../styles/assessmentAlert.css';

const RequestAccessProject = ({ showRequestAccess, setShowRequestAccess, accessRequested, setAccessRequested, existingProjectCode, setExistingProjectCode, newUserRole, setNewUserRole, newUserFunction, setNewUserFunction, handleRequestAccess }) => {
    
    if (!showRequestAccess) return null;

    return (

        <div id="request-access-project" className="modal">
            <div className="modal-content" style={{ width: '32rem', textAlign: 'start' }}>
                {!accessRequested && (
                    <>
                        <h3 className='mb-4'>Requesting access to an existing project</h3>
                        <p className='form-label text-black fs-6'>Please, insert the code of the project you want to access</p>
                        <div className='d-flex flex-row justify-content-between gap-4 mb-3'>
                            <div className="w-100">
                                <label className="form-label"></label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Insert the project's code"
                                    value={existingProjectCode}
                                    onChange={(e) => setExistingProjectCode(e.target.value)}
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <div className="my-3 w-100">
                            <label className="form-label">Select your role in the project</label>
                            <div className="d-flex flex-row gap-5">
                                <label className="radio-label mt-2">
                                    <input
                                        className="radio-input"
                                        type="radio"
                                        name="role"
                                        value="Project Manager"
                                        checked={newUserRole === "Project Manager"}
                                        onChange={(e) => setNewUserRole(e.target.value)}
                                    />
                                    Project Manager
                                </label>
                                <label className="radio-label mt-2">
                                    <input
                                        className="radio-input"
                                        type="radio"
                                        name="role"
                                        value="Team Member"
                                        checked={newUserRole === "Team Member"}
                                        onChange={(e) => setNewUserRole(e.target.value)}
                                    />
                                    Team Member
                                </label>
                            </div>
                        </div>
                        <p className='form-label text-black mt-3'>Fill in with your function in the organization</p>
                        <div className='d-flex flex-row justify-content-between gap-4 mb-3'>
                            <div className="w-100">
                                <label className="form-label"></label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Insert your function in the organization"
                                    value={newUserFunction}
                                    onChange={(e) => setNewUserFunction(e.target.value)}
                                    maxLength={45}
                                />
                            </div>
                        </div>
                        <button onClick={() => handleRequestAccess(existingProjectCode)} className='login-form-button my-3'>
                            <p className='m-0 text-white'>Submit</p>
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <a onClick={() => { setShowRequestAccess(false); setAccessRequested(false); }} className="close-btn margin-auto" aria-label="Close alert">Close</a>
                        </div>
                    </>
                )}
                {accessRequested && (
                    <>
                        <p>Access requested with success.</p>
                        <p>Now you should wait for the admin's approval.</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <a onClick={() => { setShowRequestAccess(false); setAccessRequested(false); }} className="close-btn margin-auto" aria-label="Close alert">Close</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RequestAccessProject;
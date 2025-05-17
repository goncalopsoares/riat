import '../styles/assessmentAlert.css';

const AssessmentAlert = ({ show, setShow }) => {
    if (!show) return null;

    return (
        <div id="assessment-alert" className="modal">
            <div className="modal-content">
                
                <h3>RIAT says</h3>
                <p>
                    Please provide an answer to every statement and write an explanation for
                    <em> 'Prefer not to answer'</em> options.
                </p>
                <a onClick={() => setShow(false)} className="close-btn" aria-label="Close alert">Close</a>
            </div>
        </div>
    );
};

export default AssessmentAlert;

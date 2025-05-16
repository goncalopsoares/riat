import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Reports = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState('');

    return (
        <div className='mt-5 mb-5' style={{ width: '90%', margin: 'auto', minHeight: '70vh' }}>
            <div className="w-100">
                <h3 className="my-4">Insert the code of the report to access it</h3>
                <form className="d-flex flex-row align-items-center justify-content-start gap-5">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Report Code"
                        value={token}
                        onChange={(e) => setToken(e.target.value)} />
                    <button onClick={() => navigate(`/report/${token}`)} className='login-form-button'>
                        <p className='m-0'>Get Report</p>
                    </button>
                </form>
                <p className="mt-4">
                    <HelpOutlineIcon /> You can find the report code in the top of the pdf file that you've downloaded.
                </p>
            </div>
        </div>
    );
};

export default Reports;
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from '../api';

const Report = () => {

    const { id } = useParams();

    useEffect(() => {
        const getReport = async () => {
            const response = await api.get(`api/report/${id}/`);
            console.log(response.data);

        }

        getReport();
    }, [id]);

    return (
        <>
            <div>
                <h1>Report</h1>
            </div>
        </>
    );
};

export default Report;
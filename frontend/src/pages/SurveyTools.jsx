import { useEffect, useState, useRef } from 'react';
import api from '../api';
import SurveyAddDialog from '../components/SurveyAddDialog';

const SurveyTools = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);
    const [allSurveys, setAllSurveys] = useState([]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const dialogRef = useRef(null);

    useEffect(() => {
        const getAllSurveys = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/survey/get/');
                setAllSurveys(response.data);
                console.log(response.data);
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getAllSurveys();

    }, [success, error]);

    const handleSurveySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const surveyName = formData.get('survey_name');
        const surveyDescription = formData.get('survey_description');

        try {
            await api.post(`/api/survey/create/`, {
                survey_name: surveyName,
                survey_description: surveyDescription,
            });

            setSuccess("Assessment created successfully");
            setTimeout(() => setSuccess(''), 4000);
            setEditing(false);
            setError('');
        } catch (error) {
            alert(error);
            console.error(error);
            setError("An error occurred while saving the assessment.");
            setTimeout(() => setError(''), 4000);
        }
    }

    return (
        <>
            <div>
                <button onClick={() => { setEditing(true); }}>
                    <p>Create assessment</p>
                </button >
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Assessment Name</th>
                                <th>Description</th>
                                <th>Creation Date</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSurveys.map(survey => (
                                <tr key={survey.id_surveys}>
                                    <td>
                                        <a href={`/surveyadmin/${survey.id_surveys}`}>
                                            {survey.survey_name}
                                        </a>
                                    </td>
                                    <td>{survey.survey_description}</td>
                                    <td>{formatDate(survey.survey_creation_time)}</td>
                                    <td>{formatDate(survey.survey_last_modified_by_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {editing === true ? (
            <SurveyAddDialog
                dialogRef={dialogRef}
                setEditing={setEditing}
                handleSurveySubmit={handleSurveySubmit}
            /> ) : null}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
        </>
    );
}

export default SurveyTools;
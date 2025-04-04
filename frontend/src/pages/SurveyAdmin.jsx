import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import SurveyAdminInfo from '../components/SurveyAdminInfo';
import SurveyAdminDimensions from '../components/SurveyAdminDimensions';

const SurveyAdmin = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [surveyName, setSurveyName] = useState('');
    const [surveyDescription, setSurveyDescription] = useState('');
    const [surveyCreatedBy, setSurveyCreatedBy] = useState('');
    const [surveyCreationTime, setSurveyCreationTime] = useState('');
    const [surveyModifiedBy, setSurveyModifiedBy] = useState('');
    const [surveyLastModifiedByDate, setSurveyLastModifiedByDate] = useState('');
    const [allDimensions, setAllDimensions] = useState([]);

    const [editingDescription, setEditingDescription] = useState(false);
    const [editingDimensionDescription, setEditingDimensionDescription] = useState(false);

    const [editing, setEditing] = useState(false);
    const [isShowing, setIsShowing] = useState(false);
    const [updateDimensionDescription, setUpdateDimensionDescription] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const { id } = useParams();

    const dialogRef = useRef(null);

    useEffect(() => {

        const getSurvey = async () => {
            setLoading(true);

            try {
                const response = await api.get(`/api/survey/get/${id}`);
                setSurveyName(response.data[0].survey_name);
                setSurveyDescription(response.data[0].survey_description);
                setSurveyCreatedBy(response.data[0].survey_created_by);

                const creationTime = response.data[0].survey_creation_time;
                setSurveyCreationTime(formatDate(creationTime));

                setSurveyModifiedBy(response.data[0].survey_modified_by);

                const modifiedTime = response.data[0].survey_last_modified_by_date;
                setSurveyLastModifiedByDate(formatDate(modifiedTime));

            } catch (error) {
                alert(error);
                console.error(error);

            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getSurvey();
        }

    }, [id, success, error]);

    useEffect(() => {

        const getDimensions = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/dimension/get/${id}`);
                const dimensions = response.data;

                const dimensionsWithStatements = await Promise.all(
                    dimensions.map(async (dimension) => {
                        const statementsResponse = await api.get(`/api/statement/get/${dimension.id_dimensions}/`);

                        return {
                            ...dimension,
                            statements: statementsResponse.data,
                        };
                    })
                );

                setAllDimensions(dimensionsWithStatements);
                console.log(dimensionsWithStatements);
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getDimensions();

    }, [id, success]);

    const handleSurveySubmit = async (e) => {
        e.preventDefault();
        console.log("Survey ID:", id);
        const formData = new FormData(e.target);
        const surveyDescription = formData.get('survey_description');
        console.log("Survey Description:", surveyDescription);

        try {
            await api.put(`/api/survey/update/${id}/`, {
                survey_description: surveyDescription
            });

            setSuccess("Assessment updated successfully");
            setTimeout(() => setSuccess(''), 4000);
            setError('');
        } catch (error) {
            alert(error);
            console.error(error);
            setError("An error occurred while saving the assessment.");
        }
    }


    const handleDimensionSubmit = async (e, id, exisitingData) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let dimensionName;
        let dimensionDescription;

        if (updateDimensionDescription) {
            dimensionName = exisitingData;
            dimensionDescription = formData.get('dimension_description');
        } else {
            dimensionName = formData.get('dimension_name');
            dimensionDescription = exisitingData;
        }

        console.log("Dimension ID:", id);
        console.log("Dimension Name:", dimensionName);
        console.log("Dimension Description:", dimensionDescription);

        try {
            if (exisitingData) {
                await api.put(`/api/dimension/update/${id}/`, {
                    dimension_name: dimensionName,
                    dimension_description: dimensionDescription,
                });

                setSuccess("Dimension updated successfully");
                setTimeout(() => setSuccess(''), 4000);

            } else {
                await api.post(`/api/dimension/create/${id}/`, {
                    dimension_name: dimensionName,
                    dimension_description: dimensionDescription,
                });

                setSuccess("Dimension created successfully");
                setTimeout(() => setSuccess(''), 4000);

            }
            setEditing(false);
            setError('');
        } catch (error) {
            alert(error);
            console.error(error);
            setError("An error occurred while saving the dimension.");
        }
    }


    return (
        <>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <SurveyAdminInfo surveyName={surveyName} surveyDescription={surveyDescription} setSurveyDescription={setSurveyDescription} surveyCreatedBy={surveyCreatedBy} surveyCreationTime={surveyCreationTime} surveyModifiedBy={surveyModifiedBy} surveyLastModifiedByDate={surveyLastModifiedByDate} editingDescription={editingDescription} setEditingDescription={setEditingDescription} handleSurveySubmit={handleSurveySubmit} />
                )}
            </div>
            <h2>Dimensions and Statements</h2>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <SurveyAdminDimensions allDimensions={allDimensions} editing={editing} setEditing={setEditing} isShowing={isShowing} setIsShowing={setIsShowing} setUpdateDimensionDescription={setUpdateDimensionDescription} editingDimensionDescription={editingDimensionDescription} setEditingDimensionDescription={setEditingDimensionDescription} handleDimensionSubmit={handleDimensionSubmit} />
                )}
            </div>
            <div>
                <button onClick={() => { setEditing(true); setUpdateDimension(false); }}>Add New Dimension</button>
            </div>
            <div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </>
    )
}

export default SurveyAdmin;
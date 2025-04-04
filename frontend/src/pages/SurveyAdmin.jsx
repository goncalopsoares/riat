import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import SurveyAdminInfo from '../components/SurveyAdminInfo';
import SurveyAdminDimensions from '../components/SurveyAdminDimensions';
import SurveyDimensionDialog from '../components/SurveyDimensionDialog';

const SurveyAdmin = () => {

    //GENERAL
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);
    const [isShowing, setIsShowing] = useState(false);

    //SURVEY DATA
    const [surveyName, setSurveyName] = useState('');
    const [surveyDescription, setSurveyDescription] = useState('');
    const [surveyCreatedBy, setSurveyCreatedBy] = useState('');
    const [surveyCreationTime, setSurveyCreationTime] = useState('');
    const [surveyModifiedBy, setSurveyModifiedBy] = useState('');
    const [surveyLastModifiedByDate, setSurveyLastModifiedByDate] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);

    //DIMENSIONS DATA
    const [allDimensions, setAllDimensions] = useState([]);
    const [editingDimensionDescription, setEditingDimensionDescription] = useState(false);
    const [editingDimensionName, setEditingDimensionName] = useState(false);
    const [updateDimensionDescription, setUpdateDimensionDescription] = useState(false);

    //STATEMENTS DATA
    const [allScales, setAllScales] = useState([]);
    const [editingStatementDescription, setEditingStatementDescription] = useState(false);
    const [editingStatementName, setEditingStatementName] = useState(false);
    const [updateStatementDescription, setUpdateStatementDescription] = useState(false);

    const dialogRef = useRef(null);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    const { id } = useParams();

    //GET SURVEY DATA
    //GET DIMENSIONS DATA
    //GET SCALES DATA

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


    useEffect(() => {
        const getAllScales = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/scale/get/');
                setAllScales(response.data);
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getAllScales();

    }, []);


    //UPDATE SURVEY DESCRIPTION

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

    //CREATE/UPDATE DIMENSION NAME AND DESCRIPTION

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

        try {
            if (exisitingData !== undefined) {
                await api.put(`/api/dimension/update/${id}/`, {
                    dimension_name: dimensionName,
                    dimension_description: dimensionDescription,
                });

                setSuccess("Dimension updated successfully");
                setEditingDimensionDescription(false);
                setTimeout(() => setSuccess(''), 4000);

            } else {
                await api.post(`/api/dimension/create/${id}/`, {
                    dimension_name: formData.get('dimension_name'),
                    dimension_description: formData.get('dimension_description'),
                    dimension_phase: 1,
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

    //CREATE/UPDATE STATEMENT NAME, DESCRIPTION AND SCALE

    const handleStatementSubmit = async (e, id, exisitingData) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let statementName;
        let statementDescription;

        console.log(updateStatementDescription, exisitingData);

        if (updateStatementDescription) {
            statementName = exisitingData;
            statementDescription = formData.get('statement_description');
        } else {
            statementName = formData.get('statement_name');
            statementDescription = exisitingData;
        }

        console.log(statementName, statementDescription)

        try {
            if (exisitingData) {
                await api.put(`/api/statement/update/${id}/`, {
                    statement_name: statementName,
                    statement_description: statementDescription,
                });

                setSuccess("Statement updated successfully");
                setEditingDimensionDescription(false);
                setTimeout(() => setSuccess(''), 4000);

            } else {
                await api.post(`/api/statement/create/${id}/`, {
                    statement_name: statementName,
                    statement_description: statementDescription,
                });

                setSuccess("Statement created successfully");
                setTimeout(() => setSuccess(''), 4000);

            }
            setEditing(false);
            setError('');
        } catch (error) {
            alert(error);
            console.error(error);
            setError("An error occurred while saving the statement.");
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
                    <SurveyAdminDimensions allDimensions={allDimensions} editing={editing} setEditing={setEditing} isShowing={isShowing} setIsShowing={setIsShowing} setUpdateDimensionDescription={setUpdateDimensionDescription} editingDimensionDescription={editingDimensionDescription} setEditingDimensionDescription={setEditingDimensionDescription} handleDimensionSubmit={handleDimensionSubmit} editingDimensionName={editingDimensionName} setEditingDimensionName={setEditingDimensionName} allScales={allScales} editingStatementDescription={editingStatementDescription} setEditingStatementDescription={setEditingStatementDescription} editingStatementName={editingStatementName} setEditingStatementName={setEditingStatementName}
                        setUpdateStatementDescription={setUpdateStatementDescription} handleStatementSubmit={handleStatementSubmit} />
                )}
            </div>
            <div>
                <button onClick={() => { setEditing(true); }}>Add New Dimension</button>
            </div>
            {editing ? (
                <SurveyDimensionDialog dialogRef={dialogRef} setEditing={setEditing} id={id} handleDimensionSubmit={handleDimensionSubmit}
                />) : null}
            <div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </>
    )
}

export default SurveyAdmin;
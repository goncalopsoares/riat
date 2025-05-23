import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import SurveyAdminInfo from '../components/SurveyAdminInfo';
import SurveyAdminDimensions from '../components/SurveyAdminDimensions';
import SurveyDimensionDialog from '../components/SurveyDimensionDialog';
import '../styles/global.css'
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";


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
    const [editingDimensionShortDescription, setEditingDimensionShortDescription] = useState(false);
    const [editingDimensionName, setEditingDimensionName] = useState(false);
    const [updateDimensionDescription, setUpdateDimensionDescription] = useState(false);
    const [updateDimensionShortDescription, setUpdateDimensionShortDescription] = useState(false);
    const [currentDimensionForStatement, setCurrentDimensionForStatement] = useState(null);
    const [dimensionsNumber, setDimensionsNumber] = useState(0);

    //STATEMENTS DATA
    const [allScales, setAllScales] = useState([]);
    const [editingStatementDescription, setEditingStatementDescription] = useState(false);
    const [editingStatementName, setEditingStatementName] = useState(false);
    const [updateStatementDescription, setUpdateStatementDescription] = useState(false);
    const [updateStatementName, setUpdateStatementName] = useState(false);
    const [addStatement, setAddStatement] = useState(false);

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
                setDimensionsNumber(dimensionsWithStatements.length);

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

        const formData = new FormData(e.target);
        const surveyDescription = formData.get('survey_description');


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

    const handleDimensionSubmit = async (e, id, existingData = {}, updateType = null) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let dimensionName = existingData.dimension_name || '';
        let dimensionShortDescription = existingData.dimension_short_description || '';
        let dimensionDescription = existingData.dimension_description || '';
        const dimensionOrder = dimensionsNumber + 1;
        const parentDimension = formData.get('parent_dimension') || null;

        if (updateType === 'description') {
            dimensionDescription = formData.get('dimension_description');
        } else if (updateType === 'short_description') {
            dimensionShortDescription = formData.get('dimension_short_description');
        } else if (updateType === 'name') {
            dimensionName = formData.get('dimension_name');
        } else {
            dimensionName = formData.get('dimension_name');
            dimensionShortDescription = formData.get('dimension_short_description');
            dimensionDescription = formData.get('dimension_description');
        }

        try {
            if (Object.keys(existingData).length > 0) {
                await api.put(`/api/dimension/update/${id}/`, {
                    dimension_name: dimensionName,
                    dimension_short_description: dimensionShortDescription,
                    dimension_description: dimensionDescription,
                    dimension_order: dimensionOrder,
                });

                setSuccess("Dimension updated successfully");
                setEditingDimensionDescription(false);
                setEditingDimensionShortDescription(false);
                setTimeout(() => setSuccess(''), 2000);

            } else {

                const payload = {
                    dimension_name: dimensionName,
                    dimension_short_description: dimensionShortDescription,
                    dimension_description: dimensionDescription,
                    dimension_order: dimensionOrder,
                    parent_dimension: parentDimension ? Number(parentDimension) : null,
                };


                const response = await api.post(`/api/dimension/create/${id}/`, {
                    dimension_name: dimensionName,
                    dimension_short_description: dimensionShortDescription,
                    dimension_description: dimensionDescription,
                    dimension_order: dimensionOrder,
                    parent_dimension_id: parentDimension ? Number(parentDimension) : null,
                });



                setSuccess("Dimension created successfully");
                setTimeout(() => setSuccess(''), 2000);
            }

            setEditing(false);
            setError('');
        } catch (error) {
            alert(error);
            console.error(error);
            setError("An error occurred while saving the dimension.");
        }
    };


    //CREATE/UPDATE STATEMENT NAME, DESCRIPTION AND SCALE

    const handleStatementSubmit = async (e, id, existingName, existingDescription, selectedScale) => {
        e.preventDefault();

        const formData = selectedScale === undefined ? new FormData(e.target) : null;

        let statementName = existingName;
        let statementDescription = existingDescription;
        let statementScale = selectedScale;

        if (updateStatementDescription) {
            statementDescription = formData.get('statement_description');
        } else if (updateStatementName) {
            statementName = formData.get('statement_name');
        } else if (!existingName && !existingDescription) {
            // Creating a new statement
            statementName = formData.get('statement_name');
            statementDescription = formData.get('statement_description');
            statementScale = 1;
        }

        try {
            if (existingName && existingDescription && selectedScale !== undefined) {
                // Updating scale
                await api.put(`/api/statement/update/${id}/`, {
                    statement_name: statementName,
                    statement_description: statementDescription,
                    scales_id_scales: statementScale,
                });

                setSuccess("Scale updated successfully");

            } else if (existingName && !existingDescription) {
                // Updating name or description only
                await api.put(`/api/statement/update/${id}/`, {
                    statement_name: statementName,
                    statement_description: statementDescription,
                });

                setSuccess("Statement updated successfully");

            } else {
                // Creating new statement
                await api.post(`/api/statement/create/${id}/`, {
                    statement_name: statementName,
                    statement_description: statementDescription,
                    scales_id_scales: statementScale,
                    dimensions_id_dimensions: id,
                });

                setSuccess("Statement created successfully");
            }

            setEditing(false);
            setEditingStatementName(false);
            setEditingStatementDescription(false);
            setUpdateStatementName(false);
            setUpdateStatementDescription(false);
            setError('');
            setTimeout(() => setSuccess(''), 2000);

        } catch (error) {
            console.error(error);
            setError("An error occurred while saving the statement.");
        }
    };


    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto', minHeight: 'calc(100vh - 20vh)' }}>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <SurveyAdminInfo surveyName={surveyName} surveyDescription={surveyDescription} setSurveyDescription={setSurveyDescription} surveyCreatedBy={surveyCreatedBy} surveyCreationTime={surveyCreationTime} surveyModifiedBy={surveyModifiedBy} surveyLastModifiedByDate={surveyLastModifiedByDate} editingDescription={editingDescription} setEditingDescription={setEditingDescription} handleSurveySubmit={handleSurveySubmit} />
                )}
            </div>
            <div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
            <h2 className='mt-5'>Dimensions and Statements</h2>
            <p className="my-3">
                <HelpOutlineIcon /> Click on a <b>dimension name</b> to show the list of its statements.
            </p>
            <p className="my-3">
                <HelpOutlineIcon /> Double click on the <b>dimension short description</b>, <b>dimension description</b>, <b>statement name</b> or <b>statement description</b> to edit them.
            </p>
            <p className="mb-3">
                <HelpOutlineIcon /> Select another scale from the <b>scales list</b> to change the scale associated to that statement.
            </p>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <SurveyAdminDimensions allDimensions={allDimensions} editing={editing} setEditing={setEditing} isShowing={isShowing} setIsShowing={setIsShowing} setUpdateDimensionShortDescription={setUpdateDimensionShortDescription} editingDimensionShortDescription={editingDimensionShortDescription} setEditingDimensionShortDescription={setEditingDimensionShortDescription} setUpdateDimensionDescription={setUpdateDimensionDescription} editingDimensionDescription={editingDimensionDescription} setEditingDimensionDescription={setEditingDimensionDescription} handleDimensionSubmit={handleDimensionSubmit} editingDimensionName={editingDimensionName} setEditingDimensionName={setEditingDimensionName} allScales={allScales} editingStatementDescription={editingStatementDescription} setEditingStatementDescription={setEditingStatementDescription} editingStatementName={editingStatementName} setEditingStatementName={setEditingStatementName}
                        setUpdateStatementDescription={setUpdateStatementDescription} setUpdateStatementName={setUpdateStatementName} handleStatementSubmit={handleStatementSubmit} addStatement={addStatement} setAddStatement={setAddStatement} currentDimensionForStatement={currentDimensionForStatement} setCurrentDimensionForStatement={setCurrentDimensionForStatement} dialogRef={dialogRef} />
                )}
            </div>
            <div className='mt-3 mb-5'>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditing(true); }}>Add New Dimension</button>
            </div>
            {editing ? (
                <SurveyDimensionDialog allDimensions={allDimensions} dialogRef={dialogRef} setEditing={setEditing} id={id} handleDimensionSubmit={handleDimensionSubmit}
                />) : null}
        </div>
    )
}

export default SurveyAdmin;
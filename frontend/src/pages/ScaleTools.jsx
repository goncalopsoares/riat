import { useEffect, useState, useRef, use } from 'react';
import api from '../api';
import ScaleAdmin from '../components/ScaleAdmin';
import EditScaleDialog from '../components/EditScaleDialog';

const ScaleTools = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const dialogRef = useRef(null);

    const [allScales, setAllScales] = useState([]);
    const [scaleName, setScaleName] = useState('');
    const [scaleLevels, setScaleLevels] = useState('');
    const [scaleLabels, setScaleLabels] = useState('');

    const [scaleId, setScaleId] = useState('');
    const [scaleNameEdit, setScaleNameEdit] = useState('');
    const [scaleLevelsEdit, setScaleLevelsEdit] = useState('');
    const [scaleLabelsEdit, setScaleLabelsEdit] = useState('');

    const [numberInputs, setNumberInputs] = useState([]);
    const [labelsArray, setLabelsArray] = useState([]);

    useEffect(() => {
        console.log(labelsArray);
    }, [labelsArray]);

    useEffect(() => {
        console.log('scaleLabels', scaleLabels);
    }, [scaleLabels]);

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

    const getSingleScale = async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/scale/get/${id}/`);
            setScaleNameEdit(response.data[0].scale_name);
            setScaleLevelsEdit(response.data[0].scale_levels);
            setScaleLabelsEdit(response.data[0].scale_labels);
            console.log(response.data[0]);
        } catch (error) {
            alert(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleScaleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const isEditMode = scaleId && scaleId !== '';
        const name = isEditMode ? scaleNameEdit : scaleName;
        const levels = isEditMode ? scaleLevelsEdit : scaleLevels;
        const labels = isEditMode ? scaleLabelsEdit : scaleLabels;

        if (!name || !levels || labelsArray.length < numberInputs.length || labelsArray.some(label => label.trim() === '')) {
            setError("Please make sure all fields are filled in correctly before submitting.");
            setLoading(false);
            return;
        }

        const stringData = labelsArray.toString();
        setScaleLabels(stringData);

        try {
            if (isEditMode) {
                await api.put(`/api/scale/update/${scaleId}/`, { scale_name: name, scale_levels: levels, scale_labels: stringData });
                setSuccess('Scale updated successfully!');
            } else {
                await api.post('/api/scale/create/', { scale_name: name, scale_levels: levels, scale_labels: stringData });
                setSuccess('Scale created successfully!');
            }

            resetForm();
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    const resetForm = () => {
        setScaleId('');
        setScaleName('');
        setScaleLevels('');
        setScaleLabels('');
        setScaleNameEdit('');
        setScaleLevelsEdit('');
        setScaleLabelsEdit('');
        setLabelsArray([]);
    };

    return (
        <>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Scale Name</th>
                                <th>Scale Levels</th>
                                <th>Scale Labels</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allScales.map((scale) => (
                                <tr key={scale.id_scales}>
                                    <td>{scale.scale_name}</td>
                                    <td>{scale.scale_levels}</td>
                                    <td>{scale.scale_labels}</td>
                                    <td><button onClick={(e) => {
                                        setScaleId(scale.id_scales);
                                        getSingleScale(scale.id_scales);
                                    }}>Edit scale</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table >
                )}
            </div >
            <ScaleAdmin
                scaleName={scaleName}
                setScaleName={setScaleName}
                scaleLevels={scaleLevels}
                setScaleLevels={setScaleLevels}
                scaleLabels={scaleLabels}
                setScaleLabels={setScaleLabels}
                setNumberInputs={setNumberInputs}
                setLabelsArray={setLabelsArray}
            />
            {scaleId && scaleNameEdit && scaleLevelsEdit && scaleLabelsEdit ? (
                <EditScaleDialog
                    dialogRef={dialogRef}
                    setScaleId={setScaleId}
                    scaleName={scaleNameEdit}
                    setScaleName={setScaleNameEdit}
                    scaleLevels={scaleLevelsEdit}
                    setScaleLevels={setScaleLevelsEdit}
                    scaleLabels={scaleLabelsEdit}
                    setNumberInputs={setNumberInputs}
                    setLabelsArray={setLabelsArray}
                    handleScaleSubmit={handleScaleSubmit}
                />
            ) : null}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button onClick={handleScaleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit "}
            </button>
        </>
    );
};

export default ScaleTools;
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
        console.log('scaleId', scaleId);
    }, [scaleId]);

    useEffect(() => {
        console.log(labelsArray);
    }, [labelsArray]);

    useEffect(() => {
        console.log('scalename', scaleName);
    }, [scaleName]);

    useEffect(() => {
        console.log('scaleLevels', scaleLevels);
    }, [scaleLevels]);

    useEffect(() => {
        console.log('numberinputs', numberInputs);
    }, [numberInputs]);

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
        setLoading(true)
        e.preventDefault();

        if (scaleId && scaleId !== '') {

            if (scaleNameEdit === '' || scaleLevelsEdit === '' || labelsArray.length < numberInputs.length || labelsArray.some(label => label.trim() === '')) {
                setError("Please make sure all fields are filled in correctly before submitting.");
                setLoading(false);
                return;

            } else {

                const stringData = labelsArray.toString();

                setScaleLabels(stringData);

            }

            setError('');

            try {
                await api.put(`/api/scale/update/${scaleId}/`, { scale_name: scaleNameEdit, scale_levels: scaleLevelsEdit, scale_labels: scaleLabelsEdit });
                setSuccess('Scale updated successfully!');
                setScaleId('');
                setScaleNameEdit('');
                setScaleLevelsEdit('');
                setScaleLabelsEdit('');

                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setLoading(false);
            }

            return;

        } else {

            if (scaleName === '' || scaleLevels === '' || labelsArray.length < numberInputs.length || labelsArray.some(label => label.trim() === '')) {
                setError("11 Please make sure all fields are filled in correctly before submitting.");
                setLoading(false);
                return;

            } else {

                const stringData = labelsArray.toString();

                setScaleLabels(stringData);

            }

            setError('');

            try {

                await api.post('/api/scale/create/', { scale_name: scaleName, scale_levels: scaleLevels, scale_labels: scaleLabels });

                setSuccess('Scale created successfully!');
                setScaleName('');
                setScaleLevels('');

                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } catch (error) {
                alert(error);
                console.error(error);

            } finally {
                setLoading(false);
            }
        }
    }

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
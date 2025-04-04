import { use, useEffect, useState } from 'react';
import api from '../api';
import ScaleAdmin from '../components/ScaleAdmin';

const ScaleTools = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [allScales, setAllScales] = useState([]);
    const [scaleName, setScaleName] = useState('');
    const [scaleLevels, setScaleLevels] = useState('');
    const [scaleLabels, setScaleLabels] = useState('');

    const [labelsArray, setLabelsArray] = useState([]);

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

    const numberInputs = Array.from({ length: scaleLevels }, (_, i) => (
        <input
            key={i}
            className='login-form-input'
            type='text'
            placeholder={`Insert label for scale level ${i + 1}`}
            onBlur={(e) => setLabelsArray(prev => {
                const newLabels = [...prev];
                newLabels[i] = e.target.value;
                return newLabels;
            })}
        />
    ));

    const handleScaleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (scaleName === '' || scaleLevels === '' || labelsArray.length < numberInputs.length || labelsArray.some(label => label.trim() === '')) {
            setError("Input fields cannot be empty");
            setLoading(false);
            return;

        } else {

            const stringData = labelsArray.toString();

            setScaleLabels(stringData);

            console.log(scaleLabels);

        }

        setError('');

        try {

            const response = await api.post('/api/scale/create/', { scale_name: scaleName, scale_levels: scaleLevels, scale_labels: scaleLabels });

            setSuccess('Scale criada/alterada com sucesso');

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

    return (
        <>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {allScales.map((scale) => (
                            <li key={scale.id_scales}>
                                {scale.scale_name}
                                <p>{scale.scale_levels}</p>
                                <p>{scale.scale_labels}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ScaleAdmin
                scaleName={scaleName}
                setScaleName={setScaleName}
                scaleLevels={scaleLevels}
                setScaleLevels={setScaleLevels}
                scaleLabels={scaleLabels}
                setScaleLabels={setScaleLabels}
                setLabelsArray={setLabelsArray}
                numberInputs={numberInputs}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}> {success} </p>}
            <button onClick={handleScaleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit "}
            </button>
        </>
    );
};

export default ScaleTools;
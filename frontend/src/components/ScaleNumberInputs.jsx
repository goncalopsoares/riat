import { useEffect } from "react";

const ScaleNumberInputs = ({ scaleLevels, scaleLabels, setLabelsArray }) => {

    useEffect(() => {
        if (scaleLabels) {
            setLabelsArray(scaleLabels.split(','));
        }
    }, [scaleLabels, setLabelsArray]);

    const numberInputs = Array.from({ length: scaleLevels }, (_, i) => (
        <input
            key={i}
            className='form-input my-2'
            type='text'
            placeholder={`Insert label for scale level ${i + 1}`}
            onBlur={(e) => {
                if (scaleLabels === '') {
                    setLabelsArray((prev) => {
                        const newLabels = [...prev];
                        newLabels[i] = e.target.value;
                        return newLabels;
                    });
                }
            }}
            defaultValue={scaleLabels ? scaleLabels.split(',')[i] : ''}
        />
    ));

    return (
        <div className='scale-labels-inputs'>
            {numberInputs}
        </div>
    );
}

export default ScaleNumberInputs;
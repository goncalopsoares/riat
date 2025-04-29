
import { useEffect } from 'react';
import ScaleNumberInputs from './ScaleNumberInputs';

const EditScaleDialog = ({ dialogRef, setScaleId, scaleName, setScaleName, scaleLevels, setScaleLevels, scaleLabels, setNumberInputs, setLabelsArray, handleScaleSubmit }) => {

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog ref={dialogRef} className='dialog'>
            <button className='dialog-close' onClick={() => setScaleId(null)}>Close</button>
            <h1>Editing {scaleName}</h1>
            <form method="dialog" className="dialog-form" onSubmit={(e) => {
                e.preventDefault();
                handleScaleSubmit(e);
                setScaleId(null);

            }}>
                <input
                    className='login-form-input'
                    type='text'
                    placeholder='Insert the name of the scale'
                    value={scaleName}
                    onChange={(e) => setScaleName(e.target.value)}
                >
                </input>
                <input
                    className='login-form-input'
                    type='text'
                    placeholder='Insert the number of levels of the scale'
                    value={scaleLevels}
                    onChange={(e) => { setScaleLevels(e.target.value); setNumberInputs(e.target.value); }}
                >
                </input>
                <ScaleNumberInputs scaleLevels={scaleLevels} scaleLabels={scaleLabels} setLabelsArray={setLabelsArray} />
                <button type='submit' className='dialog-submit'>Submit</button>
            </form>
        </dialog>
    )
}

export default EditScaleDialog;
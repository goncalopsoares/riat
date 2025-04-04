import { useEffect } from 'react';

const SurveyDimensionDialog = ({ dialogRef, setEditing, dimension, handleDimensionSubmit }) => {

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog className="dialog" ref={dialogRef}>
            <button onClick={() => { setEditing(false); }}>Close</button>
            <form method="dialog" className="dialog-form" onSubmit={(e) => { 
                e.preventDefault(); 
                handleDimensionSubmit(e); 
            }}>
                <h2>{dimension === null ? "Add New Dimension" : "Edit Dimension"}</h2>
                <label htmlFor="dimension_name">Dimension Name</label>
                <textarea id="dimension_name" name="dimension_name" defaultValue={dimension !== null ? dimension.dimension_name : ''} required></textarea>

                <label htmlFor="dimension_description">Dimension Description</label>
                <textarea id="dimension_description" name="dimension_description" defaultValue={dimension !== null ? dimension.dimension_description : ''} required></textarea>

                <label htmlFor="dimension_phase">Dimension Phase</label>
                <input type="number" id="dimension_phase" name="dimension_phase" defaultValue={dimension !== null ? dimension.dimension_phase : 1} required />

                <button type="submit">Submit</button>
            </form>
        </dialog>
    );
}

export default SurveyDimensionDialog;
import { useEffect } from 'react';

const SurveyDimensionDialog = ({ allDimensions, dialogRef, setEditing, id, handleDimensionSubmit }) => {

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog className="dialog" ref={dialogRef}>
            <button onClick={() => setEditing(false)}>Close</button>
            <form method="dialog" className="dialog-form" onSubmit={(e) => {
                e.preventDefault();
                handleDimensionSubmit(e, id);
            }}>
                <h2>Add New Dimension</h2>

                <label htmlFor="dimension_name">Dimension Name</label>
                <textarea id="dimension_name" name="dimension_name" required></textarea>

                <label htmlFor="dimension_short_description">Dimension Short Description</label>
                <textarea id="dimension_short_description" name="dimension_short_description" required></textarea>

                <label htmlFor="dimension_description">Dimension Description</label>
                <textarea id="dimension_description" name="dimension_description" required></textarea>

                <label htmlFor="parent_dimension">Parent Dimension (optional)</label>
                <select id="parent_dimension" name="parent_dimension">
                    <option value="">None</option>
                    {allDimensions.map((dim) => (
                        <option key={dim.id_dimensions} value={dim.id_dimensions}>
                            {dim.dimension_name}
                        </option>
                    ))}
                </select>

                <button type="submit">Submit</button>
            </form>
        </dialog>
    );
}

export default SurveyDimensionDialog;
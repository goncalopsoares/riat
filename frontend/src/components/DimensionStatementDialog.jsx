import { useEffect } from 'react';

const DimensionStatementDialog = ({ dialogRef, setAddStatement, id, handleStatementSubmit, allScales }) => {

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog className="dialog" ref={dialogRef}>
            <form
                method="dialog"
                className="dialog-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleStatementSubmit(e, id); // id é o id da dimensão ou outro identificador relevante para criação
                    setAddStatement(false);
                }}
            >
                <input
                    name="statement_name"
                    type="text"
                    placeholder="Statement Name"
                    required
                    className="form-control mb-2"
                />
                <textarea
                    name="statement_description"
                    placeholder="Statement Description"
                    className="form-control mb-2"
                />
                <select
                    name="scales_id_scales"
                    defaultValue=""
                    required
                    className="form-control mb-2"
                >
                    <option value="" disabled>Select scale</option>
                    {allScales.map(scale => (
                        <option key={scale.id_scales} value={scale.id_scales}>
                            {scale.scale_name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary">Create Statement</button>
            </form>
        </dialog>
    );
}

export default DimensionStatementDialog;
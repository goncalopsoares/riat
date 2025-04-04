import { useEffect } from 'react';

const DimensionStatementDialog = ({ dialogRef, setAddStatement, id, handleStatementSubmit }) => {

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog className="dialog" ref={dialogRef}>
            <button onClick={() => { setAddStatement(false); }}>Close</button>
            <form method="dialog" className="dialog-form" onSubmit={(e) => {
                e.preventDefault();
                handleStatementSubmit(e, id);
                setAddStatement(false);
            }}>
                <h2>Add New Statement</h2>
                <label htmlFor="statement_name">Statement Name</label>
                <textarea id="statement_name" name="statement_name" required></textarea>

                <label htmlFor="statement_description">Statement Description</label>
                <textarea id="statement_description" name="statement_description" required></textarea>

                <button type="submit">Submit</button>
            </form>
        </dialog>
    );
}

export default DimensionStatementDialog;
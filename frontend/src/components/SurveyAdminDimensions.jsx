import { useState } from "react";
import SurveyAdminStatements from "./SurveyAdminStatements";
import DimensionStatementDialog from './DimensionStatementDialog';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteDimensionDialog from '../components/DeleteDimensionDialog';


const SurveyAdminDimensions = ({ allDimensions, isShowing, setIsShowing, editingDimensionShortDescription, setEditingDimensionShortDescription, setUpdateDimensionShortDescription, editingDimensionDescription, setEditingDimensionDescription, handleDimensionSubmit, setUpdateDimensionDescription, editingDimensionName, setEditingDimensionName, allScales, editingStatementName, setEditingStatementName, editingStatementDescription, setEditingStatementDescription, setUpdateStatementDescription, setUpdateStatementName, handleStatementSubmit, addStatement, setAddStatement, dialogRef, currentDimensionForStatement, setCurrentDimensionForStatement, handleDeleteDimension }) => {

    const [deletingDimension, setDeletingDimension] = useState(false);

    return (
        <>
            <div className="container my-4">
                <ul className="list-group">
                    {allDimensions.map((dimension) => (
                        <li key={dimension.id_dimensions} className="list-group-item">
                            {editingDimensionName === dimension.id_dimensions ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleDimensionSubmit(
                                            e,
                                            dimension.id_dimensions,
                                            {
                                                dimension_description: dimension.dimension_description,
                                                dimension_short_description: dimension.dimension_short_description,
                                            },
                                            'name'
                                        );
                                        setEditingDimensionName(false);
                                    }}
                                    className="d-flex align-items-center"
                                >
                                    <input
                                        name="dimension_name"
                                        type="text"
                                        defaultValue={dimension.dimension_name}
                                        autoFocus
                                        className="form-control me-2"
                                    />
                                    <button type="submit" className="btn btn-sm btn-primary">
                                        Save
                                    </button>
                                </form>
                            ) : (
                                <div className="d-flex flex-direction-row justify-content-between align-items-center">
                                    <h2
                                        className="h2 my-3"
                                        onClick={() =>
                                            setIsShowing(
                                                isShowing === dimension.id_dimensions ? false : dimension.id_dimensions
                                            )
                                        }
                                        onDoubleClick={() => setEditingDimensionName(dimension.id_dimensions)}
                                        style={{
                                            cursor: 'pointer',
                                            color: isShowing === dimension.id_dimensions ? '#008bbe' : undefined
                                        }}
                                    >
                                        <div className="tooltip-wrapper">{dimension.dimension_name}<span className="tooltip-text" style={{ bottom: '100%' }}>Double click to edit</span></div> {isShowing === dimension.id_dimensions ? <ArrowDropUpIcon style={{ fontSize: '3rem' }} /> : <ArrowDropDownIcon style={{ fontSize: '3rem' }} />}
                                    </h2>
                                    {isShowing === dimension.id_dimensions && (
                                        <button onClick={() => setDeletingDimension(true)} className="btn btn-sm btn-danger" style={{ height: '2.5rem' }}>Delete</button>)
                                    }
                                </div>
                            )}

                            {isShowing === dimension.id_dimensions && (
                                <div className="mt-3">
                                    {editingDimensionShortDescription ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleDimensionSubmit(
                                                    e,
                                                    dimension.id_dimensions,
                                                    {
                                                        dimension_name: dimension.dimension_name,
                                                        dimension_description: dimension.dimension_description,
                                                        dimension_short_description: dimension.dimension_short_description,
                                                    },
                                                    'short_description'
                                                )
                                            }
                                            className="mb-3"
                                        >
                                            <textarea
                                                name="dimension_short_description"
                                                defaultValue={dimension.dimension_short_description}
                                                autoFocus
                                                className="form-control mb-2"
                                                rows={2}
                                            />
                                            <button type="submit" className="btn btn-sm btn-primary">
                                                Save
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="tooltip-wrapper w-100">
                                            <p
                                                className="mb-2 fs-4"
                                                onDoubleClick={() => {
                                                    setEditingDimensionShortDescription(true);
                                                    setUpdateDimensionShortDescription(true);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {dimension.dimension_short_description}
                                            </p>
                                            <span className="tooltip-text" style={{ bottom: '100%' }}>Double click to edit</span>
                                        </div>
                                    )}

                                    {editingDimensionDescription ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleDimensionSubmit(
                                                    e,
                                                    dimension.id_dimensions,
                                                    {
                                                        dimension_name: dimension.dimension_name,
                                                        dimension_description: dimension.dimension_description,
                                                        dimension_short_description: dimension.dimension_short_description,
                                                    },
                                                    'description'
                                                )
                                            }
                                            className="mb-3"
                                        >
                                            <textarea
                                                name="dimension_description"
                                                defaultValue={dimension.dimension_description}
                                                autoFocus
                                                className="form-control mb-2"
                                                rows={4}
                                            />
                                            <button type="submit" className="btn btn-sm btn-primary">
                                                Save
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="tooltip-wrapper w-100">
                                            <p
                                                onDoubleClick={() => {
                                                    setEditingDimensionDescription(true);
                                                    setUpdateDimensionDescription(true);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                                className="mb-0"
                                            >
                                                {dimension.dimension_description}
                                            </p>
                                            <span className="tooltip-text" style={{ bottom: '100%' }}>Double click to edit</span>
                                        </div>
                                    )}
                                    {isShowing === dimension.id_dimensions && (
                                        <SurveyAdminStatements
                                            statements={dimension.statements}
                                            allScales={allScales}
                                            handleDimensionSubmit={handleDimensionSubmit}
                                            editingStatementName={editingStatementName}
                                            setEditingStatementName={setEditingStatementName}
                                            editingStatementDescription={editingStatementDescription}
                                            setEditingStatementDescription={setEditingStatementDescription}
                                            setUpdateStatementDescription={setUpdateStatementDescription}
                                            handleStatementSubmit={handleStatementSubmit}
                                            setUpdateStatementName={setUpdateStatementName}
                                        />
                                    )}
                                    <div className="d-flex gap-2 my-4 ms-3">
                                        <button
                                            className="btn btn-primary btn-sm fs-5"
                                            onClick={() => {
                                                setAddStatement(true);
                                                setCurrentDimensionForStatement(dimension.id_dimensions);
                                            }}
                                        >
                                            Add New Statement
                                        </button>
                                    </div>
                                    {deletingDimension ? (
                                        <DeleteDimensionDialog setDeletingDimension={setDeletingDimension} id={dimension.id_dimensions} handleDeleteDimension={handleDeleteDimension} dialogRef={dialogRef} dimensionName={dimension.dimension_name} />) : null
                                    }
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {addStatement && (
                <DimensionStatementDialog
                    dialogRef={dialogRef}
                    setAddStatement={setAddStatement}
                    id={currentDimensionForStatement}
                    handleStatementSubmit={handleStatementSubmit}
                    allScales={allScales}
                />
            )}
        </>
    );
}

export default SurveyAdminDimensions;
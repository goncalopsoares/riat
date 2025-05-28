import React, { useEffect, useState } from 'react';
import api from '../api';

const RecommendationTools = () => {
    const [surveyGroups, setSurveyGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingStates, setEditingStates] = useState({}); // { id: { isEditing: bool, text: string } }

    useEffect(() => {
        const getAllRecommendations = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/recommendation/get/');
                setSurveyGroups(response.data);
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getAllRecommendations();
    }, []);

    const handleEdit = (id, currentText) => {
        setEditingStates(prev => ({
            ...prev,
            [id]: { isEditing: true, text: currentText }
        }));
    };

    const handleChange = (id, value) => {
        setEditingStates(prev => ({
            ...prev,
            [id]: { ...prev[id], text: value }
        }));
    };

    const handleSave = async (id) => {
        if (!editingStates[id]) return;

        const { text } = editingStates[id];

        setLoading(true);

        try {
            await api.patch(`/api/recommendation/update/${id}/`, {
                overall_recommendations_description: text
            });

            // Update local state
            setSurveyGroups(prev =>
                prev.map(group => ({
                    ...group,
                    recommendations: group.recommendations.map(rec =>
                        rec.id_overall_recommendations === id
                            ? { ...rec, recommendation_description: text }
                            : rec
                    )
                }))
            );

            setEditingStates(prev => ({ ...prev, [id]: { isEditing: false, text: '' } }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id) => {
        setEditingStates(prev => ({ ...prev, [id]: { isEditing: false, text: '' } }));
    };

    const getEditingText = (id, original) => {
        const state = editingStates[id];
        return state?.isEditing ? state.text : original;
    };

    return (
        <div className="container mt-5" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)', overflowX: 'auto', minHeight: 'calc(100vh - 20vh)' }}>
            <h1 className='mb-5 ms-3'>Recommendations</h1>
            {loading && <p>Loading...</p>}
            {surveyGroups.map(group => (
                <div key={group.survey_name} className='ms-3' style={{ marginBottom: '2rem' }}>
                    <h4 className='mt-5'>{group.survey_name}</h4>
                    <ul>
                        {group.recommendations.map(rec => {
                            const id = rec.id_overall_recommendations;
                            const isEditing = editingStates[id]?.isEditing;
                            const text = getEditingText(id, rec.recommendation_description);

                            return (
                                <li key={id} className='my-4'>
                                    {isEditing ? (
                                        <>
                                            <p><b>Level: {rec.recommendation_name}</b></p>
                                            <textarea
                                                value={text}
                                                className='form-input'
                                                onChange={(e) => handleChange(id, e.target.value)}
                                            />
                                            <button className="btn btn-primary me-3" onClick={() => handleSave(id)}>Save</button>
                                            <button className='btn btn-secondary' onClick={() => handleCancel(id)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <p><b>Level: {rec.recommendation_name}</b></p>
                                            <div className='d-flex flex-column'>
                                                <span>{rec.recommendation_description}</span>
                                                <button onClick={() => handleEdit(id, rec.recommendation_description)} className='btn btn-primary mt-3' style={{ width: '5rem' }}>Edit</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default RecommendationTools;

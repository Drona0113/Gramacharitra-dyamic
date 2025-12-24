import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AddVillage.css';

const AddVillage = () => {
    const [formData, setFormData] = useState({
        name: '',
        district: '',
        description: '',
        image: '',
        sections: {
            nameOrigin: {
                title: '',
                content: '',
                part1: { title: '', description: '' },
                part2: { title: '', description: '' },
                part3: { title: '', description: '' },
            },
            history: {
                timeline: [
                    { era: '', description: '' }
                ]
            },
            geography: {
                features: [
                    { title: '', description: '', image: '' }
                ]
            },
            temples: [ { name: '', description: '', image: '' } ],
            festivals: [ { name: '', description: '', image: '' } ],
            economy: {
                agriculture: '',
                livelihoods: '',
                image: ''
            },
            profile: {
                population: '',
                languages: '',
                literacy: '',
                occupation: '',
                nearestTown: '',
                transport: '',
                pinCode: ''
            },
            facts: [ { title: '', description: '' } ]
        },
        location: {
            type: 'Point',
            coordinates: [0, 0] // [lng, lat]
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helpers for nested updates
    const updateSection = (path, value) => {
        setFormData(prev => {
            const updated = { ...prev };
            let ref = updated;
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                ref[key] = Array.isArray(ref[key]) ? [...ref[key]] : { ...ref[key] };
                ref = ref[key];
            }
            ref[path[path.length - 1]] = value;
            return updated;
        });
    };

    const addArrayItem = (path, template) => {
        setFormData(prev => {
            const updated = { ...prev };
            let ref = updated;
            for (let i = 0; i < path.length; i++) {
                const key = path[i];
                if (i === path.length - 1) {
                    ref[key] = [ ...ref[key], template ];
                } else {
                    ref[key] = Array.isArray(ref[key]) ? [...ref[key]] : { ...ref[key] };
                    ref = ref[key];
                }
            }
            return updated;
        });
    };

    const removeArrayItem = (path, index) => {
        setFormData(prev => {
            const updated = { ...prev };
            let ref = updated;
            for (let i = 0; i < path.length; i++) {
                const key = path[i];
                if (i === path.length - 1) {
                    ref[key] = ref[key].filter((_, idx) => idx !== index);
                } else {
                    ref[key] = Array.isArray(ref[key]) ? [...ref[key]] : { ...ref[key] };
                    ref = ref[key];
                }
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.district || !formData.description || !formData.image) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/villages', formData);
            alert('Village added successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            setError('Failed to add village: ' + (error.response?.data?.message || error.message));
            console.error('Error adding village:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-village-container">
            <div className="add-village-header">
                <button 
                    className="back-btn"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    ← Back to Dashboard
                </button>
                <h1>Add New Village</h1>
            </div>

            <form onSubmit={handleSubmit} className="add-village-form">
                <div className="form-section">
                    <h2>Village Information</h2>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Village Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter village name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="district">District *</label>
                        <input
                            type="text"
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="Enter district name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter village description"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL *</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="Enter image URL (e.g., https://...)"
                            required
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="form-section">
                    <h2>Location (Coordinates)</h2>
                    <div className="form-group">
                        <label>Longitude (X)</label>
                        <input
                            type="number"
                            step="any"
                            value={formData.location.coordinates[0]}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value || '0');
                                updateSection(['location', 'coordinates'], [val, formData.location.coordinates[1]]);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Latitude (Y)</label>
                        <input
                            type="number"
                            step="any"
                            value={formData.location.coordinates[1]}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value || '0');
                                updateSection(['location', 'coordinates'], [formData.location.coordinates[0], val]);
                            }}
                        />
                    </div>
                </div>

                {/* Name Origin */}
                <div className="form-section">
                    <h2>Name Origin</h2>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.sections.nameOrigin.title}
                            onChange={(e) => updateSection(['sections', 'nameOrigin', 'title'], e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            rows="3"
                            value={formData.sections.nameOrigin.content}
                            onChange={(e) => updateSection(['sections', 'nameOrigin', 'content'], e.target.value)}
                        />
                    </div>
                    {[1,2,3].map((n) => (
                        <div className="array-item" key={n}>
                            <div className="array-item-header"><strong>Part {n}</strong></div>
                            <div className="form-group">
                                <label>Part {n} Title</label>
                                <input
                                    type="text"
                                    value={formData.sections.nameOrigin[`part${n}`].title}
                                    onChange={(e) => updateSection(['sections','nameOrigin',`part${n}`,'title'], e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Part {n} Description</label>
                                <textarea
                                    rows="2"
                                    value={formData.sections.nameOrigin[`part${n}`].description}
                                    onChange={(e) => updateSection(['sections','nameOrigin',`part${n}`,'description'], e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Timeline */}
                <div className="form-section">
                    <h2>History Timeline</h2>
                    {formData.sections.history.timeline.map((item, idx) => (
                        <div className="array-item" key={idx}>
                            <div className="array-item-header">
                                <strong>Entry {idx + 1}</strong>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem(['sections','history','timeline'], idx)}>Remove</button>
                            </div>
                            <div className="form-group">
                                <label>Era</label>
                                <input
                                    type="text"
                                    value={item.era}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.history.timeline];
                                        updated[idx] = { ...updated[idx], era: e.target.value };
                                        updateSection(['sections','history','timeline'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={item.description}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.history.timeline];
                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                        updateSection(['sections','history','timeline'], updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem(['sections','history','timeline'], { era: '', description: '' })}>+ Add Timeline Entry</button>
                </div>

                {/* Geography Features */}
                <div className="form-section">
                    <h2>Natural Treasures (Geography)</h2>
                    {formData.sections.geography.features.map((feature, idx) => (
                        <div className="array-item" key={idx}>
                            <div className="array-item-header">
                                <strong>Feature {idx + 1}</strong>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem(['sections','geography','features'], idx)}>Remove</button>
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.geography.features];
                                        updated[idx] = { ...updated[idx], title: e.target.value };
                                        updateSection(['sections','geography','features'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={feature.description}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.geography.features];
                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                        updateSection(['sections','geography','features'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    value={feature.image}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.geography.features];
                                        updated[idx] = { ...updated[idx], image: e.target.value };
                                        updateSection(['sections','geography','features'], updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem(['sections','geography','features'], { title: '', description: '', image: '' })}>+ Add Feature</button>
                </div>

                {/* Sacred Sites (Temples) */}
                <div className="form-section">
                    <h2>Sacred Sites (Temples)</h2>
                    {formData.sections.temples.map((temple, idx) => (
                        <div className="array-item" key={idx}>
                            <div className="array-item-header">
                                <strong>Site {idx + 1}</strong>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem(['sections','temples'], idx)}>Remove</button>
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={temple.name}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.temples];
                                        updated[idx] = { ...updated[idx], name: e.target.value };
                                        updateSection(['sections','temples'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={temple.description}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.temples];
                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                        updateSection(['sections','temples'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    value={temple.image}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.temples];
                                        updated[idx] = { ...updated[idx], image: e.target.value };
                                        updateSection(['sections','temples'], updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem(['sections','temples'], { name: '', description: '', image: '' })}>+ Add Sacred Site</button>
                </div>

                {/* Festivals */}
                <div className="form-section">
                    <h2>Major Festivals</h2>
                    {formData.sections.festivals.map((festival, idx) => (
                        <div className="array-item" key={idx}>
                            <div className="array-item-header">
                                <strong>Festival {idx + 1}</strong>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem(['sections','festivals'], idx)}>Remove</button>
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={festival.name}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.festivals];
                                        updated[idx] = { ...updated[idx], name: e.target.value };
                                        updateSection(['sections','festivals'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={festival.description}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.festivals];
                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                        updateSection(['sections','festivals'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    value={festival.image}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.festivals];
                                        updated[idx] = { ...updated[idx], image: e.target.value };
                                        updateSection(['sections','festivals'], updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem(['sections','festivals'], { name: '', description: '', image: '' })}>+ Add Festival</button>
                </div>

                {/* Local Economy */}
                <div className="form-section">
                    <h2>Local Economy</h2>
                    <div className="form-group">
                        <label>Agriculture</label>
                        <textarea
                            rows="2"
                            value={formData.sections.economy.agriculture}
                            onChange={(e) => updateSection(['sections','economy','agriculture'], e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Livelihoods</label>
                        <textarea
                            rows="2"
                            value={formData.sections.economy.livelihoods}
                            onChange={(e) => updateSection(['sections','economy','livelihoods'], e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={formData.sections.economy.image}
                            onChange={(e) => updateSection(['sections','economy','image'], e.target.value)}
                        />
                    </div>
                </div>

                {/* Village Profile */}
                <div className="form-section">
                    <h2>Village Profile</h2>
                    <div className="form-group"><label>Population</label><input type="text" value={formData.sections.profile.population} onChange={(e)=>updateSection(['sections','profile','population'], e.target.value)} /></div>
                    <div className="form-group"><label>Languages</label><input type="text" value={formData.sections.profile.languages} onChange={(e)=>updateSection(['sections','profile','languages'], e.target.value)} /></div>
                    <div className="form-group"><label>Literacy</label><input type="text" value={formData.sections.profile.literacy} onChange={(e)=>updateSection(['sections','profile','literacy'], e.target.value)} /></div>
                    <div className="form-group"><label>Occupation</label><input type="text" value={formData.sections.profile.occupation} onChange={(e)=>updateSection(['sections','profile','occupation'], e.target.value)} /></div>
                    <div className="form-group"><label>Nearest Town</label><input type="text" value={formData.sections.profile.nearestTown} onChange={(e)=>updateSection(['sections','profile','nearestTown'], e.target.value)} /></div>
                    <div className="form-group"><label>Transport</label><input type="text" value={formData.sections.profile.transport} onChange={(e)=>updateSection(['sections','profile','transport'], e.target.value)} /></div>
                    <div className="form-group"><label>PIN Code</label><input type="text" value={formData.sections.profile.pinCode} onChange={(e)=>updateSection(['sections','profile','pinCode'], e.target.value)} /></div>
                </div>

                {/* Little-Known Facts */}
                <div className="form-section">
                    <h2>Little-Known Facts</h2>
                    {formData.sections.facts.map((fact, idx) => (
                        <div className="array-item" key={idx}>
                            <div className="array-item-header">
                                <strong>Fact {idx + 1}</strong>
                                <button type="button" className="remove-btn" onClick={() => removeArrayItem(['sections','facts'], idx)}>Remove</button>
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={fact.title}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.facts];
                                        updated[idx] = { ...updated[idx], title: e.target.value };
                                        updateSection(['sections','facts'], updated);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={fact.description}
                                    onChange={(e) => {
                                        const updated = [...formData.sections.facts];
                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                        updateSection(['sections','facts'], updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addArrayItem(['sections','facts'], { title: '', description: '' })}>+ Add Fact</button>
                </div>

                <div className="form-actions">
                    <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Adding Village...' : 'Add Village'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVillage;
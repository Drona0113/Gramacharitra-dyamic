import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const VillageForm = ({ village, onClose, onSave }) => {
  const initialForm = {
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
        part3: { title: '', description: '' }
      },
      history: {
        timeline: [{ era: '', description: '' }]
      },
      geography: {
        features: [{ title: '', description: '', image: '' }]
      },
      temples: [{ name: '', description: '', image: '' }],
      festivals: [{ name: '', description: '', image: '' }],
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
      facts: [{ title: '', description: '' }]
    },
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  };

  const [formData, setFormData] = useState(initialForm);

  const normalizeVillage = (v) => {
    if (!v) return initialForm;

    const sections = {
      ...initialForm.sections,
      ...(v.sections || {})
    };

    // Ensure arrays/objects that are expected exist
    sections.nameOrigin = {
      ...initialForm.sections.nameOrigin,
      ...(v.sections?.nameOrigin || {})
    };
    sections.history = {
      timeline: (v.sections?.history?.timeline && v.sections.history.timeline.length)
        ? v.sections.history.timeline
        : [...initialForm.sections.history.timeline]
    };
    sections.geography = {
      features: (v.sections?.geography?.features && v.sections.geography.features.length)
        ? v.sections.geography.features
        : [...initialForm.sections.geography.features]
    };
    sections.temples = (v.sections?.temples && v.sections.temples.length)
      ? v.sections.temples
      : [...initialForm.sections.temples];
    sections.festivals = (v.sections?.festivals && v.sections.festivals.length)
      ? v.sections.festivals
      : [...initialForm.sections.festivals];
    sections.facts = (v.sections?.facts && v.sections.facts.length)
      ? v.sections.facts
      : [...initialForm.sections.facts];
    sections.economy = {
      ...initialForm.sections.economy,
      ...(v.sections?.economy || {})
    };
    sections.profile = {
      ...initialForm.sections.profile,
      ...(v.sections?.profile || {})
    };

    const location = {
      type: v.location?.type || 'Point',
      coordinates: Array.isArray(v.location?.coordinates)
        ? [v.location.coordinates[0] ?? 0, v.location.coordinates[1] ?? 0]
        : [...initialForm.location.coordinates]
    };

    return {
      ...initialForm,
      ...v,
      sections,
      location
    };
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (village) {
      setFormData(prev => normalizeVillage(village));
    }
  }, [village]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    if (typeof value === 'object' && value !== null) {
      // If value is an object, merge it with the existing field
      setFormData(prevFormData => ({
        ...prevFormData,
        sections: {
          ...prevFormData.sections,
          [section]: {
            ...prevFormData.sections[section],
            [field]: {
              ...prevFormData.sections[section][field],
              ...value
            }
          }
        }
      }));
    } else {
      // If value is not an object, update directly
      setFormData(prevFormData => ({
        ...prevFormData,
        sections: {
          ...prevFormData.sections,
          [section]: {
            ...prevFormData.sections[section],
            [field]: value
          }
        }
      }));
    }
  };

  const handleDeepNestedChange = (section, subsection, field, value) => {
    setFormData(prevFormData => {
      // Ensure all nested objects exist before updating
      const sectionData = prevFormData.sections[section] || {};
      const subsectionData = sectionData[subsection] || {};
      
      return {
        ...prevFormData,
        sections: {
          ...prevFormData.sections,
          [section]: {
            ...sectionData,
            [subsection]: {
              ...subsectionData,
              [field]: value
            }
          }
        }
      };
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prevFormData => {
      const newArray = [...prevFormData.sections[section]];
      newArray[index][field] = value;
      return {
        ...prevFormData,
        sections: {
          ...prevFormData.sections,
          [section]: newArray
        }
      };
    });
  };

  const addArrayItem = (section) => {
    const newItem = section === 'history' 
      ? { era: '', description: '' }
      : section === 'geography' || section === 'temples' || section === 'festivals'
        ? { name: '', description: '', image: '' }
        : { title: '', description: '' };
    
    setFormData(prevFormData => ({
      ...prevFormData,
      sections: {
        ...prevFormData.sections,
        [section]: [...prevFormData.sections[section], newItem]
      }
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prevFormData => {
      const newArray = [...prevFormData.sections[section]];
      newArray.splice(index, 1);
      return {
        ...prevFormData,
        sections: {
          ...prevFormData.sections,
          [section]: newArray
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        location: {
          type: formData.location?.type || 'Point',
          coordinates: Array.isArray(formData.location?.coordinates)
            ? [formData.location.coordinates[0] ?? 0, formData.location.coordinates[1] ?? 0]
            : [0, 0]
        }
      };

      if (village) {
        await api.put(`/villages/${village._id}`, payload);
      } else {
        await api.post('/villages', payload);
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="village-form-container">
      <div className="form-header">
        <h2>{village ? 'Edit Village' : 'Add New Village'}</h2>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Village Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Name Origin</h3>
          <div className="form-group">
            <label htmlFor="nameOriginTitle">Title</label>
            <input
              type="text"
              id="nameOriginTitle"
              value={formData.sections.nameOrigin?.title || ''}
              onChange={(e) => handleNestedChange('nameOrigin', 'title', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nameOriginContent">Content</label>
            <textarea
              id="nameOriginContent"
              value={formData.sections.nameOrigin?.content || ''}
              onChange={(e) => handleNestedChange('nameOrigin', 'content', e.target.value)}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Part 1</label>
            <input
              type="text"
              placeholder="Title"
              value={formData.sections.nameOrigin?.part1?.title || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part1', 'title', e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={formData.sections.nameOrigin?.part1?.description || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part1', 'description', e.target.value)}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Part 2</label>
            <input
              type="text"
              placeholder="Title"
              value={formData.sections.nameOrigin?.part2?.title || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part2', 'title', e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={formData.sections.nameOrigin?.part2?.description || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part2', 'description', e.target.value)}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Part 3</label>
            <input
              type="text"
              placeholder="Title"
              value={formData.sections.nameOrigin?.part3?.title || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part3', 'title', e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={formData.sections.nameOrigin?.part3?.description || ''}
              onChange={(e) => handleDeepNestedChange('nameOrigin', 'part3', 'description', e.target.value)}
              rows="2"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3>History Timeline</h3>
          {(formData.sections.history?.timeline || []).map((item, index) => (
            <div key={index} className="array-item">
              <div className="array-item-header">
                <span>Timeline Item {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeArrayItem('history', index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Era"
                  value={item.era}
                  onChange={(e) => handleArrayChange('history', index, 'era', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('history', index, 'description', e.target.value)}
                  rows="2"
                ></textarea>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={() => addArrayItem('history')}
          >
            <i className="fas fa-plus"></i> Add Timeline Item
          </button>
        </div>
        
        <div className="form-section">
          <h3>Geography Features</h3>
          {(formData.sections.geography?.features || []).map((item, index) => (
            <div key={index} className="array-item">
              <div className="array-item-header">
                <span>Feature {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeArrayItem('geography', index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleArrayChange('geography', index, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('geography', index, 'description', e.target.value)}
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={item.image}
                  onChange={(e) => handleArrayChange('geography', index, 'image', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={() => addArrayItem('geography')}
          >
            <i className="fas fa-plus"></i> Add Feature
          </button>
        </div>
        
        <div className="form-section">
          <h3>Temples</h3>
          {(formData.sections.temples || []).map((item, index) => (
            <div key={index} className="array-item">
              <div className="array-item-header">
                <span>Temple {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeArrayItem('temples', index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => handleArrayChange('temples', index, 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('temples', index, 'description', e.target.value)}
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={item.image}
                  onChange={(e) => handleArrayChange('temples', index, 'image', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={() => addArrayItem('temples')}
          >
            <i className="fas fa-plus"></i> Add Temple
          </button>
        </div>
        
        <div className="form-section">
          <h3>Festivals</h3>
          {(formData.sections.festivals || []).map((item, index) => (
            <div key={index} className="array-item">
              <div className="array-item-header">
                <span>Festival {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeArrayItem('festivals', index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => handleArrayChange('festivals', index, 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('festivals', index, 'description', e.target.value)}
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={item.image}
                  onChange={(e) => handleArrayChange('festivals', index, 'image', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={() => addArrayItem('festivals')}
          >
            <i className="fas fa-plus"></i> Add Festival
          </button>
        </div>
        
        <div className="form-section">
          <h3>Economy</h3>
          <div className="form-group">
            <label htmlFor="agriculture">Agriculture</label>
            <textarea
              id="agriculture"
              value={formData.sections.economy?.agriculture || ''}
              onChange={(e) => handleNestedChange('economy', 'agriculture', e.target.value)}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="livelihoods">Livelihoods</label>
            <textarea
              id="livelihoods"
              value={formData.sections.economy?.livelihoods || ''}
              onChange={(e) => handleNestedChange('economy', 'livelihoods', e.target.value)}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="economyImage">Image URL</label>
            <input
              type="text"
              id="economyImage"
              value={formData.sections.economy?.image || ''}
              onChange={(e) => handleNestedChange('economy', 'image', e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Village Profile</h3>
          <div className="form-group">
            <label htmlFor="population">Population</label>
            <input
              type="text"
              id="population"
              value={formData.sections.profile?.population || ''}
              onChange={(e) => handleNestedChange('profile', 'population', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="languages">Languages</label>
            <input
              type="text"
              id="languages"
              value={formData.sections.profile?.languages || ''}
              onChange={(e) => handleNestedChange('profile', 'languages', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="literacy">Literacy</label>
            <input
              type="text"
              id="literacy"
              value={formData.sections.profile?.literacy || ''}
              onChange={(e) => handleNestedChange('profile', 'literacy', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              value={formData.sections.profile?.occupation || ''}
              onChange={(e) => handleNestedChange('profile', 'occupation', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nearestTown">Nearest Town</label>
            <input
              type="text"
              id="nearestTown"
              value={formData.sections.profile?.nearestTown || ''}
              onChange={(e) => handleNestedChange('profile', 'nearestTown', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="transport">Transport</label>
            <input
              type="text"
              id="transport"
              value={formData.sections.profile?.transport || ''}
              onChange={(e) => handleNestedChange('profile', 'transport', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pinCode">PIN Code</label>
            <input
              type="text"
              id="pinCode"
              value={formData.sections.profile?.pinCode || ''}
              onChange={(e) => handleNestedChange('profile', 'pinCode', e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Facts</h3>
          {(formData.sections.facts || []).map((item, index) => (
            <div key={index} className="array-item">
              <div className="array-item-header">
                <span>Fact {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeArrayItem('facts', index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleArrayChange('facts', index, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('facts', index, 'description', e.target.value)}
                  rows="2"
                ></textarea>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={() => addArrayItem('facts')}
          >
            <i className="fas fa-plus"></i> Add Fact
          </button>
        </div>
        
        <div className="form-section">
          <h3>Location</h3>
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              value={formData.location?.coordinates?.[0] ?? ''}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [parseFloat(e.target.value) || 0, formData.location?.coordinates?.[1] ?? 0]
                }
              })}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              value={formData.location?.coordinates?.[1] ?? ''}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [formData.location?.coordinates?.[0] ?? 0, parseFloat(e.target.value) || 0]
                }
              })}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Village'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VillageForm;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../services/api';
import './EditVillage.css';

const EditVillage = () => {
    const { villageId } = useParams();
    const navigate = useNavigate();
    const { admin } = useAdmin();
    const [village, setVillage] = useState({
        name: '',
        district: '',
        state: '',
        pincode: '',
        population: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVillage = async () => {
            try {
                const response = await api.get(`/api/villages/${villageId}`, {
                    headers: { Authorization: `Bearer ${admin.token}` }
                });
                setVillage(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching village:', err);
                setError('Failed to load village details');
                setLoading(false);
            }
        };

        if (villageId) {
            fetchVillage();
        } else {
            setLoading(false);
        }
    }, [villageId, admin.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVillage(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/villages/${villageId}`, village, {
                headers: { Authorization: `Bearer ${admin.token}` }
            });
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Error updating village:', err);
            setError('Failed to update village');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading village details...</p>
            </div>
        );
    }

    return (
        <div className="edit-village-container">
            <h2>Edit Village</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="edit-village-form">
                <div className="form-group">
                    <label htmlFor="name">Village Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={village.name}
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
                        value={village.district}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={village.state}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={village.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="population">Population</label>
                    <input
                        type="number"
                        id="population"
                        name="population"
                        value={village.population}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-save">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVillage;

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const VillageContext = createContext();

export const useVillages = () => useContext(VillageContext);

export const VillageProvider = ({ children }) => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoading(true);
        const response = await api.get('/villages');
        setVillages(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch villages');
      } finally {
        setLoading(false);
      }
    };

    fetchVillages();
  }, []);

  const addVillage = async (villageData) => {
    try {
      setLoading(true);
      const response = await api.post('/villages', villageData);
      setVillages([...villages, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add village');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVillage = async (id, villageData) => {
    try {
      setLoading(true);
      const response = await api.put(`/villages/${id}`, villageData);
      setVillages(villages.map(v => v._id === id ? response.data : v));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update village');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVillage = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/villages/${id}`);
      setVillages(villages.filter(v => v._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete village');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchVillages = async (query, type = 'name') => {
    try {
      setLoading(true);
      const endpoint = type === 'district' 
        ? `/search/district?district=${query}`
        : `/search/name?name=${query}`;
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    villages,
    loading,
    error,
    addVillage,
    updateVillage,
    deleteVillage,
    searchVillages
  };

  return (
    <VillageContext.Provider value={value}>
      {children}
    </VillageContext.Provider>
  );
};
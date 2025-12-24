import React, { useState } from 'react';
import { useVillages } from '../../context/VillageContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const { searchVillages } = useVillages();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      try {
        const searchResults = await searchVillages(value, searchType);
        setResults(searchResults);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}&type=${searchType}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/village/${id}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-type-toggle">
          <button 
            type="button" 
            className={searchType === 'name' ? 'active' : ''}
            onClick={() => setSearchType('name')}
          >
            By Name
          </button>
          <button 
            type="button" 
            className={searchType === 'district' ? 'active' : ''}
            onClick={() => setSearchType('district')}
          >
            By District
          </button>
        </div>
        <div className="search-input-container">
          <input
            type="text"
            placeholder={`Search villages by ${searchType}...`}
            value={query}
            onChange={handleSearch}
            onFocus={() => query.length > 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
      
      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(village => (
            <div 
              key={village._id} 
              className="search-result-item"
              onClick={() => handleResultClick(village._id)}
            >
              <div className="result-info">
                <h4>{village.name}</h4>
                <p>{village.district} District</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
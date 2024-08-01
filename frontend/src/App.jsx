import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import PopularSearches from './components/PopularSearches';
import SearchResults from './components/SearchResult.jsx'; 

const App = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/searchResults?q=${query}`);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <PopularSearches />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/searchResults" element={<SearchResults />} />
    </Routes>
  </Router>
);

export default AppWrapper;

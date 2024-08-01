import React from 'react';
import SearchBar from '../components/SearchBar';
import PopularSearches from '../components/PopularSearches';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">E-commerce Autocomplete</h1>
      <SearchBar />
      <PopularSearches />
    </div>
  );
};

export default Home;

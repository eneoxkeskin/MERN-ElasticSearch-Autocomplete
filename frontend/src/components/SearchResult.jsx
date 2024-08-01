import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/search/products?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <h2>{`"${query}" araması için sonuçlar`}</h2>
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <img src={result.imageUrl} alt={result.name} />
            <div>{result.name}</div>
            <div>{result.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Autocomplete = ({ query, setQuery, onSearch }) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (query.length > 0) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/search?q=${query}`);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [query]);

    return (
        <ul>
            {suggestions.map(suggestion => (
                <li 
                    key={suggestion._id} 
                    className="p-1 cursor-pointer"
                    onMouseDown={() => onSearch(suggestion._source.name)}
                >
                    {suggestion._source.name} <span className="text-gray-500">{suggestion._source.category}</span>
                </li>
            ))}
        </ul>
    );
};

export default Autocomplete;

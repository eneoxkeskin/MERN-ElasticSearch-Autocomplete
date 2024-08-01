import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PopularSearches = () => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      const response = await axios.get('http://localhost:3000/popular');
      setPopular(response.data);
    };

    fetchPopularSearches();
  }, []);

  return (
    <div className="mt-4">
  
      <ul>
        {popular.map((item) => (
          <li key={item.id} className="p-2 border-b">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularSearches;

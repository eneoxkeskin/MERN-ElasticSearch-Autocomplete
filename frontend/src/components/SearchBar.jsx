import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Autocomplete from './Autocomplete';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]);
    const [popularSearches, setPopularSearches] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHistory, setShowHistory] = useState(true);

    const searchBarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3000/search/history');
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching search history:', error);
            }
        };

        const fetchPopularSearches = async () => {
            try {
                const response = await axios.get('http://localhost:3000/search/popular');
                setPopularSearches(response.data);
            } catch (error) {
                console.error('Error fetching popular searches:', error);
            }
        };

        const fetchPopularProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/search/products');
                setPopularProducts(response.data);
            } catch (error) {
                console.error('Error fetching popular products:', error);
            }
        };

        fetchHistory();
        fetchPopularSearches();
        fetchPopularProducts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setShowHistory(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchBarRef]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
        setShowHistory(e.target.value.length === 0);
    };

    const handleSearch = async () => {
        if (query.length > 0) {
            await axios.post('http://localhost:3000/search/history', { term: query });
            navigate(`/search/${query}`);
        }
    };

    const handleFocus = () => {
        setShowSuggestions(true);
        setShowHistory(query.length === 0);
    };

    const handleSuggestionClick = async (term) => {
        await axios.post('http://localhost:3000/search/history', { term });
        navigate(`/search/${term}`);
    };

    const handleProductClick = (product) => {
        navigate(`/search/${product.name}`);
    };

    const handleClearHistory = async () => {
        await axios.delete('http://localhost:3000/search/history');
        setHistory([]);
    };

    return (
        <div className="relative " ref={searchBarRef}>
            <div className="flex w-96 m-auto">
                <input 
                    type="text" 
                    value={query} 
                    onChange={handleChange} 
                    onFocus={handleFocus}
                    className="border p-2 w-full"
                    placeholder="Aradığınız ürün, kategori veya markayı yazınız"
                />
                <button onClick={handleSearch} className="p-2 bg-blue-500 text-white">
                    Ara
                </button>
            </div>
            {showSuggestions && (
                <div className="border bg-white w-96 p-2 m-auto">
                    {showHistory && (
                        <>
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">Geçmiş Aramalar</h3>
                                <button onClick={handleClearHistory} className="text-sm text-blue-500">Temizle</button>
                            </div>
                            <ul className="mb-2">
                                {history.map(item => (
                                    <li 
                                        key={item._id} 
                                        className="p-1 cursor-pointer" 
                                        onMouseDown={() => handleSuggestionClick(item.term)}
                                    >
                                        {item.term}
                                    </li>
                                ))}
                            </ul>
                            <h3 className="font-bold">Popüler Aramalar</h3>
                            <ul className="mb-2">
                                {popularSearches.map((item, index) => (
                                    <li 
                                        key={index} 
                                        className="p-1 cursor-pointer" 
                                        onMouseDown={() => handleSuggestionClick(item.term)}
                                    >
                                        {item.term}
                                    </li>
                                ))}
                            </ul>
                            <h3 className="font-bold">Popüler Ürünler</h3>
                            <div className="flex flex-col"> {/* flex-col sınıfı flex yönünü dikey yapar */}
  {popularProducts.map(product => (
    <div key={product.id} className="p-2 cursor-pointer" onMouseDown={() => handleProductClick(product)}>
      <div>{product.name}</div> {/* Bu div içeriği her zaman yeni bir satıra yerleştirir */}
    </div>
  ))}
</div>
                        </>
                    )}
                    {!showHistory && (
                        <Autocomplete query={query} setQuery={setQuery} onSearch={handleSuggestionClick} />
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

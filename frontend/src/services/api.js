import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Backend sunucusunun doğru URL'si
});

export const fetchSuggestions = (query) => {
    return api.get(`/search?q=${query}`);
};

export const fetchPopularSearches = () => {
    return api.get('/popular');
};

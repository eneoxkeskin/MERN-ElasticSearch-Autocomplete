const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const SearchHistory = require('../models/SearchHistory');

const router = express.Router();
const client = new Client({ node: 'http://localhost:9200' });

router.get('/', async (req, res) => {
    const query = req.query.q;

    try {
        const result = await client.search({
            index: 'products',
            body: {
                query: {
                    match: {
                        name: {
                            query: query,
                            fuzziness: "AUTO"
                        }
                    }
                }
            }
        });

        res.send(result.hits.hits);
    } catch (error) {
        console.error('Elasticsearch error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/history', async (req, res) => {
    const { term } = req.body;

    try {
        let searchHistory = await SearchHistory.findOne({ term });

        if (searchHistory) {
            searchHistory.count += 1;
        } else {
            searchHistory = new SearchHistory({ term });
        }

        await searchHistory.save();
        res.status(201).send('Search term saved successfully');
    } catch (error) {
        console.error('Error saving search term:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/history', async (req, res) => {
    try {
        await SearchHistory.deleteMany({});
        res.status(200).send('Search history cleared successfully');
    } catch (error) {
        console.error('Error clearing search history:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/popular', async (req, res) => {
    try {
        const popularSearches = await SearchHistory.find().sort({ count: -1 }).limit(10);
        res.json(popularSearches);
    } catch (error) {
        console.error('Error fetching popular searches:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/products', (req, res) => {
    const popularProducts = [
        {
            id: 1,
            name: 'HC Care Kompleks Bitkisel Saç Bakım',
            price: '439.00 TL',
            imageUrl: 'https://cdn.dsmcdn.com/mnresize/1200/1800/ty29/product/media/images/20201130/11/32094783/95393358/1/1_org_zoom.jpg'
        },
        {
            id: 2,
            name: 'Bioxin Keratin Argan Besleyici Onarıcı Saç',
            price: '211.00 TL',
            imageUrl: 'https://cdn.dsmcdn.com/mnresize/1200/1800/ty28/product/media/images/20201130/11/32094783/95393358/2/2_org_zoom.jpg'
        }
    ];
    res.json(popularProducts);
});

module.exports = router;

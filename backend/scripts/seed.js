const mongoose = require('mongoose');
const { Client } = require('@elastic/elasticsearch');
const Product = require('../models/product');
const dotenv = require('dotenv');
dotenv.config();

const esClient = new Client({ node: 'http://localhost:9200' });

const products = [
  { name: 'Apple iPhone 13', description: 'Latest model from Apple', price: 999, category: 'Electronics', store: 'Apple Store' },
  { name: 'Samsung Galaxy S21', description: 'Latest model from Samsung', price: 799, category: 'Electronics', store: 'Samsung Store' },
  { name: 'Sony WH-1000XM4', description: 'Noise Cancelling Headphones', price: 349, category: 'Electronics', store: 'Sony Store' },
  { name: 'Dell XPS 13', description: 'High-performance laptop', price: 1199, category: 'Computers', store: 'Dell Store' },
  { name: 'Nike Air Max', description: 'Comfortable running shoes', price: 149, category: 'Fashion', store: 'Nike Store' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);

    await esClient.indices.delete({ index: 'products', ignore_unavailable: true });
    await esClient.indices.create({
      index: 'products',
      body: {
        settings: {
          analysis: {
            filter: {
              ngram_filter: {
                type: 'edge_ngram', // edge_ngram filter kullanıyoruz
                min_gram: 1,
                max_gram: 10
              }
            },
            analyzer: {
              ngram_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'ngram_filter'
                ]
              }
            }
          }
        },
        mappings: {
          properties: {
            name: {
              type: 'text',
              analyzer: 'ngram_analyzer'
            },
            description: {
              type: 'text',
              analyzer: 'ngram_analyzer'
            },
            price: {
              type: 'float'
            },
            category: {
              type: 'text',
              analyzer: 'ngram_analyzer'
            },
            store: {
              type: 'text',
              analyzer: 'ngram_analyzer'
            }
          }
        }
      }
    });

    for (const product of products) {
      await esClient.index({
        index: 'products',
        body: product
      });
    }

    console.log('Database seeded successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seedDatabase();

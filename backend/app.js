const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const searchRoutes = require('./routes/search');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000;

try{
    mongoose.connect(MONGO_URI);
    console.log("connected");
}catch(err){
    console.log(err);
}

app.use(bodyParser.json());
app.use(cors());
app.use('/search', searchRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
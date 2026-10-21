const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
require('dotenv').config();


const routes = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use(cors());

routes(app);

// Database
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); 
  });

mongoose.connection.on('error', (err) => {
  console.error('Mongoose runtime error:', err);
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

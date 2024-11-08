const express = require('express');
const userRoutes = require('../routes/userRoutes');
const showRoutes = require('../routes/showRoutes');
const { db } = require('../db/connection');

const app = express();
const PORT = 3000;

app.use(express.json());

// Use routes
app.use('/users', userRoutes);
app.use('/shows', showRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Movie Theaters API!');
});

// Sync database and start server
db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

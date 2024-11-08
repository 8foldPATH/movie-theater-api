const express = require('express');
const { Show } = require('../models/Show');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  const shows = await Show.findAll();
  res.json(shows);
});

// Get one show
router.get('/:id', async (req, res) => {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  });

// Get users who watched a show
router.get('/:id/users', async (req, res) => {
    const show = await Show.findByPk(req.params.id, { include: 'users' });
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show.users);
  });
  
  // Update available property
  router.put('/:id/available', async (req, res) => {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    show.available = req.body.available; 
    await show.save();
    res.json(show);
  });
  
  // Delete a show
  router.delete('/:id', async (req, res) => {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    await show.destroy();
    res.status(204).send();
  });
  
  // Get shows by genre
  router.get('/genre/:genre', async (req, res) => {
    const shows = await Show.findAll({ where: { genre: req.params.genre } });
    res.json(shows);
  });

// Create a new show with validation
router.post('/', 
  body('title').isLength({ max: 25 }).withMessage('Title must be 25 characters or less'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, genre, rating, available } = req.body;
    const newShow = await Show.create({ title, genre, rating, available });
    res.status(201).json(newShow);
});

module.exports = router;

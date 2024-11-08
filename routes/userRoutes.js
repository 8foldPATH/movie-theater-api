const express = require('express');
const { User } = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Get one user
router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });

// Get all shows watched by a user
router.get('/:id/shows', async (req, res) => {
    const user = await User.findByPk(req.params.id, { include: 'shows' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.shows);
  });
  
  router.put('/:userId/shows/:showId', async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    const show = await Show.findByPk(req.params.showId);
    if (!user || !show) {
      return res.status(404).json({ message: 'User or Show not found' });
    }
    await user.addShow(show);
    res.status(200).json({ message: 'User associated with show' });
  });
  

// Create a new user with validation
router.post('/', 
  body('username').isEmail().withMessage('Username must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
});

module.exports = router;

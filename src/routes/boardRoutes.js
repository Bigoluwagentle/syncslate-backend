const express = require('express');
const Board = require('../models/Board');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Every route below requires a valid login token
router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const board = await Board.create({ name, owner: req.userId });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { Expense, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Get all expenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: ['user'],
      order: [['expenseDate', 'DESC']]
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expense by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: ['user']
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.update(req.body);
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

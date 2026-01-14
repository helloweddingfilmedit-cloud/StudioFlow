const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Get all users (admin/manager only)
router.get('/', authMiddleware, checkRole('admin', 'manager'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Whitelist allowed fields for update
    const allowedFields = ['firstName', 'lastName', 'email', 'role', 'isActive'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await user.update(updateData);
    
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete/deactivate user
router.delete('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete by setting isActive to false
    await user.update({ isActive: false });
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

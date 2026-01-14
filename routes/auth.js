const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

const getJWTSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  return process.env.JWT_SECRET || 'your-secret-key-change-in-production';
};

// Register a new user (admin only in production, but open for first user setup)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Count users to apply 50 user limit
    const userCount = await User.count();
    if (userCount >= 50) {
      return res.status(400).json({ error: 'Maximum user limit (50) reached' });
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      getJWTSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      getJWTSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

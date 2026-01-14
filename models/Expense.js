const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  vendor: {
    type: DataTypes.STRING
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'),
    defaultValue: 'cash'
  },
  receiptUrl: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Expense;

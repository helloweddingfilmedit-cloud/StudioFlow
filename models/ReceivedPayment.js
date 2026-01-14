const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReceivedPayment = sequelize.define('ReceivedPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Invoices',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer', 'paypal', 'other'),
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'failed', 'refunded'),
    defaultValue: 'completed'
  }
}, {
  timestamps: true
});

module.exports = ReceivedPayment;

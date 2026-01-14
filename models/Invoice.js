const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  },
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = Invoice;

const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Invoice = require('./Invoice');
const Expense = require('./Expense');
const ReceivedPayment = require('./ReceivedPayment');

// Define relationships
// Client has many Invoices
Client.hasMany(Invoice, {
  foreignKey: 'clientId',
  as: 'invoices'
});
Invoice.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

// Client has many ReceivedPayments
Client.hasMany(ReceivedPayment, {
  foreignKey: 'clientId',
  as: 'payments'
});
ReceivedPayment.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

// Invoice has many ReceivedPayments
Invoice.hasMany(ReceivedPayment, {
  foreignKey: 'invoiceId',
  as: 'payments'
});
ReceivedPayment.belongsTo(Invoice, {
  foreignKey: 'invoiceId',
  as: 'invoice'
});

// User has many Expenses
User.hasMany(Expense, {
  foreignKey: 'userId',
  as: 'expenses'
});
Expense.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Client,
  Invoice,
  Expense,
  ReceivedPayment,
  syncDatabase
};

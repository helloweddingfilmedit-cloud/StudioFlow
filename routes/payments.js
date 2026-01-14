const express = require('express');
const router = express.Router();
const { ReceivedPayment, Invoice, Client } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Get all received payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const payments = await ReceivedPayment.findAll({
      include: ['invoice', 'client'],
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await ReceivedPayment.findByPk(req.params.id, {
      include: ['invoice', 'client']
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payment = await ReceivedPayment.create(req.body);
    
    // Update invoice paid amount
    const invoice = await Invoice.findByPk(payment.invoiceId);
    if (invoice) {
      const newPaidAmount = parseFloat(invoice.paidAmount) + parseFloat(payment.amount);
      await invoice.update({
        paidAmount: newPaidAmount,
        status: newPaidAmount >= invoice.total ? 'paid' : 'partially_paid'
      });
    }
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update payment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await ReceivedPayment.findByPk(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete payment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await ReceivedPayment.findByPk(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update invoice paid amount
    const invoice = await Invoice.findByPk(payment.invoiceId);
    if (invoice) {
      const newPaidAmount = parseFloat(invoice.paidAmount) - parseFloat(payment.amount);
      await invoice.update({
        paidAmount: Math.max(0, newPaidAmount),
        status: newPaidAmount <= 0 ? 'sent' : 'partially_paid'
      });
    }

    await payment.destroy();
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

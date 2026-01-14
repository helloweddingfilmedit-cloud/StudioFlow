const express = require('express');
const router = express.Router();
const { ReceivedPayment, Invoice, Client } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Helper function to update invoice paid amount and status
const updateInvoicePaymentStatus = async (invoiceId) => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) return;

  // Calculate total paid amount from all payments
  const payments = await ReceivedPayment.findAll({
    where: { invoiceId },
    attributes: ['amount']
  });

  const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  // Determine status based on paid amount
  let status = 'sent';
  if (totalPaid >= invoice.total) {
    status = 'paid';
  } else if (totalPaid > 0) {
    status = 'partially_paid';
  }

  await invoice.update({
    paidAmount: totalPaid,
    status
  });
};

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
    
    // Update invoice paid amount and status
    await updateInvoicePaymentStatus(payment.invoiceId);
    
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

    const oldInvoiceId = payment.invoiceId;
    await payment.update(req.body);
    
    // Update invoice totals for both old and new invoice (if changed)
    await updateInvoicePaymentStatus(oldInvoiceId);
    if (req.body.invoiceId && req.body.invoiceId !== oldInvoiceId) {
      await updateInvoicePaymentStatus(req.body.invoiceId);
    }
    
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

    const invoiceId = payment.invoiceId;
    await payment.destroy();
    
    // Update invoice paid amount and status
    await updateInvoicePaymentStatus(invoiceId);

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

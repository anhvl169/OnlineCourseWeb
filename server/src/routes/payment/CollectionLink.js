const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment/paymentController');
const { authMiddleware } = require('../../middlewares/verifyToken');

// POST: Create payment link
router.post('/create-link', authMiddleware, paymentController.createPaymentLink);

// POST: Handle IPN callback from Momo
router.post('/ipn', paymentController.handlePaymentIPN);

// GET: Redirect page after payment
router.get('/result', paymentController.getPaymentResult);

module.exports = router;
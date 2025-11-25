import express from 'express';
import { createPaymentIntent, confirmPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/status/:orderId', protect, getPaymentStatus);

export default router;

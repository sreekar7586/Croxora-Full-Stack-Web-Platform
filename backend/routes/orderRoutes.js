import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { orderValidation, validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, orderValidation, validateRequest, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;

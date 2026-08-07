const express = require('express');
const router = express.Router();

const { getAllPatients, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/patients', getAllPatients);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id', updateOrderStatus);

module.exports = router;
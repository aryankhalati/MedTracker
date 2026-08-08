const User = require('../models/User');
const Order = require('../models/Order');

const getAllPatients = async (req, res, next) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('-password -otp -otpExpiry');
        res.json(patients);
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
                deliveredAt: status === 'delivered' ? new Date() : null
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPatients, getAllOrders, getOrderById, updateOrderStatus };
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');

const createOrder = async (req, res, next) => {
    try {
        const { prescriptionId, quantity } = req.body;

        const prescription = await Prescription.findOne({
            _id: prescriptionId,
            userId: req.user.id
        });

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const order = await Order.create({
            userId: req.user.id,
            prescriptionId: prescription._id,
            medicineName: prescription.medicineName,
            quantity
        });

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getOrders, getOrderById };
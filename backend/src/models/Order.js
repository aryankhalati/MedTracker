const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription',
            required: true
        },
        medicineName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed','out_for_delivery', 'delivered', 'cancelled'],
            default: 'pending'
        },
        deliveredAt: {
            type: Date,
            default: null
        }
    },
    {timestamps: true}
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
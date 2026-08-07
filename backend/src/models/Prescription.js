const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        medicineName: {
            type: String,
            required: true,
            trim: true
        },
        dosage: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        dosesPerDay: {
            type: Number,
            required: true,
            min: 1
        },
        doseTimes : {
            type: [String],
            required: true
        },
        condition: {
            type: String,
            trim: true,
            default: null
        },
        prescribingDoctor: {
            type: String,
            trim: true,
            default: null
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
     {timestamps:true}
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
const mongoose = require('mongoose');

const doseLogSchema = new mongoose.Schema (
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
            required: true,
            index: true
        },
        scheduledTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'taken', 'missed'],
            default: 'pending'
        },
        takenAt: {
            type: Date,
            default: null
        }
    },
    {timestamps:true}
);

const DoseLog = mongoose.model('DoseLog', doseLogSchema);

module.exports = DoseLog;
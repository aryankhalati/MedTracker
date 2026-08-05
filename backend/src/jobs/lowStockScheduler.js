const cron = require('node-cron');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const calculateDaysRemaining = require('../utils/calculateDaysRemaining');
const sendEmail = require('../utils/sendEmail');

const LOW_STOCK_THRESHOLD = 3;

const checkLowStock = async () => {
    const activePrescriptions = await Prescription.find({ isActive: true });

    for (const prescription of activePrescriptions) {
        const daysRemaining = calculateDaysRemaining(
            prescription.quantity,
            prescription.dosesPerDay,
            prescription.startDate
        );

        if (daysRemaining <= LOW_STOCK_THRESHOLD && daysRemaining > 0) {
            const user = await User.findById(prescription.userId);
            if (!user) continue;

            await sendEmail(
                user.email,
                'Your medicine supply is running low',
                `<p>Hi ${user.name},</p><p>Your <strong>${prescription.medicineName} (${prescription.dosage})</strong> supply has ${daysRemaining} day(s) left. Reorder soon to avoid running out.</p>`
            );
        }
    }
};

const startLowStockScheduler = () => {
    cron.schedule('0 9 * * *', checkLowStock);
    console.log('Low stock scheduler started');
};

module.exports = startLowStockScheduler;
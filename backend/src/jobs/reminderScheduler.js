const cron = require('node-cron');
const DoseLog = require('../models/DoseLog');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const sendEmail = require('../utils/sendEmail');

const checkAndSendReminders = async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dueDoses = await DoseLog.find({
        scheduledTime: currentTime,
        status: 'pending',
        scheduledDate: { $gte: startOfDay, $lte: endOfDay }
    });

    for (const dose of dueDoses) {
        const user = await User.findById(dose.userId);
        const prescription = await Prescription.findById(dose.prescriptionId);

        if (!user || !prescription) continue;

        await sendEmail(
            user.email,
            'Time to take your medicine',
            `<p>Hi ${user.name},</p><p>It's time to take your <strong>${prescription.medicineName} (${prescription.dosage})</strong> — scheduled dose at ${dose.scheduledTime}.</p>`
        );
    }
};

const startReminderScheduler = () => {
    cron.schedule('* * * * *', checkAndSendReminders);
    console.log('Reminder scheduler started');
};

module.exports = startReminderScheduler;
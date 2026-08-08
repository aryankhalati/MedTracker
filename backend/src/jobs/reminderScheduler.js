const cron = require('node-cron');
const DoseLog = require('../models/DoseLog');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const sendEmail = require('../utils/sendEmail');

const checkAndSendReminders = async () => {
    const now = new Date();

    // Build a window covering "this minute" so we catch doses scheduled at exactly now
    const windowStart = new Date(now);
    windowStart.setSeconds(0, 0);
    const windowEnd = new Date(windowStart.getTime() + 60 * 1000);

    const dueDoses = await DoseLog.find({
        scheduledTime: { $gte: windowStart, $lt: windowEnd },
        status: 'pending'
    });

    for (const dose of dueDoses) {
        const user = await User.findById(dose.userId);
        const prescription = await Prescription.findById(dose.prescriptionId);

        if (!user || !prescription) continue;

        const timeLabel = dose.scheduledTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        await sendEmail(
            user.email,
            'Time to take your medicine',
            `<p>Hi ${user.name},</p><p>It's time to take your <strong>${prescription.medicineName} (${prescription.dosage})</strong> — scheduled dose at ${timeLabel}.</p>`
        );
    }
};

const startReminderScheduler = () => {
    cron.schedule('* * * * *', checkAndSendReminders);
    console.log('Reminder scheduler started');
};

module.exports = startReminderScheduler;
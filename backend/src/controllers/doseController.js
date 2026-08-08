const DoseLog = require('../models/DoseLog');
const Prescription = require('../models/Prescription');

const getTodayDoses = async (req, res, next) => {
    try {
        // Get "today" in IST regardless of server's own timezone (Render runs UTC)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
        const istNow = new Date(now.getTime() + istOffset);

        const startOfDay = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()) - istOffset);
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

        const activePrescriptions = await Prescription.find({
            userId: req.user.id,
            isActive: true
        });

        for (const prescription of activePrescriptions) {
            for (const time of prescription.doseTimes) {
                const [hours, minutes] = time.split(':').map(Number);
                const scheduledDateTime = new Date(startOfDay.getTime() + (hours * 60 + minutes) * 60 * 1000);

                const existing = await DoseLog.findOne({
                    prescriptionId: prescription._id,
                    scheduledTime: scheduledDateTime
                });

                if (!existing) {
                    await DoseLog.create({
                        userId: req.user.id,
                        prescriptionId: prescription._id,
                        scheduledTime: scheduledDateTime,
                        status: 'pending'
                    });
                }
            }
        }

        const doses = await DoseLog.find({
            userId: req.user.id,
            scheduledTime: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate('prescriptionId', 'medicineName dosage')
            .sort({ scheduledTime: 1 });

        res.json(doses);
    } catch (error) {
        next(error);
    }
};

const markDoseStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['taken', 'missed'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either "taken" or "missed"' });
        }

        const dose = await DoseLog.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            {
                status,
                takenAt: status === 'taken' ? new Date() : null
            },
            { new: true }
        );

        if (!dose) {
            return res.status(404).json({ message: 'Dose log not found' });
        }

        res.json(dose);
    } catch (error) {
        next(error);
    }
};

const getAdherenceStats = async (req, res, next) => {
    try {
        const allDoses = await DoseLog.find({
            userId: req.user.id,
            status: { $in: ['taken', 'missed'] }
        });

        const totalDoses = allDoses.length;
        const takenDoses = allDoses.filter(d => d.status === 'taken').length;

        const adherencePercentage = totalDoses === 0
            ? 100
            : Math.round((takenDoses / totalDoses) * 100);

        res.json({
            totalDoses,
            takenDoses,
            missedDoses: totalDoses - takenDoses,
            adherencePercentage
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTodayDoses, markDoseStatus, getAdherenceStats };
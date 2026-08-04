const Prescription = require('../models/Prescription');
const calculateDaysRemaining = require('../utils/calculateDaysRemaining');

const formatPrescription = (prescription) => {
    const daysRemaining = calculateDaysRemaining(
        prescription.quantity,
        prescription.dosesPerDay,
        prescription.startDate
    );

    return {
        ...prescription.toObject(),
        daysRemaining
    };
};

const createPrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.create({
            ...req.body,
            userId: req.user.id
        });

        res.status(201).json(formatPrescription(prescription));
    } catch (error) {
        next(error);
    }
};

const getPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await Prescription.find({
            userId: req.user.id,
            isActive: true
        }).sort({ createdAt: -1 });

        const formatted = prescriptions.map(formatPrescription);
        res.json(formatted);
    } catch (error) {
        next(error);
    }
};

const getPrescriptionById = async (req, res, next) => {
    try {
        const prescription = await Prescription.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json(formatPrescription(prescription));
    } catch (error) {
        next(error);
    }
};

const updatePrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json(formatPrescription(prescription));
    } catch (error) {
        next(error);
    }
};

const deletePrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isActive: false },
            { new: true }
        );

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
};
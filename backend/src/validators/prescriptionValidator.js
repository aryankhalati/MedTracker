const { z } = require('zod');

const createPrescriptionSchema = z.object({
    medicineName: z.string().trim().min(1, 'Medicine name is required'),
    dosage: z.string().trim().min(1, 'Dosage is required'),
    quantity: z.number().int().positive('Quantity must be a positive number'),
    dosesPerDay: z.number().int().positive('Doses per day must be a positive number'),
    doseTimes: z.array(z.string()).min(1, 'At least one dose time is required'),
    condition: z.string().trim().optional(),
    prescribingDoctor: z.string().trim().optional(),
    startDate: z.string().optional()
});

const updatePrescriptionSchema = createPrescriptionSchema.partial();

module.exports = { createPrescriptionSchema, updatePrescriptionSchema };
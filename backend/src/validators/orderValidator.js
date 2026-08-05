const { z } = require('zod');

const createOrderSchema = z.object({
    prescriptionId: z.string().min(1, 'Prescription ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive number')
});

module.exports = { createOrderSchema };
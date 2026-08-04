const express = require('express');
const router = express.Router();

const {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} = require('../controllers/prescriptionController');

const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createPrescriptionSchema, updatePrescriptionSchema } = require('../validators/prescriptionValidator');

router.use(authMiddleware);

router.post('/', validate(createPrescriptionSchema), createPrescription);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id', validate(updatePrescriptionSchema), updatePrescription);
router.delete('/:id', deletePrescription);

module.exports = router;
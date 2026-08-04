const express = require('express');
const router = express.Router();

const { getTodayDoses, markDoseStatus, getAdherenceStats } = require('../controllers/doseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/today', getTodayDoses);
router.get('/adherence', getAdherenceStats);
router.patch('/:id', markDoseStatus);

module.exports = router;
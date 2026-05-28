const express = require('express');
const { registerForTournament, unregisterFromTournament } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/register', protect, registerForTournament);
router.delete('/:id/unregister', protect, unregisterFromTournament);

module.exports = router;

const express = require('express');
const { createTournament, getAllTournaments, getTournamentById } = require('../controllers/tournamentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getAllTournaments)
  .post(protect, adminOnly, createTournament);

router.get('/:id', protect, getTournamentById);

module.exports = router;

const pool = require('../config/db');

// Зарегистрировать игрока на турнир
const registerForTournament = async (req, res) => {
  const tournamentId = req.params.id;
  const userId = req.user.id;

  try {
    // Проверка, существует ли турнир
    const tournament = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (tournament.rows.length === 0) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Проверка, не зарегистрирован ли уже
    const existing = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND tournament_id = $2',
      [userId, tournamentId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already registered for this tournament' });
    }

    // Регистрация
    const registration = await pool.query(
      'INSERT INTO registrations (user_id, tournament_id) VALUES ($1, $2) RETURNING *',
      [userId, tournamentId]
    );

    res.status(201).json({ message: 'Successfully registered', registration: registration.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Отменить регистрацию (опционально)
const unregisterFromTournament = async (req, res) => {
  const tournamentId = req.params.id;
  const userId = req.user.id;

  try {
    await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND tournament_id = $2',
      [userId, tournamentId]
    );
    res.json({ message: 'Successfully unregistered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerForTournament, unregisterFromTournament };

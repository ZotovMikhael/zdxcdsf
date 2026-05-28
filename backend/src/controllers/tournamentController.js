const pool = require('../config/db');

// Создать турнир (только админ)
const createTournament = async (req, res) => {
  const { title, type, start_time } = req.body;
  const created_by = req.user.id;

  try {
    const newTournament = await pool.query(
      'INSERT INTO tournaments (title, type, start_time, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, type, start_time, created_by]
    );
    res.status(201).json(newTournament.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Получить все турниры
const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await pool.query(`
      SELECT t.*, u.name as creator_name,
      (SELECT COUNT(*) FROM registrations r WHERE r.tournament_id = t.id) as players_count
      FROM tournaments t
      JOIN users u ON t.created_by = u.id
      ORDER BY t.start_time ASC
    `);
    res.json(tournaments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Получить один турнир с игроками
const getTournamentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Сам турнир
    const tournament = await pool.query(
      'SELECT * FROM tournaments WHERE id = $1',
      [id]
    );
    if (tournament.rows.length === 0) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Зарегистрированные игроки
    const players = await pool.query(
      `SELECT u.id, u.name, u.email, r.registered_at
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.tournament_id = $1
       ORDER BY r.registered_at`,
      [id]
    );

    res.json({
      ...tournament.rows[0],
      registered_players: players.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTournament, getAllTournaments, getTournamentById };

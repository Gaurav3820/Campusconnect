// backend/controllers/qaController.js
const pool = require('../config/db');

exports.askQuestion = async (req, res) => {
  try {
    const { question, asked_by } = req.body;
    if (!question) return res.status(400).json({ msg: 'Question cannot be empty' });

    const [result] = await pool.execute('INSERT INTO questions (question, asked_by) VALUES (?, ?)', [question, asked_by || null]);
    res.json({ msg: 'Question posted', question_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error posting question' });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { question_id, answer, answered_by } = req.body;
    if (!question_id || !answer) return res.status(400).json({ msg: 'Question id and answer required' });

    await pool.execute('INSERT INTO answers (answer, question_id, answered_by) VALUES (?, ?, ?)', [answer, question_id, answered_by || null]);
    res.json({ msg: 'Answer posted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error posting answer' });
  }
};

exports.getQuestionsWithAnswers = async (req, res) => {
  try {
    const [questions] = await pool.execute('SELECT * FROM questions ORDER BY created_at DESC');

    // fetch answers for each question (efficiently)
    const qIds = questions.map(q => q.id);
    if (qIds.length === 0) return res.json([]);

    const [answers] = await pool.execute('SELECT * FROM answers WHERE question_id IN (' + qIds.map(()=>'?').join(',') + ') ORDER BY created_at ASC', qIds);

    // attach answers to questions
    const answersByQ = {};
    answers.forEach(a => {
      if (!answersByQ[a.question_id]) answersByQ[a.question_id] = [];
      answersByQ[a.question_id].push(a);
    });

    const result = questions.map(q => ({ ...q, answers: answersByQ[q.id] || [] }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching questions' });
  }
};

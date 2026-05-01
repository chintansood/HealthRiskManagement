const express = require('express');
const { run, query } = require('../config/database');

const router = express.Router();

// ─── GET ALL PATIENTS ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM patient ORDER BY created_date DESC'
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Fetch Patients Error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// ─── HIGH RISK PATIENTS (must be before /:id if you add that route) ──────────
router.get('/high-risk', async (req, res) => {
  try {
    const result = await query(`
      SELECT
        p.patient_id,
        p.name,
        p.age,
        p.contact,
        rs.score,
        rs.risk_level
      FROM patient p
      JOIN risk_score rs ON p.patient_id = rs.patient_id
      WHERE rs.risk_level = 'HIGH'
      ORDER BY rs.score DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('❌ High Risk Error:', error);
    res.status(500).json({ error: 'Failed to fetch high risk patients' });
  }
});

// ─── GET SINGLE PATIENT ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM patient WHERE patient_id = ?',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Get Patient Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// ─── ADD PATIENT ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, contact } = req.body;

    // Validation
    if (!name || !contact) {
      return res.status(400).json({ error: 'Name and contact are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (age !== undefined && age !== null && age !== '') {
      const ageNum = Number(age);
      if (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 150) {
        return res.status(400).json({ error: 'Age must be a valid integer between 0 and 150' });
      }
    }

    // INSERT — run() gives us this.lastID correctly
    const insertResult = await run(
      'INSERT INTO patient (name, age, gender, contact) VALUES (?, ?, ?, ?)',
      [name.trim(), age || null, gender || null, contact.trim()]
    );

    // Fetch the newly created patient
    const patient = await query(
      'SELECT * FROM patient WHERE patient_id = ?',
      [insertResult.lastID]   // ✅ Fixed: was this.lastID in arrow fn (always undefined)
    );

    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: patient.rows[0],
    });
  } catch (error) {
    console.error('❌ Add Patient Error:', error);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

// ─── DELETE PATIENT ───────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await run(
      'DELETE FROM patient WHERE patient_id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient deleted' });
  } catch (error) {
    console.error('❌ Delete Patient Error:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;
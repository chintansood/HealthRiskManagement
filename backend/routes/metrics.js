const express = require('express');
const { run, query } = require('../config/database');
const riskCalc = require('../utils/riskCalculator');

const router = express.Router();

// ─── ADD METRICS + CALCULATE RISK ────────────────────────────────────────────
router.post('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { bpSystolic, bpDiastolic, sugarLevel, bmi } = req.body;

    // Presence validation
    if (
      bpSystolic === undefined || bpDiastolic === undefined ||
      sugarLevel === undefined || bmi === undefined
    ) {
      return res.status(400).json({ error: 'All health metrics are required' });
    }

    // Numeric range validation
    const sys = parseFloat(bpSystolic);
    const dia = parseFloat(bpDiastolic);
    const sugar = parseFloat(sugarLevel);
    const bmiVal = parseFloat(bmi);

    if (isNaN(sys) || sys < 50 || sys > 300) {
      return res.status(400).json({ error: 'BP Systolic must be between 50 and 300 mmHg' });
    }
    if (isNaN(dia) || dia < 30 || dia > 200) {
      return res.status(400).json({ error: 'BP Diastolic must be between 30 and 200 mmHg' });
    }
    if (isNaN(sugar) || sugar < 20 || sugar > 600) {
      return res.status(400).json({ error: 'Sugar level must be between 20 and 600 mg/dL' });
    }
    if (isNaN(bmiVal) || bmiVal < 10 || bmiVal > 80) {
      return res.status(400).json({ error: 'BMI must be between 10 and 80' });
    }

    // Check patient exists
    const patient = await query(
      'SELECT patient_id FROM patient WHERE patient_id = ?',
      [patientId]
    );
    if (!patient.rows.length) {
      return res.status(404).json({ error: `Patient #${patientId} not found` });
    }

    // Insert health_metrics
    await run(
      `INSERT INTO health_metrics (patient_id, bp_systolic, bp_diastolic, sugar_level, bmi)
       VALUES (?, ?, ?, ?, ?)`,
      [patientId, sys, dia, sugar, bmiVal]
    );

    // Calculate risk
    const score = riskCalc.calculateRisk(sys, dia, sugar, bmiVal);
    const riskLevel = riskCalc.getRiskLevel(score);

    // Insert risk_score
    await run(
      `INSERT INTO risk_score (patient_id, score, risk_level) VALUES (?, ?, ?)`,
      [patientId, score, riskLevel]
    );

    // Create alert for HIGH risk
    if (riskLevel === 'HIGH') {
      await run(
        `INSERT INTO alerts (patient_id, alert_message) VALUES (?, ?)`,
        [patientId, `🚨 HIGH RISK: Score ${score.toFixed(1)}`]
      );
    }

    res.json({
      success: true,
      message: 'Metrics added successfully',
      score: score.toFixed(1),
      riskLevel,
    });
  } catch (error) {
    console.error('❌ Metrics Error:', error);
    res.status(500).json({ error: 'Server error while processing metrics' });
  }
});

// ─── GET METRICS HISTORY FOR A PATIENT ───────────────────────────────────────
router.get('/:patientId', async (req, res) => {
  try {
    const result = await query(
      `SELECT hm.*, rs.score, rs.risk_level
       FROM health_metrics hm
       LEFT JOIN risk_score rs ON hm.patient_id = rs.patient_id
       WHERE hm.patient_id = ?
       ORDER BY hm.date_record DESC`,
      [req.params.patientId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Get Metrics Error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

module.exports = router;
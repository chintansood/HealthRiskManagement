class RiskCalculator {
  /**
   * Calculates a composite risk score (0–100) from four vitals.
   * @param {number} bpSys   - Systolic blood pressure (mmHg)
   * @param {number} bpDia   - Diastolic blood pressure (mmHg)
   * @param {number} sugar   - Blood glucose level (mg/dL)
   * @param {number} bmi     - Body Mass Index
   * @returns {number} score between 0 and 100
   */
  calculateRisk(bpSys, bpDia, sugar, bmi) {
    let score = 0;

    // Systolic BP
    if (bpSys > 140)      score += 30;
    else if (bpSys > 130) score += 20;
    else if (bpSys > 120) score += 10;

    // Diastolic BP
    if (bpDia > 90)       score += 25;
    else if (bpDia > 80)  score += 15;

    // Blood sugar
    if (sugar > 200)      score += 40;
    else if (sugar > 140) score += 25;
    else if (sugar > 100) score += 15;

    // BMI
    if (bmi > 30)         score += 30;
    else if (bmi > 25)    score += 20;
    else if (bmi < 18.5)  score += 10;

    return Math.min(score, 100);
  }

  /**
   * Maps a numeric score to a human-readable risk tier.
   * @param {number} score
   * @returns {'LOW' | 'MEDIUM' | 'HIGH'}
   */
  getRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }
}

module.exports = new RiskCalculator();
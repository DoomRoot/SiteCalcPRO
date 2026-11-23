import { describe, it, expect } from 'vitest';
import {
  NPD_ANNUAL_LIMIT,
  NPD_BONUS_TOTAL,
  NPD_RATE_INDIVIDUAL,
  NPD_RATE_BUSINESS,
  INSURANCE_FIXED_2026,
  INSURANCE_OVER_300K_THRESHOLD,
  INSURANCE_OVER_300K_MAX,
  USN_INCOME_RATE,
  AUSN_INCOME_RATE,
  AUSN_TRAUMA_INSURANCE,
  AUSN_INCOME_LIMIT,
  calculateNpd,
  compareRegimes,
} from './tax';

describe('calculateNpd', () => {
  it('returns zero tax for zero income', () => {
    const result = calculateNpd(0, 1);
    expect(result.monthlyTax).toBe(0);
    expect(result.annualTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.netMonthlyIncome).toBe(0);
    expect(result.isOverLimit).toBe(false);
    expect(result.limitReachedMonth).toBeNull();
  });

  it('calculates 4% for 100% individual income', () => {
    const result = calculateNpd(100_000, 1, 0);
    expect(result.monthlyTax).toBe(100_000 * NPD_RATE_INDIVIDUAL);
    expect(result.annualTax).toBe(100_000 * 12 * NPD_RATE_INDIVIDUAL);
    expect(result.effectiveRate).toBeCloseTo(4, 1);
  });

  it('calculates 6% for 100% business income', () => {
    const result = calculateNpd(100_000, 0, 0);
    expect(result.monthlyTax).toBe(100_000 * NPD_RATE_BUSINESS);
    expect(result.annualTax).toBe(100_000 * 12 * NPD_RATE_BUSINESS);
    expect(result.effectiveRate).toBeCloseTo(6, 1);
  });

  it('applies bonus to reduce individual rate from 4% to 3%', () => {
    const result = calculateNpd(100_000, 1, NPD_BONUS_TOTAL);
    // Bonus reduces 4% → 3% (saves 1% = 1000/month, 12000/year)
    // Full bonus = 10000, annual potential = 12000, so 10000 is used
    const baseTax = 100_000 * NPD_RATE_INDIVIDUAL;
    const bonusSaving = Math.min(100_000 * 0.01 * 12, NPD_BONUS_TOTAL) / 12;
    const expectedMonthly = baseTax - bonusSaving;
    expect(result.monthlyTax).toBeCloseTo(expectedMonthly, 2);
    expect(result.bonusUsed).toBeCloseTo(NPD_BONUS_TOTAL, 2);
    expect(result.bonusRemaining).toBeCloseTo(0, 2);
  });

  it('applies bonus to reduce business rate from 6% to 4%', () => {
    const result = calculateNpd(50_000, 0, NPD_BONUS_TOTAL);
    // Bonus reduces 6% → 4% (saves 2% = 1000/month, 12000/year)
    // Full bonus = 10000, annual potential = 12000, so 10000 is used
    expect(result.bonusUsed).toBeCloseTo(NPD_BONUS_TOTAL, 2);
  });

  it('uses only remaining bonus when partially used', () => {
    const remaining = 3_000;
    const result = calculateNpd(100_000, 1, remaining);
    expect(result.bonusUsed).toBeCloseTo(remaining, 2);
    expect(result.bonusRemaining).toBeCloseTo(0, 2);
  });

  it('calculates mixed individual/business income', () => {
    const result = calculateNpd(200_000, 0.5, 0);
    // 100k at 4% + 100k at 6% = 4000 + 6000 = 10000
    expect(result.monthlyTax).toBe(10_000);
    expect(result.annualTax).toBe(120_000);
    expect(result.effectiveRate).toBeCloseTo(5, 1);
  });

  it('detects over-limit income', () => {
    const result = calculateNpd(250_000, 1); // 3M/year > 2.4M limit
    expect(result.annualIncome).toBe(3_000_000);
    expect(result.isOverLimit).toBe(true);
    expect(result.limitProgress).toBeGreaterThan(1);
  });

  it('calculates limitReachedMonth correctly within 12 months', () => {
    // 200k/month = 2.4M/year → limit reached at month 12
    const result = calculateNpd(200_000, 1);
    expect(result.limitReachedMonth).toBe(12);
    expect(result.isOverLimit).toBe(false);
  });

  it('returns null limitReachedMonth when income stays under limit', () => {
    // 100k/month = 1.2M/year → never reaches 2.4M
    const result = calculateNpd(100_000, 1);
    expect(result.limitReachedMonth).toBeNull();
  });

  it('calculates net income correctly', () => {
    const result = calculateNpd(100_000, 1, 0);
    expect(result.netMonthlyIncome).toBe(100_000 - result.monthlyTax);
    expect(result.netAnnualIncome).toBe(1_200_000 - result.annualTax);
  });

  it('never returns negative tax', () => {
    const result = calculateNpd(1, 1, NPD_BONUS_TOTAL);
    expect(result.monthlyTax).toBeGreaterThanOrEqual(0);
    expect(result.annualTax).toBeGreaterThanOrEqual(0);
  });
});

describe('compareRegimes', () => {
  it('returns 4 regimes', () => {
    const results = compareRegimes(1_000_000, 0.3, 1);
    expect(results).toHaveLength(4);
    expect(results.map((r) => r.regime)).toEqual([
      'НПД (самозанятость)',
      'УСН «Доходы» 6%',
      'УСН «Доходы − расходы» 15%',
      'АУСН «Доходы» 8%',
    ]);
  });

  it('marks exactly one regime as recommended', () => {
    const results = compareRegimes(1_000_000, 0.3, 1);
    const recommended = results.filter((r) => r.recommended);
    expect(recommended).toHaveLength(1);
  });

  it('recommends НПД for low income with individual clients', () => {
    const results = compareRegimes(500_000, 0, 1);
    const recommended = results.find((r) => r.recommended)!;
    expect(recommended.regime).toBe('НПД (самозанятость)');
  });

  it('НПД has zero insurance contributions', () => {
    const results = compareRegimes(1_000_000, 0, 1);
    const npd = results[0];
    expect(npd.insuranceContributions).toBe(0);
    expect(npd.totalPayments).toBe(npd.annualTax);
  });

  it('calculates НПД tax with bonus correctly', () => {
    const results = compareRegimes(1_000_000, 0, 1);
    const npd = results[0];
    // 1M * 4% = 40000 base, bonus = min(1M * 1%, 10000) = 10000
    expect(npd.annualTax).toBe(40_000 - 10_000);
  });

  it('calculates УСН Доходы with insurance deduction', () => {
    const income = 1_000_000;
    const results = compareRegimes(income, 0, 1);
    const usn = results[1];
    const tax = income * USN_INCOME_RATE;
    const insurance = INSURANCE_FIXED_2026 + (income - INSURANCE_OVER_300K_THRESHOLD) * 0.01;
    const taxAfterDeduction = Math.max(0, tax - insurance);
    expect(usn.annualTax).toBeCloseTo(taxAfterDeduction, 0);
    expect(usn.insuranceContributions).toBeCloseTo(insurance, 0);
    expect(usn.totalPayments).toBeCloseTo(taxAfterDeduction + insurance, 0);
  });

  it('calculates АУСН correctly', () => {
    const income = 1_000_000;
    const results = compareRegimes(income, 0, 1);
    const ausn = results[3];
    expect(ausn.annualTax).toBe(income * AUSN_INCOME_RATE);
    expect(ausn.insuranceContributions).toBe(AUSN_TRAUMA_INSURANCE);
    expect(ausn.totalPayments).toBe(income * AUSN_INCOME_RATE + AUSN_TRAUMA_INSURANCE);
  });

  it('applies minimum tax rule for УСН Д-Р when expenses are high', () => {
    const income = 1_000_000;
    const expenseRatio = 0.95; // 95% expenses → tax base nearly zero
    const results = compareRegimes(income, expenseRatio, 1);
    const usnDmr = results[2];
    const minTax = income * 0.01; // 1% minimum
    expect(usnDmr.annualTax).toBeGreaterThanOrEqual(minTax);
  });

  it('excludes НПД from recommendation when over limit', () => {
    const results = compareRegimes(NPD_ANNUAL_LIMIT + 1, 0, 1);
    const npd = results[0];
    expect(npd.recommended).toBe(false);
  });

  it('excludes АУСН from recommendation when over its limit', () => {
    const results = compareRegimes(AUSN_INCOME_LIMIT + 1, 0, 1);
    const ausn = results[3];
    expect(ausn.recommended).toBe(false);
  });

  it('calculates effective rate for all regimes', () => {
    const results = compareRegimes(2_000_000, 0.3, 0.5);
    for (const r of results) {
      expect(r.effectiveRate).toBeGreaterThanOrEqual(0);
      expect(r.effectiveRate).toBeLessThanOrEqual(100);
      expect(r.effectiveRate).toBeCloseTo((r.totalPayments / 2_000_000) * 100, 5);
    }
  });

  it('provides pros and cons for all regimes', () => {
    const results = compareRegimes(1_000_000, 0, 1);
    for (const r of results) {
      expect(r.pros.length).toBeGreaterThan(0);
      expect(r.cons.length).toBeGreaterThan(0);
    }
  });

  it('insurance caps at maximum', () => {
    const hugeIncome = 100_000_000;
    const results = compareRegimes(hugeIncome, 0, 1);
    const usn = results[1];
    const maxInsurance = INSURANCE_FIXED_2026 + INSURANCE_OVER_300K_MAX;
    expect(usn.insuranceContributions).toBe(maxInsurance);
  });

  it('returns zero effective rate for zero income', () => {
    const results = compareRegimes(0, 0, 1);
    for (const r of results) {
      expect(r.effectiveRate).toBe(0);
    }
  });
});

/** Annual НПД limit in rubles */
export const NPD_ANNUAL_LIMIT = 2_400_000;

/** НПД tax bonus (стартовый бонус) */
export const NPD_BONUS_TOTAL = 10_000;

/** НПД rates */
export const NPD_RATE_INDIVIDUAL = 0.04;
export const NPD_RATE_BUSINESS = 0.06;

/** НПД bonus reduction rates */
export const NPD_BONUS_RATE_INDIVIDUAL = 0.01; // reduces 4% -> 3%
export const NPD_BONUS_RATE_BUSINESS = 0.02;   // reduces 6% -> 4%

/** Insurance contributions for 2026 (ИП на УСН/ПСН) */
export const INSURANCE_FIXED_2026 = 57_390;

/** Additional insurance over 300K threshold */
export const INSURANCE_OVER_300K_RATE = 0.01;
export const INSURANCE_OVER_300K_THRESHOLD = 300_000;
export const INSURANCE_OVER_300K_MAX = 321_818;

/** Total max insurance (fixed + 1%) */
export const INSURANCE_TOTAL_MAX = 379_208;

/** USN rates */
export const USN_INCOME_RATE = 0.06;
export const USN_INCOME_EXPENSES_RATE = 0.15;
export const USN_MIN_TAX_RATE = 0.01;

/** AUSN rates */
export const AUSN_INCOME_RATE = 0.08;
export const AUSN_INCOME_EXPENSES_RATE = 0.20;
export const AUSN_MIN_TAX_RATE = 0.03;
export const AUSN_INCOME_LIMIT = 60_000_000;
export const AUSN_TRAUMA_INSURANCE = 2_959;

export interface NpdCalculation {
  monthlyIncome: number;
  individualShare: number;
  annualIncome: number;
  effectiveRate: number;
  monthlyTax: number;
  annualTax: number;
  netMonthlyIncome: number;
  netAnnualIncome: number;
  bonusUsed: number;
  bonusRemaining: number;
  limitProgress: number;
  limitReachedMonth: number | null;
  isOverLimit: boolean;
}

export function calculateNpd(
  monthlyIncome: number,
  individualShare: number,
  currentBonusRemaining: number = NPD_BONUS_TOTAL
): NpdCalculation {
  const annualIncome = monthlyIncome * 12;
  const incomeFromIndividuals = monthlyIncome * individualShare;
  const incomeFromBusiness = monthlyIncome * (1 - individualShare);

  const baseTax4 = incomeFromIndividuals * NPD_RATE_INDIVIDUAL;
  const baseTax6 = incomeFromBusiness * NPD_RATE_BUSINESS;
  const baseTaxMonthly = baseTax4 + baseTax6;

  const potentialBonusReduction4 = incomeFromIndividuals * NPD_BONUS_RATE_INDIVIDUAL;
  const potentialBonusReduction6 = incomeFromBusiness * NPD_BONUS_RATE_BUSINESS;
  const potentialBonusReduction = potentialBonusReduction4 + potentialBonusReduction6;

  const annualPotentialBonus = potentialBonusReduction * 12;
  const actualAnnualBonusUsed = Math.min(annualPotentialBonus, currentBonusRemaining);
  const monthlyBonusReduction = annualPotentialBonus > 0
    ? potentialBonusReduction * (actualAnnualBonusUsed / annualPotentialBonus)
    : 0;

  const monthlyTax = baseTaxMonthly - monthlyBonusReduction;
  const annualTax = monthlyTax * 12;

  const effectiveRate = annualIncome > 0
    ? (Math.max(0, annualTax) / annualIncome) * 100
    : 0;

  const limitProgress = annualIncome / NPD_ANNUAL_LIMIT;
  const limitReachedMonth = monthlyIncome > 0
    ? Math.ceil(NPD_ANNUAL_LIMIT / monthlyIncome)
    : null;

  return {
    monthlyIncome,
    individualShare,
    annualIncome,
    effectiveRate,
    monthlyTax: Math.max(0, monthlyTax),
    annualTax: Math.max(0, annualTax),
    netMonthlyIncome: monthlyIncome - Math.max(0, monthlyTax),
    netAnnualIncome: annualIncome - Math.max(0, annualTax),
    bonusUsed: actualAnnualBonusUsed,
    bonusRemaining: currentBonusRemaining - actualAnnualBonusUsed,
    limitProgress,
    limitReachedMonth: limitReachedMonth !== null && limitReachedMonth <= 12 ? limitReachedMonth : null,
    isOverLimit: annualIncome > NPD_ANNUAL_LIMIT,
  };
}

function calculateInsurance(annualIncome: number): number {
  const over300k = annualIncome > INSURANCE_OVER_300K_THRESHOLD
    ? Math.min(
        (annualIncome - INSURANCE_OVER_300K_THRESHOLD) * INSURANCE_OVER_300K_RATE,
        INSURANCE_OVER_300K_MAX
      )
    : 0;
  return INSURANCE_FIXED_2026 + over300k;
}

export interface RegimeComparison {
  regime: string;
  annualTax: number;
  insuranceContributions: number;
  totalPayments: number;
  effectiveRate: number;
  pros: string[];
  cons: string[];
  recommended: boolean;
}

export function compareRegimes(
  annualIncome: number,
  expenseRatio: number,
  individualShare: number
): RegimeComparison[] {
  const expenses = annualIncome * expenseRatio;
  const totalInsurance = calculateInsurance(annualIncome);

  // НПД (с учётом бонуса)
  const npdIncomeInd = annualIncome * individualShare;
  const npdIncomeBiz = annualIncome * (1 - individualShare);
  const npdBaseTax = npdIncomeInd * NPD_RATE_INDIVIDUAL + npdIncomeBiz * NPD_RATE_BUSINESS;
  const npdBonusReduction = Math.min(
    npdIncomeInd * NPD_BONUS_RATE_INDIVIDUAL + npdIncomeBiz * NPD_BONUS_RATE_BUSINESS,
    NPD_BONUS_TOTAL
  );
  const npdTax = npdBaseTax - npdBonusReduction;
  const npdTotal = Math.max(0, npdTax);

  // УСН Доходы 6%
  const usnIncomeTax = annualIncome * USN_INCOME_RATE;
  const usnIncomeAfterDeduction = Math.max(0, usnIncomeTax - totalInsurance);
  const usnIncomeTotal = usnIncomeAfterDeduction + totalInsurance;

  // УСН Доходы минус расходы 15%
  const usnDmrTaxBase = Math.max(0, annualIncome - expenses - totalInsurance);
  const usnDmrBase = usnDmrTaxBase * USN_INCOME_EXPENSES_RATE;
  const usnMinTax = annualIncome * USN_MIN_TAX_RATE;
  const usnDmrTax = Math.max(usnDmrBase, usnMinTax);
  const usnDmrTotal = usnDmrTax + totalInsurance;

  // АУСН Доходы 8%
  const ausnIncomeTax = annualIncome * AUSN_INCOME_RATE;
  const ausnIncomeTotal = ausnIncomeTax + AUSN_TRAUMA_INSURANCE;

  const results: RegimeComparison[] = [
    {
      regime: 'НПД (самозанятость)',
      annualTax: npdTotal,
      insuranceContributions: 0,
      totalPayments: npdTotal,
      effectiveRate: annualIncome > 0 ? (npdTotal / annualIncome) * 100 : 0,
      pros: [
        'Нет страховых взносов',
        'Простая регистрация через приложение',
        'Автоматический расчёт налога',
        'Нет отчётности и деклараций',
      ],
      cons: [
        `Лимит дохода ${(NPD_ANNUAL_LIMIT / 1_000_000).toFixed(1)} млн ₽/год`,
        'Нельзя нанимать сотрудников',
        'Не идёт трудовой стаж',
        'Нет больничных (есть добровольное страхование)',
      ],
      recommended: false,
    },
    {
      regime: 'УСН «Доходы» 6%',
      annualTax: usnIncomeAfterDeduction,
      insuranceContributions: totalInsurance,
      totalPayments: usnIncomeTotal,
      effectiveRate: annualIncome > 0 ? (usnIncomeTotal / annualIncome) * 100 : 0,
      pros: [
        'Лимит дохода до 490,5 млн ₽',
        'Можно нанимать до 130 сотрудников',
        'Идёт пенсионный стаж',
        'Вычет страховых из налога (до 100%)',
      ],
      cons: [
        `Обязательные взносы ${(INSURANCE_FIXED_2026 / 1000).toFixed(1)} тыс. ₽ + 1%`,
        'Нужна бухгалтерия и отчётность',
        'НДС при доходе свыше 20 млн ₽',
        'Ежеквартальные авансовые платежи',
      ],
      recommended: false,
    },
    {
      regime: 'УСН «Доходы − расходы» 15%',
      annualTax: usnDmrTax,
      insuranceContributions: totalInsurance,
      totalPayments: usnDmrTotal,
      effectiveRate: annualIncome > 0 ? (usnDmrTotal / annualIncome) * 100 : 0,
      pros: [
        'Расходы уменьшают налоговую базу',
        'Выгодно при расходах более 60%',
        'Лимит дохода до 490,5 млн ₽',
        'Можно нанимать до 130 сотрудников',
      ],
      cons: [
        `Обязательные взносы ${(INSURANCE_FIXED_2026 / 1000).toFixed(1)} тыс. ₽ + 1%`,
        'Минимальный налог 1% от дохода',
        'Строгий учёт и подтверждение расходов',
        'НДС при доходе свыше 20 млн ₽',
      ],
      recommended: false,
    },
    {
      regime: 'АУСН «Доходы» 8%',
      annualTax: ausnIncomeTax,
      insuranceContributions: AUSN_TRAUMA_INSURANCE,
      totalPayments: ausnIncomeTotal,
      effectiveRate: annualIncome > 0 ? (ausnIncomeTotal / annualIncome) * 100 : 0,
      pros: [
        'Нет страховых взносов ИП',
        'Нет бухгалтерии и деклараций',
        'Налог считает ФНС автоматически',
        'Можно нанимать до 5 сотрудников',
      ],
      cons: [
        'Ставка выше УСН (8% vs 6%)',
        'Лимит дохода 60 млн ₽',
        'Максимум 5 сотрудников',
        'Эксперимент до конца 2027 года',
      ],
      recommended: false,
    },
  ];

  // Determine recommendation
  const isNpdAvailable = annualIncome <= NPD_ANNUAL_LIMIT;
  const isAusnAvailable = annualIncome <= AUSN_INCOME_LIMIT;

  let minTotal = Infinity;
  let minIndex = 0;
  results.forEach((r, i) => {
    if (i === 0 && !isNpdAvailable) return;
    if (i === 3 && !isAusnAvailable) return;
    if (r.totalPayments < minTotal) {
      minTotal = r.totalPayments;
      minIndex = i;
    }
  });
  results[minIndex].recommended = true;

  return results;
}

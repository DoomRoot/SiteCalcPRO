import { type FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Wallet,
  PiggyBank,
  Gift,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import NumberInput from '../components/NumberInput';
import ResultCard from '../components/ResultCard';
import ProgressBar from '../components/ProgressBar';
import Tooltip from '../components/Tooltip';
import { formatRubles } from '../utils/format';
import { calculateNpd, NPD_ANNUAL_LIMIT, NPD_BONUS_TOTAL } from '../utils/tax';

type ClientType = 'individual' | 'business' | 'mixed';

const CalculatorPage: FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [clientType, setClientType] = useState<ClientType>('individual');
  const [mixedShare, setMixedShare] = useState(50);

  const individualShare = useMemo(() => {
    switch (clientType) {
      case 'individual':
        return 1;
      case 'business':
        return 0;
      case 'mixed':
        return mixedShare / 100;
    }
  }, [clientType, mixedShare]);

  const result = useMemo(
    () => calculateNpd(monthlyIncome, individualShare, NPD_BONUS_TOTAL),
    [monthlyIncome, individualShare]
  );

  const monthNames = [
    'январе', 'феврале', 'марте', 'апреле', 'мае', 'июне',
    'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Калькулятор НПД' }]} />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
          Калькулятор НПД
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Рассчитайте налог на профессиональный доход и узнайте, сколько вы заработаете на руки
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input panel */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Calculator size={20} className="text-primary-600" />
              Параметры
            </h2>

            <div className="space-y-5">
              <NumberInput
                label="Ежемесячный доход"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                helpText="Укажите средний доход в месяц до вычета налога"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Тип клиентов{' '}
                  <Tooltip text="Ставка НПД зависит от того, кто ваш заказчик: физлица (4%) или юрлица и ИП (6%)" />
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { value: 'individual' as ClientType, label: 'Физлица', rate: '4%' },
                    { value: 'business' as ClientType, label: 'Юрлица / ИП', rate: '6%' },
                    { value: 'mixed' as ClientType, label: 'Смешанный', rate: '4–6%' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setClientType(opt.value)}
                      className={`rounded-lg border-2 px-3 py-2.5 text-center text-sm font-medium transition-all ${
                        clientType === opt.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className="mt-0.5 text-xs opacity-70">{opt.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {clientType === 'mixed' && (
                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>Доля физлиц: {mixedShare}%</span>
                    <span className="text-gray-400">Юрлица: {100 - mixedShare}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={mixedShare}
                    onChange={(e) => setMixedShare(Number(e.target.value))}
                    className="w-full accent-primary-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Limit progress */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <TrendingUp size={20} className="text-primary-600" />
              Лимит дохода{' '}
              <Tooltip text="Максимальный годовой доход на НПД — 2,4 млн рублей. При превышении вы автоматически теряете статус самозанятого." />
            </h2>
            <ProgressBar
              value={result.limitProgress}
              label={`${formatRubles(result.annualIncome)} из ${formatRubles(NPD_ANNUAL_LIMIT)}`}
              size="lg"
            />
            {result.isOverLimit && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-300">
                <AlertTriangle size={16} />
                Годовой доход превышает лимит! Рассмотрите переход на УСН.
              </div>
            )}
            {!result.isOverLimit && result.limitReachedMonth && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700 dark:bg-warning-900/30 dark:text-warning-300">
                <AlertTriangle size={16} />
                При таком доходе лимит будет достигнут в {monthNames[result.limitReachedMonth - 1]}
              </div>
            )}
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-6 lg:col-span-3">
          <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Результат за месяц
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ResultCard
                label="Налог НПД"
                value={formatRubles(result.monthlyTax)}
                icon={<Calculator size={20} />}
                helpText={
                  clientType === 'individual'
                    ? `Ставка 4% для физлиц (эфф. ${result.effectiveRate.toFixed(1)}%)`
                    : clientType === 'business'
                      ? `Ставка 6% для юрлиц (эфф. ${result.effectiveRate.toFixed(1)}%)`
                      : `Физлица ${mixedShare}% × 4% + Юрлица ${100 - mixedShare}% × 6% (эфф. ${result.effectiveRate.toFixed(1)}%)`
                }
              />
              <ResultCard
                label="На руки"
                value={formatRubles(result.netMonthlyIncome)}
                icon={<Wallet size={20} />}
                delta={`${((result.netMonthlyIncome / (monthlyIncome || 1)) * 100).toFixed(1)}% от дохода`}
                deltaType="positive"
              />
              <ResultCard
                label="Экономия с бонусом"
                value={formatRubles(
                  result.bonusUsed > 0
                    ? result.bonusUsed / 12
                    : 0
                )}
                icon={<Gift size={20} />}
                helpText={`Остаток бонуса: ${formatRubles(Math.max(0, result.bonusRemaining))}`}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Прогноз за год
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ResultCard
                label="Годовой доход"
                value={formatRubles(result.annualIncome)}
                icon={<TrendingUp size={20} />}
                size="lg"
              />
              <ResultCard
                label="Налог за год"
                value={formatRubles(result.annualTax)}
                icon={<Calculator size={20} />}
                delta={`Эффективная ставка: ${result.effectiveRate.toFixed(1)}%`}
                deltaType="neutral"
                size="lg"
              />
              <ResultCard
                label="Чистый доход за год"
                value={formatRubles(result.netAnnualIncome)}
                icon={<PiggyBank size={20} />}
                size="lg"
              />
            </div>
          </div>

          {/* Bonus tracker */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Gift size={20} className="text-accent-600" />
              Налоговый бонус{' '}
              <Tooltip text="Каждому самозанятому даётся бонус 10 000 ₽, который автоматически уменьшает ставку: с 4% до 3% для физлиц, с 6% до 4% для юрлиц. Расходуется постепенно." />
            </h2>
            <ProgressBar
              value={result.bonusRemaining / NPD_BONUS_TOTAL}
              label={`Осталось ${formatRubles(Math.max(0, result.bonusRemaining))} из ${formatRubles(NPD_BONUS_TOTAL)}`}
              thresholds={{ warning: 0.3, danger: 0.1 }}
            />
            {result.bonusUsed > 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                За год будет использовано: {formatRubles(result.bonusUsed)}
              </p>
            )}
          </div>

          {/* Quick comparison CTA */}
          <div className="rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-6 text-center dark:border-primary-800 dark:bg-primary-900/10">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              Хотите узнать, не выгоднее ли вам другой режим?
            </p>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700"
            >
              Сравнить режимы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;

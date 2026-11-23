import { type FC, useState, useMemo, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Save,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ProgressBar from '../components/ProgressBar';
import ResultCard from '../components/ResultCard';
import { formatRubles, formatNumber, parseFormattedNumber } from '../utils/format';
import { NPD_ANNUAL_LIMIT } from '../utils/tax';

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const SHORT_MONTHS = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
];

const STORAGE_KEY = 'samznayu-tracker-data';

interface TrackerData {
  year: number;
  months: number[];
}

function loadData(): TrackerData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TrackerData;
      if (parsed.year && Array.isArray(parsed.months) && parsed.months.length === 12) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { year: new Date().getFullYear(), months: Array(12).fill(0) as number[] };
}

function saveData(data: TrackerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const TrackerPage: FC = () => {
  const [data, setData] = useState<TrackerData>(loadData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const totalIncome = useMemo(
    () => data.months.reduce((sum, v) => sum + v, 0),
    [data.months]
  );

  const limitProgress = totalIncome / NPD_ANNUAL_LIMIT;
  const remaining = Math.max(0, NPD_ANNUAL_LIMIT - totalIncome);

  const maxMonthly = Math.max(...data.months, 1);

  // Find the month when limit is projected to be reached
  const projectedLimitMonth = useMemo(() => {
    const currentMonth = new Date().getMonth(); // 0-indexed
    const filledMonths = data.months.filter((v, i) => i <= currentMonth && v > 0);
    if (filledMonths.length === 0) return null;
    const avgMonthly = filledMonths.reduce((s, v) => s + v, 0) / filledMonths.length;
    if (avgMonthly <= 0) return null;

    let running = 0;
    for (let i = 0; i < 12; i++) {
      running += i <= currentMonth ? data.months[i] : avgMonthly;
      if (running >= NPD_ANNUAL_LIMIT) return i;
    }
    return null;
  }, [data.months]);

  const handleMonthChange = useCallback(
    (index: number, value: number) => {
      const newMonths = [...data.months];
      newMonths[index] = value;
      setData({ ...data, months: newMonths });
    },
    [data]
  );

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(data.months[index] > 0 ? data.months[index].toString() : '');
  };

  const finishEditing = () => {
    if (editingIndex !== null) {
      const val = parseFormattedNumber(editValue);
      handleMonthChange(editingIndex, Math.max(0, val));
    }
    setEditingIndex(null);
  };

  const handleReset = () => {
    setData({ year: data.year, months: Array(12).fill(0) as number[] });
  };

  const currentMonthIndex = new Date().getMonth();

  // Cumulative totals for the chart
  const cumulativeByMonth = useMemo(() => {
    const cumulative: number[] = [];
    let running = 0;
    for (let i = 0; i < 12; i++) {
      running += data.months[i];
      cumulative.push(running);
    }
    return cumulative;
  }, [data.months]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Трекер доходов' }]} />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Трекер доходов {data.year}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ведите учёт доходов по месяцам и контролируйте приближение к лимиту
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw size={14} /> Сбросить
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="Общий доход"
          value={formatRubles(totalIncome)}
          icon={<TrendingUp size={20} />}
        />
        <ResultCard
          label="Осталось до лимита"
          value={formatRubles(remaining)}
          deltaType={remaining < 500000 ? 'negative' : 'positive'}
          delta={remaining < 500000 ? 'Лимит скоро!' : ''}
        />
        <ResultCard
          label="Средний доход в месяц"
          value={formatRubles(
            totalIncome > 0
              ? totalIncome / Math.max(1, data.months.filter((v) => v > 0).length)
              : 0
          )}
        />
        <ResultCard
          label="Прогресс к лимиту"
          value={`${Math.min(100, Math.round(limitProgress * 100))}%`}
          deltaType={limitProgress >= 0.9 ? 'negative' : limitProgress >= 0.7 ? 'neutral' : 'positive'}
        />
      </div>

      {/* Limit progress */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ProgressBar
          value={limitProgress}
          label={`${formatRubles(totalIncome)} из ${formatRubles(NPD_ANNUAL_LIMIT)}`}
          size="lg"
        />
        {totalIncome > NPD_ANNUAL_LIMIT && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-300">
            <AlertTriangle size={16} />
            Лимит дохода превышен! Необходимо перейти на другой налоговый режим.
          </div>
        )}
        {projectedLimitMonth !== null && totalIncome <= NPD_ANNUAL_LIMIT && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700 dark:bg-warning-900/30 dark:text-warning-300">
            <AlertTriangle size={16} />
            По текущему темпу лимит будет достигнут в {MONTHS[projectedLimitMonth].toLowerCase()}
          </div>
        )}
      </div>

      {/* Empty state */}
      {totalIncome === 0 && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-8 text-center dark:border-primary-800 dark:bg-primary-900/20">
          <img
            src={`${import.meta.env.BASE_URL}images/mascot-avatar.png`}
            alt=""
            className="mx-auto mb-4 h-20 w-20 opacity-90"
          />
          <p className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Начните вводить доходы!
          </p>
          <p className="mx-auto max-w-md text-sm text-gray-600 dark:text-gray-400">
            Кликните на любой месяц ниже и укажите сумму дохода. Я буду следить за вашим лимитом 2,4 млн ₽ и предупрежу заранее.
          </p>
        </div>
      )}

      {/* Bar chart */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
          Доход по месяцам
        </h2>
        <div className="flex items-end gap-1 sm:gap-2" style={{ height: '200px' }}>
          {data.months.map((value, index) => {
            const heightPercent = maxMonthly > 0 ? (value / maxMonthly) * 100 : 0;
            const isCurrent = index === currentMonthIndex;
            const cumOver = cumulativeByMonth[index] > NPD_ANNUAL_LIMIT;

            return (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex w-full flex-col items-center justify-end" style={{ height: '180px' }}>
                  {value > 0 && (
                    <span className="mb-1 text-[10px] font-mono text-gray-500 dark:text-gray-400">
                      {formatNumber(value)}
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      cumOver
                        ? 'bg-danger-400 dark:bg-danger-600'
                        : isCurrent
                          ? 'bg-primary-500 dark:bg-primary-400'
                          : 'bg-primary-300 dark:bg-primary-600'
                    }`}
                    style={{ height: `${Math.max(heightPercent, value > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span className={`text-[10px] sm:text-xs ${
                  isCurrent ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {SHORT_MONTHS[index]}
                </span>
              </div>
            );
          })}
        </div>
        {/* Limit line hint */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="h-0.5 w-4 bg-danger-400" />
          Красный цвет — накопленный доход превышает лимит {formatRubles(NPD_ANNUAL_LIMIT)}
        </div>
      </div>

      {/* Monthly grid */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Введите доходы по месяцам
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Save size={12} /> Сохраняется автоматически
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MONTHS.map((month, index) => {
            const cumulative = cumulativeByMonth[index];
            const isOver = cumulative > NPD_ANNUAL_LIMIT;
            const isCurrent = index === currentMonthIndex;

            return (
              <div
                key={index}
                className={`rounded-xl border-2 p-3 transition-colors ${
                  isCurrent
                    ? 'border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                    : isOver
                      ? 'border-danger-200 bg-danger-50/50 dark:border-danger-800 dark:bg-danger-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {month}
                    {isCurrent && (
                      <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-primary-500" />
                    )}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                    &Sigma; {formatNumber(cumulative)}
                  </span>
                </div>
                {editingIndex === index ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={finishEditing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishEditing();
                    }}
                    autoFocus
                    className="w-full rounded-lg border border-primary-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-primary-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(index)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left font-mono text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-primary-500"
                  >
                    {data.months[index] > 0 ? `${formatNumber(data.months[index])} ₽` : '—'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;

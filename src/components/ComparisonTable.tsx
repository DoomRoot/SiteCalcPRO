import type { FC } from 'react';
import { formatRubles, formatPercent } from '../utils/format';
import type { RegimeComparison } from '../utils/tax';
import { Check, X, Star } from 'lucide-react';

interface ComparisonTableProps {
  data: RegimeComparison[];
}

const ComparisonTable: FC<ComparisonTableProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Параметр
              </th>
              {data.map((regime) => (
                <th
                  key={regime.regime}
                  className={`px-6 py-4 text-sm font-semibold ${
                    regime.recommended
                      ? 'bg-accent-50 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {regime.regime}
                    {regime.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-bold text-accent-700 dark:bg-accent-800 dark:text-accent-300">
                        <Star size={12} fill="currentColor" /> Выгоднее
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">Налог за год</td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 font-mono text-sm font-semibold ${
                    r.recommended
                      ? 'bg-accent-50/50 dark:bg-accent-900/10'
                      : ''
                  } text-gray-900 dark:text-white`}
                >
                  {formatRubles(r.annualTax)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">Страховые взносы</td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 font-mono text-sm ${
                    r.recommended ? 'bg-accent-50/50 dark:bg-accent-900/10' : ''
                  } text-gray-900 dark:text-white`}
                >
                  {r.insuranceContributions > 0
                    ? formatRubles(r.insuranceContributions)
                    : '—'}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
              <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">
                Итого платежей
              </td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 font-mono text-sm font-bold ${
                    r.recommended
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {formatRubles(r.totalPayments)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                Эффективная ставка
              </td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 font-mono text-sm ${
                    r.recommended ? 'bg-accent-50/50 dark:bg-accent-900/10' : ''
                  } text-gray-900 dark:text-white`}
                >
                  {formatPercent(Math.round(r.effectiveRate * 10) / 10)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">Преимущества</td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 ${
                    r.recommended ? 'bg-accent-50/50 dark:bg-accent-900/10' : ''
                  }`}
                >
                  <ul className="space-y-1">
                    {r.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-accent-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">Недостатки</td>
              {data.map((r) => (
                <td
                  key={r.regime}
                  className={`px-6 py-3 ${
                    r.recommended ? 'bg-accent-50/50 dark:bg-accent-900/10' : ''
                  }`}
                >
                  <ul className="space-y-1">
                    {r.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <X size={14} className="mt-0.5 flex-shrink-0 text-danger-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {data.map((regime) => (
          <div
            key={regime.regime}
            className={`rounded-xl border-2 p-5 ${
              regime.recommended
                ? 'border-accent-300 bg-accent-50/50 dark:border-accent-700 dark:bg-accent-900/20'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {regime.regime}
              </h3>
              {regime.recommended && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-bold text-accent-700 dark:bg-accent-800 dark:text-accent-300">
                  <Star size={12} fill="currentColor" /> Выгоднее
                </span>
              )}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Налог</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {formatRubles(regime.annualTax)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Взносы</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {regime.insuranceContributions > 0
                    ? formatRubles(regime.insuranceContributions)
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Итого</p>
                <p className={`font-mono text-lg font-bold ${
                  regime.recommended
                    ? 'text-accent-700 dark:text-accent-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {formatRubles(regime.totalPayments)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ставка</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPercent(Math.round(regime.effectiveRate * 10) / 10)}
                </p>
              </div>
            </div>
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Подробнее
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
                    Плюсы
                  </p>
                  <ul className="space-y-1">
                    {regime.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Check size={12} className="mt-0.5 flex-shrink-0 text-accent-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-danger-600 dark:text-danger-400">
                    Минусы
                  </p>
                  <ul className="space-y-1">
                    {regime.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <X size={12} className="mt-0.5 flex-shrink-0 text-danger-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonTable;

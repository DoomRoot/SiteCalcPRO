import { type FC, useState, useMemo } from 'react';
import { BarChart3, ArrowRight, RotateCcw } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import NumberInput from '../components/NumberInput';
import ComparisonTable from '../components/ComparisonTable';
import Tooltip from '../components/Tooltip';
import { compareRegimes } from '../utils/tax';

interface QuizStep {
  id: string;
  question: string;
  helpText?: string;
  type: 'number' | 'select' | 'range';
  options?: { value: string; label: string; description?: string }[];
}

const quizSteps: QuizStep[] = [
  {
    id: 'income',
    question: 'Какой у вас годовой доход?',
    helpText: 'Укажите суммарный ожидаемый доход за год, до вычета любых налогов и взносов',
    type: 'number',
  },
  {
    id: 'expenses',
    question: 'Какова доля расходов в вашем доходе?',
    helpText: 'Расходы на материалы, аренду, субподряд и т.д. — важно для УСН «Доходы минус расходы»',
    type: 'range',
  },
  {
    id: 'clients',
    question: 'Кто ваши основные клиенты?',
    helpText: 'От типа клиентов зависит ставка НПД',
    type: 'select',
    options: [
      { value: 'individual', label: 'Физические лица', description: 'Ставка НПД — 4%' },
      { value: 'business', label: 'Юрлица и ИП', description: 'Ставка НПД — 6%' },
      { value: 'mixed', label: 'И те, и другие', description: 'Средняя ставка НПД — 5%' },
    ],
  },
  {
    id: 'employees',
    question: 'Планируете ли вы нанимать сотрудников?',
    type: 'select',
    options: [
      { value: 'no', label: 'Нет, работаю один', description: 'Подходит НПД' },
      { value: 'yes', label: 'Да, нужны сотрудники', description: 'НПД не подходит' },
    ],
  },
  {
    id: 'simplicity',
    question: 'Насколько важна простота учёта?',
    type: 'select',
    options: [
      { value: 'max', label: 'Максимально просто', description: 'Без деклараций и бухгалтерии' },
      { value: 'moderate', label: 'Готов вести учёт', description: 'Ежеквартальная отчётность' },
      { value: 'any', label: 'Не важно', description: 'Могу нанять бухгалтера' },
    ],
  },
];

const ComparePage: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({
    income: 1200000,
    expenses: 30,
    clients: 'individual',
    employees: 'no',
    simplicity: 'max',
  });
  const [showResults, setShowResults] = useState(false);

  const individualShare = useMemo(() => {
    switch (answers.clients) {
      case 'individual':
        return 1;
      case 'business':
        return 0;
      default:
        return 0.5;
    }
  }, [answers.clients]);

  const comparison = useMemo(
    () =>
      compareRegimes(
        Number(answers.income) || 0,
        (Number(answers.expenses) || 0) / 100,
        individualShare
      ),
    [answers.income, answers.expenses, individualShare]
  );

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setCurrentStep(0);
  };

  const step = quizSteps[currentStep];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Сравнение режимов' }]} />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
          Сравнение налоговых режимов
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ответьте на несколько вопросов, и мы покажем, какой режим выгоднее для вас
        </p>
      </div>

      {!showResults ? (
        <div className="mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Вопрос {currentStep + 1} из {quizSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / quizSteps.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="mb-1 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Вопрос {currentStep + 1}
              </span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {step.question}
            </h2>
            {step.helpText && (
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{step.helpText}</p>
            )}

            <div className="mb-8">
              {step.type === 'number' && (
                <NumberInput
                  label="Годовой доход"
                  value={Number(answers[step.id]) || 0}
                  onChange={(v) => setAnswers({ ...answers, [step.id]: v })}
                  max={50_000_000}
                />
              )}

              {step.type === 'range' && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Доля расходов
                    </span>
                    <span className="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">
                      {answers[step.id]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    step={5}
                    value={Number(answers[step.id]) || 0}
                    onChange={(e) =>
                      setAnswers({ ...answers, [step.id]: Number(e.target.value) })
                    }
                    className="w-full accent-primary-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-400">
                    <span>0% — услуги</span>
                    <span>90% — торговля</span>
                  </div>
                </div>
              )}

              {step.type === 'select' && step.options && (
                <div className="space-y-3">
                  {step.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [step.id]: opt.value })}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        answers[step.id] === opt.value
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                      }`}
                    >
                      <p className={`font-medium ${
                        answers[step.id] === opt.value
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {opt.label}
                      </p>
                      {opt.description && (
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {opt.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 dark:text-gray-400 dark:hover:text-white"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700"
              >
                {currentStep < quizSteps.length - 1 ? (
                  <>
                    Далее <ArrowRight size={16} />
                  </>
                ) : (
                  'Показать результат'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Summary */}
          <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-900/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-primary-700 dark:text-primary-300">Ваши параметры:</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  Доход: <strong>{Number(answers.income).toLocaleString('ru-RU')} ₽/год</strong>
                  {' · '}Расходы: <strong>{answers.expenses}%</strong>
                  {' · '}Клиенты: <strong>
                    {answers.clients === 'individual' ? 'физлица' : answers.clients === 'business' ? 'юрлица' : 'смешанные'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/40"
              >
                <RotateCcw size={14} /> Пересчитать
              </button>
            </div>
          </div>

          {/* Important note about employees */}
          {answers.employees === 'yes' && (
            <div className="mb-6 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-900/20">
              <p className="text-sm text-warning-800 dark:text-warning-200">
                <strong>Внимание:</strong> Вы указали, что планируете нанимать сотрудников.
                НПД (самозанятость) не позволяет нанимать работников по трудовому договору.
                Рассмотрите УСН или регистрацию как ИП.
              </p>
            </div>
          )}

          <ComparisonTable data={comparison} />

          <div className="mt-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
              <Tooltip text="Расчёт является приблизительным и основан на ставках 2026 года. Для точного расчёта обратитесь к налоговому консультанту." />
              {' '}Важная информация
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                Страховые взносы ИП на 2026 год: фиксированные 57 390 ₽ + 1% от дохода свыше 300 000 ₽ (макс. 321 818 ₽)
              </li>
              <li>
                На УСН «Доходы» страховые взносы можно полностью вычесть из налога (при отсутствии работников)
              </li>
              <li>
                На АУСН страховых взносов ИП нет, но ставка выше (8% vs 6%)
              </li>
              <li>
                С 2026 года ИП на УСН с доходом свыше 20 млн ₽ обязаны платить НДС (5% или 7%)
              </li>
              <li>
                Расчёт не учитывает региональные льготные ставки УСН (могут быть ниже в вашем регионе)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;

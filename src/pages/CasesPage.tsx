import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  AlertTriangle,
  Shield,
  Calculator,
  TrendingUp,
  Ban,
  FileWarning,
  Eye,
  ArrowRight,
  ExternalLink,
  Recycle,
  Package,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

interface CourtCase {
  id: string;
  court: string;
  date: string;
  parties: string;
  summary: string;
  result: 'fns' | 'business';
  amount?: string;
  lesson: string;
}

const substitutionCases: CourtCase[] = [
  {
    id: 'А76-20897/2023',
    court: 'ВС РФ, определение № 309-ЭС24-20306',
    date: '03.02.2025',
    parties: 'ИП Садыков (производство напитков, Челябинск)',
    summary:
      'ИП сократил штат со 100 до 7 человек и заключил договоры с бывшими сотрудниками как самозанятыми. ФНС переквалифицировала договоры в трудовые. Ключевой вопрос — можно ли зачесть уплаченный НПД в счёт доначисленного НДФЛ.',
    result: 'fns',
    amount: '794 399 ₽ НДФЛ',
    lesson:
      'При переквалификации компания платит НДФЛ и взносы «сверху». Уплаченный НПД самозанятые должны возвращать сами отдельно — автоматического зачёта нет.',
  },
  {
    id: 'А57-10945/2023',
    court: '12-й ААС, постановление № 12АП-9539/23',
    date: '20.02.2024',
    parties: 'ООО «Фаворит» (услуги на АЗС, Саратов)',
    summary:
      'Компания оформила логистов, диспетчеров и водителей как самозанятых. Все зарегистрировались одновременно, получали доход только от «Фаворита», договоры продлевались каждые 3 месяца.',
    result: 'fns',
    lesson:
      'Одновременная массовая регистрация и единственный заказчик — верный признак подмены для ФНС.',
  },
  {
    id: 'А76-18712/2023',
    court: 'АС Уральского округа',
    date: '16.08.2024',
    parties: 'ИП-грузоперевозчик (115 самозанятых, Челябинск)',
    summary:
      'ИП привлекал 115 самозанятых водителей на 6 штатных. ФНС пыталась переквалифицировать. Компания доказала реальный ГПХ-характер: эпизодичность работы, нерегулярность выплат, отсутствие подчинения.',
    result: 'business',
    lesson:
      'Если отношения действительно гражданско-правовые (нет графика, нет подчинённости, нерегулярные выплаты) — бизнес может выиграть даже при 115 самозанятых.',
  },
  {
    id: 'А07-7990/2023',
    court: 'АС Уральского округа, № Ф09-6801/24',
    date: '09.12.2024',
    parties: 'ООО «СтройМонтажРемонт» (сварщики, Башкортостан)',
    summary:
      '7 самозанятых-сварщиков работали на объекте заказчика (Башнефть), выполняли постоянную трудовую функцию.',
    result: 'fns',
    lesson:
      'Работа на объекте заказчика с постоянной функцией — почти гарантированная переквалификация.',
  },
  {
    id: 'А76-32727/2023',
    court: 'АС Уральского округа, № Ф09-3824/2024',
    date: '15.07.2024',
    parties: 'Строительная компания (благоустройство, Челябинск)',
    summary:
      'Компания привлекала самозанятых на дорожные работы. Три инстанции поддержали бизнес.',
    result: 'business',
    lesson:
      'При проектной работе с чётким результатом (а не процессом) суды чаще встают на сторону бизнеса.',
  },
];

const penaltiesData = [
  {
    violation: 'Невыдача чека (первый раз)',
    article: 'ст. 129.13 НК',
    penalty: '20% от суммы',
    icon: FileWarning,
  },
  {
    violation: 'Невыдача чека (повторно за 6 мес.)',
    article: 'ст. 129.13 НК',
    penalty: '100% от суммы',
    icon: Ban,
  },
  {
    violation: 'Неуплата налога (неосторожность)',
    article: 'ст. 122 НК',
    penalty: '20% от суммы',
    icon: AlertTriangle,
  },
  {
    violation: 'Неуплата налога (умысел)',
    article: 'ст. 122 НК',
    penalty: '40% от суммы',
    icon: AlertTriangle,
  },
  {
    violation: 'Деятельность без регистрации',
    article: 'ст. 116 НК',
    penalty: '10% дохода (мин. 40 000 ₽)',
    icon: Ban,
  },
  {
    violation: 'Непредставление декларации',
    article: 'ст. 119 НК',
    penalty: '5%/мес. (макс. 30%)',
    icon: FileWarning,
  },
];

const fnsIndicators = [
  { label: 'Самозанятых у одного заказчика', threshold: 'более 35 человек' },
  { label: 'Доход от одного заказчика', threshold: 'более 75% от общего' },
  { label: 'Среднемесячный доход от заказчика', threshold: 'более 35 000 ₽' },
  { label: 'Длительность сотрудничества', threshold: 'более 3 месяцев' },
  { label: 'Бывшие сотрудники среди самозанятых', threshold: 'любое наличие (правило 2 лет)' },
  { label: 'Регулярность выплат', threshold: 'ежемесячные одинаковые суммы' },
];

const CasesPage: FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Судебная практика' }]} />

      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Судебная практика по НПД
        </h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Реальные дела и штрафы. Узнайте, как ФНС выявляет нарушения,
          и считайте налоги правильно — чтобы не оказаться в этом списке.
        </p>
      </div>

      {/* Stats banner */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: '47 000', label: 'случаев подмены выявлено ФНС в 2025', color: 'text-danger-600' },
          { value: '~3 000', label: 'самозанятых оштрафовано за 9 мес. 2026', color: 'text-warning-600' },
          { value: '300 млн ₽', label: 'сумма штрафов за аннулирование чеков', color: 'text-danger-600' },
          { value: '98%', label: 'результативность выездных проверок', color: 'text-danger-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Section 1: Court cases */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Scale size={24} className="text-primary-600" />
          Подмена трудовых отношений — реальные дела
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Компании оформляют сотрудников как самозанятых, экономя на НДФЛ и взносах (~43%).
          ФНС переквалифицирует такие договоры, доначисляя всё «сверху» — и самозанятый тоже рискует.
        </p>

        <div className="space-y-4">
          {substitutionCases.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border-2 p-5 ${
                c.result === 'fns'
                  ? 'border-danger-200 bg-danger-50/30 dark:border-danger-800 dark:bg-danger-900/10'
                  : 'border-accent-200 bg-accent-50/30 dark:border-accent-800 dark:bg-accent-900/10'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    c.result === 'fns'
                      ? 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                      : 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                  }`}
                >
                  {c.result === 'fns' ? 'ФНС выиграла' : 'Бизнес выиграл'}
                </span>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {c.id}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{c.date}</span>
                {c.amount && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-bold text-danger-600 dark:text-danger-400">
                      {c.amount}
                    </span>
                  </>
                )}
              </div>
              <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                {c.parties}
              </h3>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {c.court}
              </p>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                {c.summary}
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
                <Shield size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {c.lesson}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-5 text-center dark:border-primary-800 dark:bg-primary-900/10">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Не уверены, какой режим подходит? Сравните НПД, УСН и АУСН с точными расчётами
          </p>
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Сравнить режимы <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Section 2: Penalties */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <AlertTriangle size={24} className="text-danger-600" />
          Таблица штрафов
        </h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 sm:px-6">
                  Нарушение
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 sm:table-cell sm:px-6">
                  Статья
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-danger-600 dark:text-danger-400 sm:px-6">
                  Штраф
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {penaltiesData.map((p) => (
                <tr key={p.violation} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white sm:px-6">
                    <div className="flex items-center gap-2">
                      <p.icon size={16} className="hidden flex-shrink-0 text-gray-400 sm:block" />
                      {p.violation}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400 sm:table-cell sm:px-6">
                    {p.article}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-danger-600 dark:text-danger-400 sm:px-6">
                    {p.penalty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-accent-200 bg-accent-50/50 p-5 text-center dark:border-accent-800 dark:bg-accent-900/10">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Считайте налог правильно — и штрафов не будет
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-700"
          >
            <Calculator size={16} /> Рассчитать налог <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Section 3: FNS indicators */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Eye size={24} className="text-warning-600" />
          Как ФНС находит нарушителей
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          ФНС использует автоматизированную скоринговую систему <strong>МАРМ</strong>, анализирующую более 20 параметров
          в реальном времени. Вот основные триггеры:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fnsIndicators.map((ind) => (
            <div
              key={ind.label}
              className="rounded-xl border border-warning-200 bg-warning-50/50 p-4 dark:border-warning-800 dark:bg-warning-900/10"
            >
              <p className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                {ind.label}
              </p>
              <p className="text-sm text-warning-700 dark:text-warning-300">
                ⚡ {ind.threshold}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
            Новое с 2026 года (Приказ Минтруда № 657н)
          </h3>
          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li>• Порог «зависимости от одного заказчика» снижен с 90% до <strong>75%</strong> дохода</li>
            <li>• Квартальный мониторинг бывших сотрудников среди самозанятых</li>
            <li>• Межведомственный обмен ФНС → Роструд → комиссии по нелегальной занятости</li>
            <li>• Скоринг аннулирования чеков в «Мой налог»</li>
          </ul>
        </div>
      </section>

      {/* Section 4: Limit */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <TrendingUp size={24} className="text-primary-600" />
          Превышение лимита 2,4 млн ₽
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <p>
              При превышении годового лимита 2,4 млн ₽ статус плательщика НПД утрачивается
              <strong> автоматически с даты превышения</strong>.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent-500">✓</span>
                Доходы <strong>до лимита</strong> — облагаются НПД (4%/6%), пересчёт не нужен
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger-500">✗</span>
                Доходы <strong>сверх лимита</strong> — облагаются НДФЛ 13%
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning-500">!</span>
                ИП должен выбрать новый режим в течение <strong>20 дней</strong>, иначе — ОСН
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">↻</span>
                Повторная регистрация как самозанятый — <strong>с 1 января следующего года</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-5 text-center dark:border-primary-800 dark:bg-primary-900/10">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Следите за приближением к лимиту, чтобы подготовиться заранее
          </p>
          <Link
            to="/tracker"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            <TrendingUp size={16} /> Открыть трекер доходов <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Section 5: Утильсбор, экосбор, технологический сбор */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Recycle size={24} className="text-accent-600" />
          Экосбор и другие сборы для ИП
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Помимо налогов и взносов, ИП обязаны учитывать экосбор (расширенная ответственность производителей),
          утилизационный и технологический сборы. Самозанятых на НПД они практически не касаются.
        </p>

        <div className="space-y-4">
          {/* Экосбор (РОП) — главная тема */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center gap-2">
              <Recycle size={18} className="text-accent-600" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Экосбор (расширенная ответственность производителей)
              </h3>
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              ИП-производители и импортёры обязаны утилизировать отходы от своих товаров/упаковки
              или платить экосбор. Норматив утилизации упаковки: <strong>75% в 2026</strong>, 100% с 2027.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { material: 'Бумага, картон', rate: '2 953 ₽/т' },
                { material: 'Пластик', rate: '4 774 ₽/т' },
                { material: 'Стекло', rate: '3 184 ₽/т' },
                { material: 'Металл', rate: '3 009 ₽/т' },
                { material: 'Текстиль', rate: '20 250 ₽/т' },
                { material: 'Шины', rate: '200 430 ₽/т' },
              ].map((item) => (
                <div
                  key={item.material}
                  className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.material}</p>
                  <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {item.rate}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-warning-700 dark:text-warning-300">
              С 1 сентября 2026 — импортёры платят экосбор <strong>авансом</strong> до выпуска товаров
            </p>
          </div>

          {/* Утильсбор на транспорт */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center gap-2">
              <Package size={18} className="text-primary-600" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Утилизационный сбор на транспорт
              </h3>
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              ИП-импортёры платят по <strong>коммерческим ставкам</strong> — в сотни раз выше, чем физлица.
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/80">
                    <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Категория</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-danger-600">ИП / юрлицо</th>
                    <th className="hidden px-3 py-2 text-right text-xs font-semibold text-accent-600 sm:table-cell">Физлицо</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Легковое авто 1-2 л, до 160 л.с. (новое)</td>
                    <td className="px-3 py-2 text-right font-bold text-danger-600">800 800 ₽</td>
                    <td className="hidden px-3 py-2 text-right text-accent-600 sm:table-cell">3 400 ₽</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Легковое авто 1-2 л, до 160 л.с. (б/у)</td>
                    <td className="px-3 py-2 text-right font-bold text-danger-600">3 407 200 ₽</td>
                    <td className="hidden px-3 py-2 text-right text-accent-600 sm:table-cell">5 200 ₽</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Электромобили</td>
                    <td className="px-3 py-2 text-right font-bold text-danger-600">314 600 ₽</td>
                    <td className="hidden px-3 py-2 text-right text-accent-600 sm:table-cell">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Технологический сбор */}
          <div className="rounded-xl border border-warning-200 bg-warning-50/50 p-5 dark:border-warning-800 dark:bg-warning-900/10">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning-600" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Технологический сбор — НОВЫЙ с 1 декабря 2026
              </h3>
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              ИП-производители и импортёры электроники обязаны платить новый сбор.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { device: 'Ноутбук', rate: '500 ₽/шт.' },
                { device: 'Смартфон', rate: '250 ₽/шт.' },
                { device: 'Радиотелефон', rate: '100 ₽/шт.' },
                { device: 'Прочие телефоны', rate: '25 ₽/шт.' },
              ].map((item) => (
                <div
                  key={item.device}
                  className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 dark:bg-gray-800/60"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.device}</span>
                  <span className="font-mono text-sm font-bold text-warning-700 dark:text-warning-300">
                    {item.rate}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Потолок — 5 000 ₽ за единицу. Бытовая техника пока не включена, но планируется.
            </p>
          </div>

          {/* Кого НЕ касается */}
          <div className="rounded-xl border-2 border-accent-200 bg-accent-50/30 p-5 dark:border-accent-800 dark:bg-accent-900/10">
            <h3 className="mb-2 font-bold text-accent-700 dark:text-accent-300">
              ✓ Кого НЕ касаются эти сборы
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <li>• <strong>Самозанятые (НПД)</strong> — не могут заниматься перепродажей и импортом</li>
              <li>• <strong>ИП на УСН</strong>, оказывающие услуги без импорта и производства товаров</li>
              <li>• Физлица, ввозящие авто для личного пользования (льготные ставки)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Checklist */}
      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Shield size={24} className="text-accent-600" />
          Как не попасть под проверку
        </h2>
        <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/50 p-6 dark:border-accent-800 dark:bg-accent-900/20">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Всегда выдавайте чеки в «Мой налог» — за каждый расчёт',
              'Работайте с несколькими заказчиками, а не с одним',
              'Не работайте с бывшим работодателем менее 2 лет',
              'Следите за лимитом 2,4 млн ₽ — используйте наш трекер',
              'Не перепродавайте чужие товары на НПД',
              'Заключайте письменные договоры с заказчиками',
              'Фиксируйте результаты работы (акты, переписка)',
              'Считайте налог правильно — используйте калькулятор',
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <Shield size={16} className="mt-0.5 flex-shrink-0 text-accent-600" />
                <p className="text-sm text-gray-800 dark:text-gray-200">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section>
        <details className="rounded-xl border border-gray-200 dark:border-gray-700">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
            Источники данных
          </summary>
          <div className="space-y-1 border-t border-gray-200 px-5 py-4 dark:border-gray-700">
            {[
              ['КонсультантПлюс — обзор практики', 'consultant.ru'],
              ['Клерк.ру — правила ФНС 2026', 'klerk.ru'],
              ['Контур — работа с самозанятыми', 'kontur.ru'],
              ['ФНС — приказ Минтруда № 657н', 'nalog.gov.ru'],
              ['ст. 129.13, 122, 119, 116 НК РФ', 'zakonrf.info'],
              ['Утильсбор — ФЗ-89 «Об отходах производства»', 'garant.ru'],
              ['Технологический сбор 2026', 'glavbukh.ru'],
              ['Экосбор и РОП 2026 — ставки', 'selsup.ru'],
            ].map(([name, domain]) => (
              <p key={name} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <ExternalLink size={12} />
                {name} ({domain})
              </p>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
};

export default CasesPage;

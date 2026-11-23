import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  BarChart3,
  FileText,
  TrendingUp,
  Shield,
  Lock,
  Code,
  Heart,
  HelpCircle,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const AboutPage: FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'О сервисе' }]} />

      <div className="mb-10">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          О сервисе СамЗнаю
        </h1>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          СамЗнаю — это бесплатный финансовый навигатор, созданный специально для самозанятых
          в России. Мы помогаем более чем 17 миллионам плательщиков налога на профессиональный
          доход разобраться в своих финансах.
        </p>
      </div>

      {/* What we offer */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Что мы предлагаем
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <Calculator size={24} className="mb-3 text-primary-600 dark:text-primary-400" />
            <h3 className="mb-1 font-bold text-gray-900 dark:text-white">Калькулятор НПД</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Мгновенный расчёт налога для самозанятых с учётом типа клиентов (4% или 6%),
              стартового бонуса и годового лимита в 2,4 млн рублей.
            </p>
            <Link to="/calculator" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Открыть калькулятор →
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <BarChart3 size={24} className="mb-3 text-accent-600 dark:text-accent-400" />
            <h3 className="mb-1 font-bold text-gray-900 dark:text-white">Сравнение режимов</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Интерактивное сравнение НПД, УСН «Доходы» и УСН «Доходы минус расходы» с учётом
              ваших конкретных параметров: дохода, расходов, типа клиентов.
            </p>
            <Link to="/compare" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Сравнить режимы →
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <FileText size={24} className="mb-3 text-purple-600 dark:text-purple-400" />
            <h3 className="mb-1 font-bold text-gray-900 dark:text-white">Генератор документов</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Создавайте договоры оказания услуг, акты выполненных работ и счета на оплату.
              Все документы содержат актуальные ссылки на закон 422-ФЗ.
            </p>
            <Link to="/documents" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Создать документ →
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <TrendingUp size={24} className="mb-3 text-orange-600 dark:text-orange-400" />
            <h3 className="mb-1 font-bold text-gray-900 dark:text-white">Трекер доходов</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ведите учёт доходов по месяцам, следите за прогрессом к лимиту 2,4 млн и получайте
              прогноз о том, когда лимит может быть достигнут.
            </p>
            <Link to="/tracker" className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Открыть трекер →
            </Link>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-12 rounded-2xl border-2 border-accent-200 bg-accent-50/50 p-6 dark:border-accent-800 dark:bg-accent-900/20 sm:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Shield size={24} className="text-accent-600" />
          Конфиденциальность
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <Lock size={20} className="mt-0.5 flex-shrink-0 text-accent-600" />
            <p>
              <strong>Данные не покидают ваше устройство.</strong> Все расчёты выполняются
              прямо в вашем браузере. Мы не собираем, не передаём и не храним ваши финансовые данные
              на серверах.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Code size={20} className="mt-0.5 flex-shrink-0 text-accent-600" />
            <p>
              <strong>Открытый исходный код.</strong> Код сервиса полностью открыт. Вы можете
              убедиться в отсутствии скрытого сбора данных, изучив код на GitHub.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          <HelpCircle size={24} className="text-primary-600" />
          Частые вопросы
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Насколько точны расчёты?',
              a: 'Расчёты основаны на актуальных ставках НПД и УСН на 2026 год. Однако сервис носит информационный характер и не заменяет консультацию с налоговым специалистом. Региональные льготные ставки УСН могут отличаться.',
            },
            {
              q: 'Это бесплатно?',
              a: 'Да, полностью бесплатно. Нет скрытых платежей, подписок или ограничений функций. Сервис создан для помощи самозанятым и не преследует коммерческих целей.',
            },
            {
              q: 'Нужна ли регистрация?',
              a: 'Нет. Вы можете пользоваться всеми инструментами без регистрации. Данные трекера доходов сохраняются локально в вашем браузере.',
            },
            {
              q: 'Что будет, если я превышу лимит 2,4 млн?',
              a: 'При превышении годового лимита дохода в 2,4 млн рублей вы автоматически теряете статус плательщика НПД. Доход сверх лимита будет облагаться НДФЛ 13%. Рекомендуем заблаговременно рассмотреть переход на УСН.',
            },
            {
              q: 'Могу ли я экспортировать документы?',
              a: 'В текущей версии доступен предпросмотр документов. Функция экспорта в PDF находится в разработке и будет добавлена в ближайшем обновлении.',
            },
          ].map((item, index) => (
            <details key={index} className="group rounded-xl border border-gray-200 dark:border-gray-700">
              <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 marker:text-primary-500 dark:text-white">
                {item.q}
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="rounded-xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <div className="flex items-start gap-2">
          <Heart size={16} className="mt-0.5 flex-shrink-0 text-danger-500" />
          <p>
            Сервис «СамЗнаю» носит исключительно информационный характер и не является налоговой
            или юридической консультацией. Для принятия решений по налоговым вопросам рекомендуем
            обращаться к квалифицированным специалистам. Расчёты основаны на законодательстве
            Российской Федерации по состоянию на 2026 год (ФЗ от 27.11.2018 № 422-ФЗ).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

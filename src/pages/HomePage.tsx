import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  BarChart3,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Lock,
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const HomePage: FC = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMCBoNjB2NjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Zap size={14} /> Бесплатно и без регистрации
            </div>
            <img
              src={`${import.meta.env.BASE_URL}images/mascot-hero.png`}
              alt="Маскот СамЗнаю"
              className="mx-auto mb-6 h-40 w-auto drop-shadow-2xl sm:h-52 lg:h-60"
            />
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Финансовый навигатор
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                для самозанятых
              </span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Считайте налог на профессиональный доход, сравнивайте налоговые режимы,
              создавайте документы и контролируйте свой доход. Всё в одном месте.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-primary-800 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
              >
                <Calculator size={20} />
                Рассчитать налог
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Сравнить режимы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-b border-gray-200 bg-gray-50 py-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 py-2">
              <Users size={24} className="text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">17+ млн</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">самозанятых в России</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <Shield size={24} className="text-accent-600 dark:text-accent-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">100% бесплатно</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">никаких скрытых платежей</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <Lock size={24} className="text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Данные у вас</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ничего не покидает устройство</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Все инструменты для самозанятого
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              От расчёта налогов до создания документов — управляйте своими финансами уверенно
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Калькулятор НПД"
              description="Мгновенный расчёт налога: введите доход, увидьте налог, чистый доход и остаток бонуса. Прогноз на год и контроль лимита 2,4 млн."
              icon={<Calculator size={28} />}
              to="/calculator"
              color="blue"
            />
            <FeatureCard
              title="Сравнение режимов"
              description="НПД, УСН «Доходы», УСН «Д-Р» — какой выгоднее? Ответьте на 5 вопросов и получите персональную рекомендацию с расчётами."
              icon={<BarChart3 size={28} />}
              to="/compare"
              color="green"
            />
            <FeatureCard
              title="Генератор документов"
              description="Создавайте договоры, акты и счета за минуту. Заполните данные один раз — документы формируются автоматически."
              icon={<FileText size={28} />}
              to="/documents"
              color="purple"
            />
            <FeatureCard
              title="Трекер доходов"
              description="Ведите учёт доходов по месяцам, следите за приближением к лимиту 2,4 млн и планируйте заранее."
              icon={<TrendingUp size={28} />}
              to="/tracker"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Начните прямо сейчас
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-600 dark:text-gray-400">
            Не нужно регистрироваться. Просто откройте калькулятор и введите свой доход.
            Результат появится мгновенно.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
          >
            <Calculator size={20} />
            Открыть калькулятор
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

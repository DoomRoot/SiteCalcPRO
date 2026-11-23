import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <img
                src={`${import.meta.env.BASE_URL}images/mascot-avatar.png`}
                alt="СамЗнаю"
                className="h-8 w-8 rounded-lg"
              />
              СамЗнаю
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Бесплатный финансовый навигатор для самозанятых в России. Считайте налоги, сравнивайте режимы, создавайте документы.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Инструменты
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calculator" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Калькулятор НПД
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Сравнение режимов
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Генератор документов
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Трекер доходов
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  Судебная практика
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Информация
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                  О сервисе
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Безопасность
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock size={14} className="text-accent-600" />
                Данные не покидают устройство
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield size={14} className="text-accent-600" />
                Без регистрации
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} СамЗнаю. Информация носит справочный характер и не является налоговой консультацией.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            Сделано с <Heart size={12} className="text-danger-500" /> для самозанятых России
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

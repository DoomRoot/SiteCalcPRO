import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:py-32">
      <img
        src={`${import.meta.env.BASE_URL}images/mascot-avatar.png`}
        alt="СамЗнаю"
        className="mx-auto mb-8 h-32 w-32 rounded-2xl opacity-80"
      />
      <h1 className="mb-3 text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <p className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">
        Страница не найдена
      </p>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Похоже, такой страницы нет. Но все инструменты для самозанятых — на месте!
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-700"
        >
          <Home size={18} />
          На главную
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
          Назад
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

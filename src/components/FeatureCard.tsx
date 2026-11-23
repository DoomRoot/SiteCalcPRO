import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorMap = {
  blue: {
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    icon: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-100 dark:border-primary-800',
    hover: 'hover:border-primary-300 dark:hover:border-primary-600',
  },
  green: {
    bg: 'bg-accent-50 dark:bg-accent-900/20',
    icon: 'text-accent-600 dark:text-accent-400',
    border: 'border-accent-100 dark:border-accent-800',
    hover: 'hover:border-accent-300 dark:hover:border-accent-600',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-800',
    hover: 'hover:border-purple-300 dark:hover:border-purple-600',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800',
    hover: 'hover:border-orange-300 dark:hover:border-orange-600',
  },
};

const FeatureCard: FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  to,
  color = 'blue',
}) => {
  const colors = colorMap[color];

  return (
    <Link
      to={to}
      className={`group block rounded-2xl border-2 ${colors.border} ${colors.hover} bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-gray-800`}
    >
      <div className={`mb-4 inline-flex rounded-xl ${colors.bg} p-3`}>
        <div className={colors.icon}>{icon}</div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
};

export default FeatureCard;

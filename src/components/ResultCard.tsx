import type { FC, ReactNode } from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ResultCard: FC<ResultCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  helpText,
  size = 'md',
}) => {
  const deltaColors = {
    positive: 'text-accent-600 dark:text-accent-400',
    negative: 'text-danger-600 dark:text-danger-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  };

  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`mt-1 font-bold tracking-tight text-gray-900 dark:text-white ${valueSizes[size]} font-mono`}>
            {value}
          </p>
          {delta && (
            <p className={`mt-1 text-sm font-medium ${deltaColors[deltaType]}`}>
              {delta}
            </p>
          )}
          {helpText && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helpText}</p>
          )}
        </div>
        {icon && (
          <div className="ml-3 flex-shrink-0 rounded-lg bg-primary-50 p-2 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

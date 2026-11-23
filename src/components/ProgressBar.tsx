import type { FC } from 'react';
import { clamp } from '../utils/format';

interface ProgressBarProps {
  value: number; // 0–1
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  thresholds?: {
    warning: number; // 0–1, e.g. 0.7
    danger: number;  // 0–1, e.g. 0.9
  };
}

const ProgressBar: FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  size = 'md',
  thresholds = { warning: 0.7, danger: 0.9 },
}) => {
  const clamped = clamp(value, 0, 1);
  const percent = Math.round(clamped * 100);

  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-5',
  }[size];

  let barColor: string;
  if (clamped >= thresholds.danger) {
    barColor = 'bg-danger-500';
  } else if (clamped >= thresholds.warning) {
    barColor = 'bg-warning-500';
  } else {
    barColor = 'bg-accent-500';
  }

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-1 flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
          )}
          {showPercent && (
            <span className="font-mono text-gray-500 dark:text-gray-400">
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

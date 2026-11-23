import { type ChangeEvent, type FC, useCallback, useState, useEffect } from 'react';
import { formatNumber, parseFormattedNumber } from '../utils/format';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  suffix?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  helpText?: string;
}

const NumberInput: FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  suffix = '₽',
  min = 0,
  max = 100_000_000,
  placeholder = '0',
  helpText,
}) => {
  const [displayValue, setDisplayValue] = useState(value > 0 ? formatNumber(value) : '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? formatNumber(value) : '');
    }
  }, [value, isFocused]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw);
      const parsed = parseFormattedNumber(raw);
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
    },
    [onChange, min, max]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (value > 0) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setDisplayValue(value > 0 ? formatNumber(value) : '');
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-lg font-medium text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

export default NumberInput;

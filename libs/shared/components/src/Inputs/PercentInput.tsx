import { forwardRef, useEffect, useState } from 'react';

import { InputBase } from '@mui/material';
import { isNilOrEmpty } from '@origin/shared/utils';

import type { InputBaseProps } from '@mui/material';
import type { ChangeEvent } from 'react';

export type PercentInputProps = {
  value: number;
  precision?: number;
  onChange?: (value: number) => void;
} & Omit<InputBaseProps, 'value' | 'onChange' | 'inputRef'>;

const formatPercent = (value: number, precision: number) =>
  Intl.NumberFormat('en', {
    useGrouping: false,
    maximumFractionDigits: precision,
  }).format(value * 100);

export const PercentInput = forwardRef<HTMLInputElement, PercentInputProps>(
  ({ value, precision = 4, onChange, ...rest }, ref) => {
    const [strVal, setStrVal] = useState(formatPercent(value, precision));

    useEffect(() => {
      if (value === 0 && (isNilOrEmpty(strVal) || strVal.endsWith('.'))) {
        return;
      }

      if (value === 0 && !/0\.0+$/.test(strVal)) {
        setStrVal('');
        return;
      }

      if (
        isNilOrEmpty(strVal) ||
        formatPercent(value, precision) !== strVal.replace('.', '')
      ) {
        setStrVal(formatPercent(value, precision));
      }
    }, [precision, strVal, value]);

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      if (evt.target.validity.valid) {
        const val =
          isNilOrEmpty(evt.target.value) || evt.target.value === '.'
            ? '0'
            : evt.target.value.replace(/\.0+$/, '');

        try {
          const num = Number(val) / 100;
          if (num <= 1) {
            setStrVal(evt.target.value === '.' ? '0.' : evt.target.value);
            if (onChange && num !== value) {
              onChange(num);
            }
          }
        } catch {}
      }
    };

    return (
      <InputBase
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        endAdornment="%"
        placeholder="0"
        {...rest}
        inputRef={ref}
        value={strVal}
        onChange={handleChange}
        inputMode="decimal"
        inputProps={{
          pattern: `[0-9]*(.[0-9]{0,${precision}})`,
          minLength: 0,
          maxLength: precision + 4,
        }}
      />
    );
  },
);

PercentInput.displayName = 'PercentInput';

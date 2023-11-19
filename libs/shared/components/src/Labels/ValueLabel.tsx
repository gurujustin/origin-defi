import { Skeleton, Stack, Typography } from '@mui/material';

import type { StackProps, TypographyProps } from '@mui/material';
import type { ReactNode } from 'react';

export type ValueLabelProps = {
  label: string;
  value: ReactNode;
  labelProps?: TypographyProps;
  valueProps?: TypographyProps;
  isLoading?: boolean;
} & StackProps;

export const ValueLabel = ({
  label,
  value,
  labelProps,
  valueProps,
  isLoading,
  ...rest
}: ValueLabelProps) => {
  return (
    <Stack spacing={1} {...rest} sx={{ alignItems: 'center', ...rest?.sx }}>
      <Typography color="text.secondary" variant="body2" {...labelProps}>
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography {...valueProps}>
          {isLoading ? <Skeleton width={60} /> : value}
        </Typography>
      ) : isLoading ? (
        <Skeleton width={60} />
      ) : (
        value
      )}
    </Stack>
  );
};

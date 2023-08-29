import { Box, Typography } from '@mui/material';
import { isNilOrEmpty } from '@origin/shared/utils';

import type { SxProps, Theme, TypographyProps } from '@mui/material';

export type MiddleTruncatedProps = {
  children: string;
  textProps?: Omit<TypographyProps, 'children'>;
  end?: number;
} & TypographyProps;

const truncate: SxProps<Theme> = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

export const MiddleTruncated = ({
  children,
  textProps,
  end = 4,
  ...rest
}: MiddleTruncatedProps) => {
  if (isNilOrEmpty(children)) return null;

  if (children.length <= end) {
    return (
      <Box
        {...rest}
        sx={{ display: 'flex', flexWrap: 'nowrap', minWidth: 0, ...rest?.sx }}
      >
        <Typography {...textProps} sx={{ ...truncate, ...textProps?.sx }}>
          {children}
        </Typography>
      </Box>
    );
  }

  const partStart = children.substring(0, children.length - end);
  const partEnd = children.slice(children.length - end);
  const breakspace =
    children[children.length - end - 1] === ' ' &&
    children[children.length - end] !== ' ';

  return (
    <Box
      {...rest}
      sx={{ display: 'flex', flexWrap: 'nowrap', minWidth: 0, ...rest?.sx }}
    >
      <Typography {...textProps} sx={{ ...truncate, ...textProps?.sx }}>
        {partStart}
      </Typography>
      {breakspace && <Typography {...textProps}>&nbsp;</Typography>}
      <Typography {...textProps}>{partEnd}</Typography>
    </Box>
  );
};

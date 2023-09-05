import { Box, IconButton } from '@mui/material';

import type { IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {}

export function SwapButton({ onClick, sx, ...rest }: Props) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        zIndex: 2,
        width: { md: '3rem', xs: '2rem' },
        height: { md: '3rem', xs: '2rem' },
        strokeWidth: (theme) => theme.typography.pxToRem(2),
        stroke: (theme) => theme.palette.grey[700],
        transform: { xs: 'translateY(-20%)', md: 'translateY(-8%)' },
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => theme.palette.background.paper,
        '& img': {
          transition: (theme) => theme.transitions.create('transform'),
        },
        '&:hover': {
          backgroundColor: (theme) => theme.palette.background.paper,
          '& img': {
            transform: 'rotate(-180deg)',
          },
        },
        ...sx,
      }}
      {...rest}
    >
      <Box
        component="img"
        src="/images/splitarrow.svg"
        sx={{
          height: { md: 'auto', xs: '1.25rem' },
        }}
      />
    </IconButton>
  );
}

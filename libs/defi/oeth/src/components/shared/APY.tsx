import React, { useState } from 'react';

import {
  alpha,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';

const days = [7, 30];

interface Props {
  value: number;
  balance: number;
  pendingYield: number;
  earnings: number;
}

export function APY({ value, balance, pendingYield, earnings }: Props) {
  const intl = useIntl();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{ dense: true }}
      >
        {days.map((day) => (
          <MenuItem
            divider
            key={day}
            selected={selectedPeriod === day}
            onClick={() => {
              setSelectedPeriod(day);
              setAnchorEl(null);
            }}
          >
            {intl.formatMessage(
              { defaultMessage: '{days} day trailing' },
              { days: day },
            )}
          </MenuItem>
        ))}
      </Menu>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={{ xs: 1, md: 2 }}
        sx={{ width: '100%' }}
      >
        <Box
          sx={{
            paddingInline: { xs: 3, md: 2.5 },
            paddingBlock: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.800',
            flexBasis: {
              xs: '100%',
              md: '25%',
            },
            display: 'grid',
            placeContent: 'center',
          }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            alignItems="center"
          >
            {intl.formatMessage(
              { defaultMessage: '{days} day trailing APY' },
              { days: selectedPeriod },
            )}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                fontStyle: 'normal',
                lineHeight: '2rem',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Sailec',
                backgroundImage:
                  'linear-gradient(90deg, var(--mui-palette-primary-light) 0%, #6A36FC 100%)',
              }}
            >
              {intl.formatNumber(value / 100, {
                minimumFractionDigits: 2,
                style: 'percent',
              })}
            </Typography>
            <IconButton
              disableRipple
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.common.white, 0.15),
                marginInlineStart: 1,
                alignSelf: 'center',
                position: 'relative',
                height: '1rem',
                width: '1rem',
                borderRadius: '100%',
                top: '-2px',
              }}
            >
              <Box component={'img'} src={`/images/downarrow.png`} />
            </IconButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            paddingInline: { md: 2.75, xs: 0.5 },
            paddingBlock: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.800',
            flex: 1,
          }}
          direction="row"
        >
          <ValueContainer
            text={intl.formatMessage({ defaultMessage: 'OETH Balance' })}
            value={intl.formatNumber(balance, { minimumFractionDigits: 4 })}
          />
          <Box
            sx={{
              flex: { xs: 0.5, md: 1 },
              display: 'flex',
              justifyContent: 'center',
              paddingBlock: 0.75,
            }}
          >
            <Divider orientation="vertical" sx={{ borderColor: 'grey.800' }} />
          </Box>

          <ValueContainer
            text={intl.formatMessage({ defaultMessage: 'Pending yield' })}
            value={intl.formatNumber(pendingYield, {
              minimumFractionDigits: 4,
            })}
          />
          <Box
            sx={{
              flex: { xs: 0.5, md: 1 },
              display: 'flex',
              justifyContent: 'center',
              paddingBlock: 0.75,
            }}
          >
            <Divider orientation="vertical" sx={{ borderColor: 'grey.800' }} />
          </Box>
          <ValueContainer
            text={intl.formatMessage({ defaultMessage: 'Lifetime earnings' })}
            value={intl.formatNumber(earnings, { minimumFractionDigits: 4 })}
          />
        </Stack>
      </Stack>
    </>
  );
}

function ValueContainer({
  text,
  value,
}: {
  text: string;
  value: string;
  icon?: string;
}) {
  return (
    <Box sx={{ flex: 1, display: 'grid', placeContent: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
      <Stack
        component={Typography}
        direction="row"
        alignItems="center"
        color="primary.contrastText"
        sx={{
          fontSize: { xs: '0.875rem', md: '1rem' },
          fontWeight: 'bold',
          lineHeight: { md: '1.75rem', xs: '1rem' },
          fontStyle: 'normal',
          fontFamily: 'Sailec',
          justifyContent: {
            xs: 'center',
            md: 'flex-start',
          },
        }}
      >
        {value}
      </Stack>
    </Box>
  );
}

import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { InfoTooltip } from '@origin/shared/components';
import { tokens } from '@origin/shared/contracts';
import { useGasPrice, usePrices } from '@origin/shared/providers';
import {
  currencyFormat,
  formatAmount,
  quantityFormat,
} from '@origin/shared/utils';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';

import { MIX_TOKEN } from '../constants';
import { useRedeemState } from '../state';
import { Mix } from './Mix';

import type { StackProps } from '@mui/material';

export const RedeemSplitCard = (props: Omit<StackProps, 'children'>) => {
  const intl = useIntl();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: prices, isLoading: isPricesLoading } = usePrices();
  const [{ amountOut, gas, rate, split, isEstimateLoading }] = useRedeemState();
  const { data: gasPrice, isLoading: gasPriceLoading } = useGasPrice(gas);

  const estimatedAmount = +formatUnits(amountOut, MIX_TOKEN.decimals);
  const convertedAmount =
    (prices?.[tokens.mainnet.WETH.symbol] ?? 1) * estimatedAmount;

  return (
    <Stack
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'transparent',
        background: (theme) =>
          `linear-gradient(${theme.palette.grey[800]}, ${theme.palette.grey[800]}) padding-box,
 linear-gradient(90deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%) border-box;`,
        ...props?.sx,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} px={2} py={1.5}>
        {!isXs && <Mix />}
        <Stack flex={1} direction="column">
          <Stack
            direction="row"
            alignItems="baseline"
            gap={1}
            overflow="hidden"
            whiteSpace="nowrap"
          >
            <Typography fontWeight={500}>
              {isEstimateLoading ? (
                <Skeleton width={100} />
              ) : (
                formatAmount(amountOut, MIX_TOKEN.decimals)
              )}
            </Typography>
            <Typography variant="body2" noWrap color="text.secondary">
              {isEstimateLoading ? (
                <Skeleton width={60} />
              ) : (
                `(${intl.formatNumber(convertedAmount, currencyFormat)})`
              )}
            </Typography>
          </Stack>
          <Typography noWrap>
            {intl.formatMessage({
              defaultMessage: 'Redeem for mix via OETH vault',
            })}
          </Typography>
        </Stack>
        <Stack direction="column" alignItems="flex-end" spacing={0.5}>
          <Stack direction="row" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {intl.formatMessage({ defaultMessage: 'Gas:' })}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {isEstimateLoading || gasPriceLoading ? (
                <Skeleton width={60} />
              ) : (
                `~${intl.formatNumber(gasPrice?.gasCostUsd, currencyFormat)}`
              )}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {intl.formatMessage({ defaultMessage: 'Wait time:' })}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {isEstimateLoading ? (
                <Skeleton width={60} />
              ) : (
                intl.formatMessage({ defaultMessage: '~1 min' })
              )}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        px={1.5}
        py={1.5}
      >
        <Stack direction="row" justifyContent="space-between" gap={1}>
          <Typography variant="body2" color="text.secondary">
            {intl.formatMessage({ defaultMessage: 'Rate:' })}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {isEstimateLoading ? (
              <Skeleton width={60} />
            ) : (
              `1:${intl.formatNumber(rate, quantityFormat)}`
            )}
          </Typography>
        </Stack>
        <InfoTooltip
          tooltipLabel={intl.formatMessage({
            defaultMessage: 'Exchange rate',
          })}
        />
      </Stack>
      <Divider />
      <Stack spacing={2} py={1.5} px={2}>
        {split?.map((s) => {
          const converted =
            +formatUnits(s.amount, s.token.decimals) * prices?.[s.token.symbol];

          return (
            <Stack
              key={s.token.symbol}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box component="img" src={s.token.icon} />
                <Typography fontWeight={500}>{s.token.symbol}</Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <Typography fontWeight={500}>
                  {isEstimateLoading ? (
                    <Skeleton width={80} />
                  ) : (
                    formatAmount(s.amount, s.token.decimals)
                  )}
                </Typography>
                {isPricesLoading || isEstimateLoading ? (
                  <Skeleton width={80} />
                ) : (
                  <Typography
                    fontWeight={500}
                    color="text.secondary"
                    sx={{ minWidth: 100, textAlign: 'end' }}
                  >
                    {intl.formatNumber(converted, currencyFormat)}
                  </Typography>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

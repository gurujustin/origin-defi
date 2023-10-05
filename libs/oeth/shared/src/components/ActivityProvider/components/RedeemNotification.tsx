import { Box, Stack, Typography } from '@mui/material';
import {
  ActivityIcon,
  Mix,
  NotificationSnack,
} from '@origin/shared/components';
import { isNilOrEmpty } from '@origin/shared/utils';
import { defineMessage, useIntl } from 'react-intl';
import { formatUnits } from 'viem';

import type { StackProps } from '@mui/material';
import type { Token } from '@origin/shared/contracts';
import type { MessageDescriptor } from 'react-intl';
import type { TransactionReceipt } from 'viem';

import type { GlobalActivityStatus } from '../types';

type RedeemNotificationProps = {
  status: GlobalActivityStatus;
  tokenIn: Token;
  tokenOut: Token;
  amountIn?: bigint;
  amountOut?: bigint;
  txReceipt?: TransactionReceipt;
  error?: string;
} & StackProps;

const title: Record<GlobalActivityStatus, MessageDescriptor> = {
  pending: defineMessage({ defaultMessage: 'Redeeming' }),
  success: defineMessage({ defaultMessage: 'Redeemed' }),
  error: defineMessage({ defaultMessage: 'Error while redeeming' }),
  idle: defineMessage({ defaultMessage: 'Redeem' }),
};

export const RedeemNotification = ({
  status,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  txReceipt,
  error,
  ...rest
}: RedeemNotificationProps) => {
  const intl = useIntl();

  return (
    <NotificationSnack
      {...rest}
      icon={<ActivityIcon status={status} sx={{ width: 20, height: 20 }} />}
      title={intl.formatMessage(title[status])}
      href={
        isNilOrEmpty(txReceipt?.transactionHash)
          ? null
          : `https://etherscan.io/tx/${txReceipt.transactionHash}`
      }
      subtitle={
        isNilOrEmpty(error) ? (
          <Typography color="text.tertiary">
            {intl.formatMessage(
              {
                defaultMessage: '{amountIn} {symbolIn}',
              },
              {
                amountIn: intl.formatNumber(
                  +formatUnits(amountIn, tokenIn.decimals),
                  { minimumFractionDigits: 4, maximumFractionDigits: 4 },
                ),
                symbolIn: tokenIn.symbol,
                amountOut: intl.formatNumber(
                  +formatUnits(amountOut, tokenOut.decimals),
                  { minimumFractionDigits: 4, maximumFractionDigits: 4 },
                ),
              },
            )}
          </Typography>
        ) : (
          <Typography color="error">{error}</Typography>
        )
      }
      endIcon={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src={tokenIn.icon}
            sx={{ width: 24, height: 24 }}
          />
          <Box
            component="img"
            src="images/arrow-right.svg"
            sx={{ width: 12, height: 12 }}
          />
          <Mix
            imgSrc={[
              '/images/currency/weth-icon-small.png',
              '/images/currency/reth-icon-small.png',
              '/images/currency/steth-icon-small.svg',
              '/images/currency/frxeth-icon-small.svg',
            ]}
            size={1.5}
          />
        </Stack>
      }
    />
  );
};

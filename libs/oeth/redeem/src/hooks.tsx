import { useCallback } from 'react';

import { Box } from '@mui/material';
import {
  RedeemNotification,
  trackEvent,
  useDeleteActivity,
  usePushActivity,
  useUpdateActivity,
} from '@origin/oeth/shared';
import { NotificationSnack } from '@origin/shared/components';
import { contracts, tokens } from '@origin/shared/contracts';
import { usePushNotification, useSlippage } from '@origin/shared/providers';
import { isNilOrEmpty, isUserRejected } from '@origin/shared/utils';
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from '@wagmi/core';
import { produce } from 'immer';
import { useIntl } from 'react-intl';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useQueryClient } from 'wagmi';

import { MIX_TOKEN } from './constants';
import { useRedeemState } from './state';

export const useHandleAmountInChange = () => {
  const [, setRedeemState] = useRedeemState();

  return useCallback(
    (amount: bigint) => {
      setRedeemState(
        produce((state) => {
          state.amountIn = amount;
          state.isEstimateLoading = amount !== 0n;
        }),
      );
    },
    [setRedeemState],
  );
};

export const useHandleRedeem = () => {
  const intl = useIntl();
  const { value: slippage } = useSlippage();
  const pushNotification = usePushNotification();
  const pushActivity = usePushActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const { address } = useAccount();
  const [{ amountIn, amountOut }, setRedeemState] = useRedeemState();
  const wagmiClient = useQueryClient();

  return useCallback(async () => {
    if (amountIn === 0n || isNilOrEmpty(address)) {
      return;
    }

    const minAmountOut = parseUnits(
      (
        +formatUnits(amountOut, MIX_TOKEN.decimals) -
        +formatUnits(amountOut, MIX_TOKEN.decimals) * slippage
      ).toString(),
      MIX_TOKEN.decimals,
    );

    const activity = pushActivity({
      type: 'redeem',
      status: 'pending',
      tokenIn: tokens.mainnet.OETH,
      tokenOut: MIX_TOKEN,
      amountIn,
      amountOut,
    });

    setRedeemState(
      produce((draft) => {
        draft.isRedeemWaitingForSignature = true;
      }),
    );
    trackEvent({
      name: 'redeem_started',
      redeem_amount: amountIn,
    });
    try {
      const { request } = await prepareWriteContract({
        address: contracts.mainnet.OETHVaultCore.address,
        abi: contracts.mainnet.OETHVaultCore.abi,
        functionName: 'redeem',
        args: [amountIn, minAmountOut],
      });
      const { hash } = await writeContract(request);
      setRedeemState(
        produce((draft) => {
          draft.isRedeemWaitingForSignature = false;
          draft.isRedeemLoading = true;
        }),
      );
      const txReceipt = await waitForTransaction({ hash });
      wagmiClient.invalidateQueries({ queryKey: ['redeem_balance'] });
      updateActivity({ ...activity, status: 'success', txReceipt });
      pushNotification({
        content: (
          <RedeemNotification
            {...activity}
            status="success"
            txReceipt={txReceipt}
          />
        ),
      });
      trackEvent({
        name: 'redeem_complete',
        redeem_amount: amountIn,
      });
    } catch (error) {
      setRedeemState(
        produce((draft) => {
          draft.isRedeemWaitingForSignature = false;
          draft.isRedeemLoading = false;
        }),
      );
      if (isUserRejected(error)) {
        deleteActivity(activity.id);
        pushNotification({
          content: (
            <NotificationSnack
              icon={<Box component="img" src="/images/warn.png" />}
              title={intl.formatMessage({
                defaultMessage: 'Operation Cancelled',
              })}
              subtitle={intl.formatMessage({
                defaultMessage: 'User rejected operation',
              })}
            />
          ),
        });
        trackEvent({
          name: 'redeem_rejected',
          redeem_amount: amountIn,
        });
      } else {
        updateActivity({
          ...activity,
          status: 'error',
          error: error?.shortMessage ?? error.message,
        });
        pushNotification({
          content: (
            <RedeemNotification
              {...activity}
              status="error"
              error={error?.shortMessage ?? error.message}
            />
          ),
        });
        trackEvent({
          name: 'redeem_failed',
          redeem_amount: amountIn,
          redeem_error: error?.shortMessage ?? error.message,
        });
      }
    }
  }, [
    address,
    amountIn,
    amountOut,
    deleteActivity,
    intl,
    pushActivity,
    pushNotification,
    setRedeemState,
    slippage,
    updateActivity,
    wagmiClient,
  ]);
};

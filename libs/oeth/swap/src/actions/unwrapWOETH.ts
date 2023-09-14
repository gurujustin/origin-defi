import { contracts, whales } from '@origin/shared/contracts';
import { isNilOrEmpty } from '@origin/shared/utils';
import {
  getAccount,
  getPublicClient,
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from '@wagmi/core';
import { formatUnits, maxUint256 } from 'viem';

import type {
  Allowance,
  Approve,
  EstimateAmount,
  EstimateApprovalGas,
  EstimateGas,
  EstimateRoute,
  Swap,
} from '../types';

const estimateAmount: EstimateAmount = async ({ amountIn }) => {
  if (amountIn === 0n) {
    return 0n;
  }

  const data = await readContract({
    address: contracts.mainnet.WOETH.address,
    abi: contracts.mainnet.WOETH.abi,
    functionName: 'convertToAssets',
    args: [amountIn],
  });

  return data;
};

const estimateGas: EstimateGas = async ({ amountIn }) => {
  let gasEstimate = 0n;

  const publicClient = getPublicClient();

  if (amountIn === 0n) {
    return gasEstimate;
  }

  const { address } = getAccount();

  if (!isNilOrEmpty(address)) {
    try {
      gasEstimate = await publicClient.estimateContractGas({
        address: contracts.mainnet.WOETH.address,
        abi: contracts.mainnet.WOETH.abi,
        functionName: 'redeem',
        args: [amountIn, address, address],
        account: address,
      });

      return gasEstimate;
    } catch {}
  }

  try {
    gasEstimate = await publicClient.estimateContractGas({
      address: contracts.mainnet.WOETH.address,
      abi: contracts.mainnet.WOETH.abi,
      functionName: 'redeem',
      args: [amountIn, whales.mainnet.WOETH, whales.mainnet.WOETH],
      account: whales.mainnet.WOETH,
    });
  } catch {}

  return gasEstimate;
};

const allowance: Allowance = async () => {
  // Unwrap WOETH does not require approval
  return maxUint256;
};

const estimateApprovalGas: EstimateApprovalGas = async () => {
  // Unwrap WOETH does not require approval
  return 0n;
};

const estimateRoute: EstimateRoute = async ({
  tokenIn,
  tokenOut,
  amountIn,
  route,
  slippage,
}) => {
  if (amountIn === 0n) {
    return {
      ...route,
      estimatedAmount: 0n,
      gas: 0n,
      rate: 0,
      approvedAmount: 0n,
      approvalGas: 0n,
    };
  }

  const [estimatedAmount, gas, approvedAmount, approvalGas] = await Promise.all(
    [
      estimateAmount({ tokenIn, tokenOut, amountIn }),
      estimateGas({ tokenIn, tokenOut, amountIn, slippage }),
      allowance(),
      estimateApprovalGas(),
    ],
  );

  return {
    ...route,
    estimatedAmount,
    gas,
    approvalGas,
    approvedAmount,
    rate:
      +formatUnits(amountIn, tokenIn.decimals) /
      +formatUnits(estimatedAmount, tokenOut.decimals),
  };
};

const approve: Approve = async ({ onSuccess }) => {
  // Unwrap WOETH does not require approval
  if (onSuccess) {
    await onSuccess(null);
  }
};

const swap: Swap = async ({ amountIn }) => {
  const { address } = getAccount();

  if (amountIn === 0n || isNilOrEmpty(address)) {
    return;
  }

  try {
    const { request } = await prepareWriteContract({
      address: contracts.mainnet.WOETH.address,
      abi: contracts.mainnet.WOETH.abi,
      functionName: 'redeem',
      args: [amountIn, address, address],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({ hash });
    // TODO trigger notification
    console.log('unwrap woeth done!');
  } catch (e) {
    // TODO trigger notification
    console.log(`unwrap woeth error!\n${e.message}`);
  }
};

export default {
  estimateAmount,
  estimateGas,
  estimateRoute,
  allowance,
  estimateApprovalGas,
  approve,
  swap,
};

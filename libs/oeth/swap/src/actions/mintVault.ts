import { isNilOrEmpty } from '@origin/shared/utils';

import type { SwapApi, SwapState } from '../types';

const estimateAmount = async ({ tokenIn, tokenOut, amountIn }: SwapState) => {
  if (amountIn === 0n) {
    return 0n;
  }

  return amountIn * 2n;
};

const estimateRoutes = async ({ tokenIn, tokenOut, amountIn }: SwapState) => {
  if (amountIn === 0n) {
    return [];
  }

  return [];
};

const swap = async ({ tokenIn, tokenOut, amountIn, swapRoute }: SwapState) => {
  if (amountIn === 0n || isNilOrEmpty(swapRoute)) {
    return;
  }
};

export default {
  estimateAmount,
  estimateRoutes,
  swap,
} as Partial<SwapApi>;

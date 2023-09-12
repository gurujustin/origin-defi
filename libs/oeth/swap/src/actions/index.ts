import mintVault from './mintVault';
import redeemVault from './redeemVault';
import swapCurve from './swapCurve';
import swapCurveEth from './swapCurveEth';
import swapZapperEth from './swapZapperEth';
import swapZapperSfrxeth from './swapZapperSfrxeth';
import unwrapWOETH from './unwrapWOETH';
import wrapOETH from './wrapOETH';

import type { SwapAction, SwapApi } from '../types';

const defaultApi: SwapApi = {
  estimateAmount: async ({ amountIn }) => {
    console.log('Amount estimation not implemented');

    return amountIn;
  },
  estimateGas: async () => {
    console.log('Gas estimation not implemented');

    return 0n;
  },
  estimateRoute: async ({ amountIn, route }) => {
    console.log('Route estimation not implemented');

    return { ...route, estimatedAmount: amountIn, gas: 0n, rate: 0 };
  },
  swap: async () => {
    console.log('Route swap operation not implemented');
  },
};

export const swapActions: Record<SwapAction, SwapApi> = {
  'swap-curve': { ...defaultApi, ...swapCurve },
  'swap-curve-eth': { ...defaultApi, ...swapCurveEth },
  'swap-zapper-eth': { ...defaultApi, ...swapZapperEth },
  'swap-zapper-sfrxeth': { ...defaultApi, ...swapZapperSfrxeth },
  'mint-vault': { ...defaultApi, ...mintVault },
  'redeem-vault': { ...defaultApi, ...redeemVault },
  'wrap-oeth': { ...defaultApi, ...wrapOETH },
  'unwrap-woeth': { ...defaultApi, ...unwrapWOETH },
};

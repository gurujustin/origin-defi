/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNilOrEmpty } from '@origin/shared/utils';
import { uniq } from 'ramda';

import type { SwapRoute, Token, TokenSource } from './types';

export const getAllAvailableTokens = (
  swapRoutes: SwapRoute[],
  source: TokenSource,
) => {
  if (isNilOrEmpty(source)) {
    return [];
  }

  return swapRoutes.reduce((acc, curr) => {
    return uniq([...acc, curr[source]]);
  }, [] as Token[]);
};

export const getAvailableTokensForSource = (
  swapRoutes: SwapRoute[],
  source: TokenSource,
  token: Token,
) => {
  if (isNilOrEmpty(source) || isNilOrEmpty(token?.symbol)) {
    return [];
  }

  return swapRoutes.reduce((acc, curr) => {
    if (source === 'tokenIn' && curr.tokenIn.symbol === token.symbol) {
      return uniq([...acc, curr.tokenOut]);
    }

    if (source === 'tokenOut' && curr.tokenOut.symbol === token.symbol) {
      return uniq([...acc, curr.tokenIn]);
    }

    return acc;
  }, [] as Token[]);
};

export const getAvailableRoutes = (
  swapRoutes: SwapRoute[],
  tokenIn: Token,
  tokenOut: Token,
) => {
  if (isNilOrEmpty(tokenIn) || isNilOrEmpty(tokenOut)) {
    return [];
  }

  return swapRoutes.filter(
    (r) =>
      r.tokenIn.symbol === tokenIn.symbol &&
      r.tokenOut.symbol === tokenOut.symbol,
  );
};

export const routeEq = (
  a: SwapRoute | undefined | null,
  b: SwapRoute | undefined | null,
) => {
  if (!a || !b) {
    return false;
  }

  return (
    a.tokenIn.symbol === b.tokenIn.symbol &&
    a.tokenOut.symbol === b.tokenOut.symbol &&
    a.action === b.action
  );
};

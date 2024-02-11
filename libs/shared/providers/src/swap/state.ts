import { useState } from 'react';

import { scale } from '@origin/shared/utils';
import { useDebouncedEffect } from '@react-hookz/web';
import { useQueryClient } from '@tanstack/react-query';
import { createContainer } from 'react-tracked';

import { getAvailableRoutes } from './utils';

import type { Dispatch, SetStateAction } from 'react';

import type { EstimatedSwapRoute, SwapState } from './types';

export const { Provider: SwapProvider, useTracked: useSwapState } =
  createContainer<
    SwapState,
    Dispatch<SetStateAction<SwapState>>,
    Pick<
      SwapState,
      | 'swapActions'
      | 'swapRoutes'
      | 'debounceTime'
      | 'slippage'
      | 'onInputAmountChange'
      | 'onInputTokenChange'
      | 'onOutputTokenChange'
      | 'onTokenFlip'
      | 'onSwapRouteChange'
      | 'onApproveStart'
      | 'onApproveSuccess'
      | 'onApproveReject'
      | 'onApproveFailure'
      | 'onSwapStart'
      | 'onSwapSuccess'
      | 'onSwapReject'
      | 'onSwapFailure'
    >
  >(
    ({
      swapActions,
      swapRoutes,
      slippage,
      debounceTime,
      onInputAmountChange,
      onInputTokenChange,
      onOutputTokenChange,
      onTokenFlip,
      onSwapRouteChange,
      onApproveStart,
      onApproveSuccess,
      onApproveReject,
      onApproveFailure,
      onSwapStart,
      onSwapSuccess,
      onSwapReject,
      onSwapFailure,
    }) => {
      const [state, setState] = useState<SwapState>({
        swapActions,
        swapRoutes,
        amountIn: 0n,
        tokenIn: swapRoutes[0].tokenIn,
        amountOut: 0n,
        tokenOut: swapRoutes[0].tokenOut,
        estimatedSwapRoutes: [],
        selectedSwapRoute: null,
        isSwapWaitingForSignature: false,
        isSwapRoutesLoading: false,
        isApprovalWaitingForSignature: false,
        isApprovalLoading: false,
        isSwapLoading: false,
        slippage: slippage ?? 0.001,
        debounceTime: debounceTime ?? 800,
        onInputAmountChange,
        onInputTokenChange,
        onOutputTokenChange,
        onTokenFlip,
        onSwapRouteChange,
        onApproveStart,
        onApproveSuccess,
        onApproveReject,
        onApproveFailure,
        onSwapStart,
        onSwapSuccess,
        onSwapReject,
        onSwapFailure,
      });
      const queryClient = useQueryClient();

      useDebouncedEffect(
        async () => {
          if (state.amountIn === 0n) {
            setState((state) => ({
              ...state,
              estimatedSwapRoutes: [],
              selectedSwapRoute: null,
              amountOut: 0n,
              isSwapRoutesLoading: false,
              isSwapWaitingForSignature: false,
              isApprovalLoading: false,
              isSwapLoading: false,
              isApprovalWaitingForSignature: false,
            }));
            state?.onInputAmountChange?.(0n);

            return;
          }

          const availableRoutes = getAvailableRoutes(
            state.swapRoutes,
            state.tokenIn,
            state.tokenOut,
          );
          const availabilities = await Promise.allSettled(
            availableRoutes.map((r) =>
              swapActions[r.action].isRouteAvailable({
                amountIn: state.amountIn,
                tokenIn: r.tokenIn,
                tokenOut: r.tokenOut,
              }),
            ),
          );
          const filteredRoutes = availableRoutes.filter(
            (_, i) =>
              availabilities[i].status === 'fulfilled' &&
              (availabilities[i] as PromiseFulfilledResult<boolean>).value,
          );

          const routes = await Promise.allSettled(
            filteredRoutes.map((route) =>
              queryClient.fetchQuery({
                queryKey: [
                  'estimateRoute',
                  state.tokenIn.symbol,
                  state.tokenOut.symbol,
                  route.action,
                  state.slippage,
                  state.amountIn.toString(),
                ] as const,
                queryFn: async () => {
                  let res: EstimatedSwapRoute;
                  try {
                    res = await swapActions[route.action].estimateRoute({
                      tokenIn: route.tokenIn,
                      tokenOut: route.tokenOut,
                      amountIn: state.amountIn,
                      amountOut: state.amountOut,
                      route,
                      slippage: state.slippage,
                    });
                  } catch (error) {
                    console.error(
                      `Fail to estimate route ${route.action}\n${error.message}`,
                    );
                    res = {
                      tokenIn: route.tokenIn,
                      tokenOut: route.tokenOut,
                      estimatedAmount: 0n,
                      action: route.action,
                      allowanceAmount: 0n,
                      approvalGas: 0n,
                      gas: 0n,
                      rate: 0,
                    };
                  }

                  return res;
                },
              }),
            ),
          );

          const sortedRoutes = routes
            .map((r) => (r.status === 'fulfilled' ? r.value : null))
            .sort((a, b) => {
              const valA =
                scale(a.estimatedAmount, a.tokenOut.decimals, 18) -
                (a.gas +
                  (a.allowanceAmount < state.amountIn ? a.approvalGas : 0n));
              const valB =
                scale(b.estimatedAmount, b.tokenOut.decimals, 18) -
                (b.gas +
                  (b.allowanceAmount < state.amountIn ? b.approvalGas : 0n));

              return valA < valB ? 1 : valA > valB ? -1 : 0;
            });

          setState((state) => ({
            ...state,
            estimatedSwapRoutes: sortedRoutes,
            selectedSwapRoute: sortedRoutes[0],
            amountOut: sortedRoutes[0].estimatedAmount ?? 0n,
            isSwapRoutesLoading: false,
          }));

          state?.onInputAmountChange?.(state.amountIn);
        },
        [state.amountIn],
        state.amountIn === 0n ? 0 : state.debounceTime,
      );

      return [state, setState];
    },
  );

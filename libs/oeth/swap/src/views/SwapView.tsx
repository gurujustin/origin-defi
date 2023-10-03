import { useState } from 'react';

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { GasPopover } from '@origin/oeth/shared';
import { TokenInput } from '@origin/shared/components';
import {
  ConnectedButton,
  usePrices,
  useSlippage,
} from '@origin/shared/providers';
import { composeContexts, isNilOrEmpty } from '@origin/shared/utils';
import { useIntl } from 'react-intl';
import { mainnet, useAccount, useBalance, useNetwork } from 'wagmi';

import { ApyHeader } from '../components/ApyHeader';
import { SwapRoute } from '../components/SwapRoute';
import { TokenSelectModal } from '../components/TokenSelectModal';
import { buttonActionLabel } from '../constants';
import {
  useHandleAmountInChange,
  useHandleApprove,
  useHandleSwap,
  useHandleTokenChange,
  useHandleTokenFlip,
  useSwapRouteAllowance,
  useTokenOptions,
} from '../hooks';
import { SwapProvider, useSwapState } from '../state';

import type { IconButtonProps } from '@mui/material';
import type { Token } from '@origin/shared/contracts';

import type { TokenSource } from '../types';

const tokenInputStyles = {
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: 0,
  paddingBlock: 0,
  paddingInline: 0,
  borderImageWidth: 0,
  boxSizing: 'border-box',
  '& .MuiInputBase-input': {
    padding: 0,
    boxSizing: 'border-box',
    fontStyle: 'normal',
    fontFamily: 'Sailec, sans-serif',
    fontSize: 24,
    lineHeight: 1.5,
    fontWeight: 700,
    '&::placeholder': {
      color: 'text.secondary',
      opacity: 1,
    },
  },
};

export const SwapView = () =>
  composeContexts([[SwapProvider]], <SwapViewWrapped />);

function SwapViewWrapped() {
  const intl = useIntl();
  const { value: slippage, set: setSlippage } = useSlippage();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [tokenSource, setTokenSource] = useState<TokenSource | null>(null);
  const [
    {
      amountIn,
      amountOut,
      tokenIn,
      tokenOut,
      selectedSwapRoute,
      isSwapLoading,
      isSwapRoutesLoading,
      isApprovalLoading,
    },
  ] = useSwapState();
  const { tokensIn, tokensOut } = useTokenOptions();
  const { data: prices, isLoading: isPriceLoading } = usePrices();
  const { data: allowance } = useSwapRouteAllowance(selectedSwapRoute);
  const { data: balTokenIn, isLoading: isBalTokenInLoading } = useBalance({
    address,
    token: tokenIn.address,
    watch: true,
    scopeKey: 'swap_balance',
  });
  const { data: balTokenOut, isLoading: isBalTokenOutLoading } = useBalance({
    address,
    token: tokenOut.address,
    watch: true,
    scopeKey: 'swap_balance',
  });
  const handleAmountInChange = useHandleAmountInChange();
  const handleTokenChange = useHandleTokenChange();
  const handleTokenFlip = useHandleTokenFlip();
  const handleApprove = useHandleApprove();
  const handleSwap = useHandleSwap();

  const handleCloseSelectionModal = () => {
    setTokenSource(null);
  };

  const handleSelectToken = (value: Token) => {
    handleTokenChange(tokenSource, value);
  };

  const handleSlippageChange = (val: number) => {
    setSlippage(val);
  };

  const needsApproval =
    isConnected &&
    amountIn > 0n &&
    !isBalTokenInLoading &&
    balTokenIn.value >= amountIn &&
    !isNilOrEmpty(selectedSwapRoute) &&
    selectedSwapRoute?.allowanceAmount < amountIn &&
    allowance < amountIn;
  const swapButtonLabel =
    amountIn === 0n
      ? intl.formatMessage({ defaultMessage: 'Enter an amount' })
      : amountIn > balTokenIn?.value
      ? intl.formatMessage({ defaultMessage: 'Insufficient funds' })
      : !isNilOrEmpty(selectedSwapRoute)
      ? intl.formatMessage(buttonActionLabel[selectedSwapRoute?.action])
      : '';
  const amountInInputDisabled = isSwapLoading || isApprovalLoading;
  const approveButtonDisabled =
    isNilOrEmpty(selectedSwapRoute) ||
    isSwapRoutesLoading ||
    isApprovalLoading ||
    amountIn > balTokenIn?.value;
  const swapButtonDisabled =
    needsApproval ||
    isNilOrEmpty(selectedSwapRoute) ||
    isBalTokenInLoading ||
    isSwapRoutesLoading ||
    isSwapLoading ||
    amountIn > balTokenIn?.value ||
    amountIn === 0n;

  return (
    <>
      <ApyHeader />
      <Card sx={{ mt: 3 }}>
        <CardHeader
          title={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>
                {intl.formatMessage({ defaultMessage: 'Swap' })}
              </Typography>
              <GasPopover
                slippage={slippage}
                onSlippageChange={handleSlippageChange}
                buttonProps={{
                  sx: {
                    position: 'relative',
                    right: (theme) => theme.spacing(-0.75),
                    svg: { width: 16, height: 16 },
                  },
                }}
              />
            </Stack>
          }
        />
        <CardContent>
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <TokenInput
              amount={amountIn}
              onAmountChange={handleAmountInChange}
              balance={balTokenIn?.value}
              isBalanceLoading={isBalTokenInLoading}
              token={tokenIn}
              onTokenClick={() => {
                setTokenSource('tokenIn');
              }}
              isNativeCurrency={
                tokenIn.symbol ===
                (chain?.nativeCurrency.symbol ?? mainnet.nativeCurrency.symbol)
              }
              tokenPriceUsd={prices?.[tokenIn.symbol]}
              isPriceLoading={isPriceLoading}
              isConnected={isConnected}
              isAmountDisabled={amountInInputDisabled}
              inputProps={{ sx: tokenInputStyles }}
              sx={{
                paddingBlock: 2.5,
                paddingBlockStart: 2.625,
                paddingInline: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
                backgroundColor: 'grey.900',
                borderBottomColor: 'transparent',
                '&:hover, &:focus-within': {
                  borderColor: 'transparent',
                },
                '&:hover': {
                  background: (theme) =>
                    `linear-gradient(${theme.palette.grey[900]}, ${
                      theme.palette.grey[900]
                    }) padding-box, linear-gradient(90deg, ${alpha(
                      theme.palette.primary.main,
                      0.4,
                    )} 0%, ${alpha(
                      theme.palette.primary.dark,
                      0.4,
                    )} 100%) border-box;`,
                },
                '&:focus-within': {
                  background: (theme) =>
                    `linear-gradient(${theme.palette.grey[900]}, ${theme.palette.grey[900]}) padding-box, linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%) border-box;`,
                },
              }}
            />
            <TokenInput
              amount={amountOut}
              balance={balTokenOut?.value}
              isAmountLoading={isSwapRoutesLoading}
              isBalanceLoading={isSwapRoutesLoading || isBalTokenOutLoading}
              token={tokenOut}
              onTokenClick={() => {
                setTokenSource('tokenOut');
              }}
              isNativeCurrency={
                tokenOut.symbol ===
                (chain?.nativeCurrency.symbol ?? mainnet.nativeCurrency.symbol)
              }
              tokenPriceUsd={prices?.[tokenOut.symbol]}
              isPriceLoading={isSwapRoutesLoading || isPriceLoading}
              isConnected={isConnected}
              hideMaxButton
              inputProps={{ readOnly: true, sx: tokenInputStyles }}
              sx={{
                paddingBlock: 2.5,
                paddingBlockStart: 2.625,
                paddingInline: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
                borderBottomRightRadius: (theme) => theme.shape.borderRadius,
                backgroundColor: (theme) => alpha(theme.palette.grey[400], 0.2),
              }}
            />
            <ArrowButton onClick={handleTokenFlip} />
          </Box>
          <SwapRoute
            sx={{
              mt: 1.5,
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
          <Collapse in={needsApproval} sx={{ mt: needsApproval ? 1.5 : 0 }}>
            <Button
              variant="action"
              fullWidth
              disabled={approveButtonDisabled}
              onClick={handleApprove}
            >
              {isSwapRoutesLoading ? (
                <CircularProgress size={32} color="inherit" />
              ) : isApprovalLoading ? (
                intl.formatMessage({ defaultMessage: 'Wait for signature' })
              ) : (
                intl.formatMessage({ defaultMessage: 'Approve' })
              )}
            </Button>
          </Collapse>
          <ConnectedButton
            variant="action"
            fullWidth
            disabled={swapButtonDisabled}
            onClick={handleSwap}
            sx={{ mt: 1.5 }}
          >
            {isSwapRoutesLoading ? (
              <CircularProgress size={32} color="inherit" />
            ) : isSwapLoading ? (
              intl.formatMessage({ defaultMessage: 'Waiting for signature' })
            ) : (
              swapButtonLabel
            )}
          </ConnectedButton>
        </CardContent>
      </Card>
      <TokenSelectModal
        open={!isNilOrEmpty(tokenSource)}
        onClose={handleCloseSelectionModal}
        tokens={tokenSource === 'tokenIn' ? tokensIn : tokensOut}
        onSelectToken={handleSelectToken}
      />
    </>
  );
}

function ArrowButton(props: IconButtonProps) {
  return (
    <IconButton
      {...props}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: { md: 40, xs: 36 },
        height: { md: 40, xs: 36 },
        margin: 'auto',
        zIndex: 2,
        fill: (theme) => theme.palette.background.paper,
        strokeWidth: (theme) => theme.typography.pxToRem(2),
        stroke: (theme) => theme.palette.grey[700],
        backgroundColor: (theme) => theme.palette.background.paper,
        border: '1px solid',
        borderColor: 'divider',
        '& img': {
          transition: (theme) => theme.transitions.create('transform'),
        },
        '&:hover': {
          backgroundColor: (theme) => theme.palette.background.default,
          '& img': {
            transform: 'rotate(-180deg)',
          },
        },
        ...props?.sx,
      }}
    >
      <Box
        component="img"
        src="/images/splitarrow.svg"
        sx={{
          height: { md: 20, xs: 18 },
        }}
      />
    </IconButton>
  );
}

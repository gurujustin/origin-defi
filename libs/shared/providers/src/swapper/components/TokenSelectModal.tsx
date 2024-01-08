import {
  Box,
  Dialog,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { TokenIcon } from '@origin/shared/components';
import { ascend, descend, prop, sortWith } from 'ramda';
import { FaCheck } from 'react-icons/fa6';
import { useAccount, useBalance } from 'wagmi';

import { useFormat } from '../../intl';
import { usePrices } from '../../prices';

import type { DialogProps, MenuItemProps } from '@mui/material';
import type { Token } from '@origin/shared/contracts';

export type TokenOption = {
  isSwappable: boolean;
  isSelected: boolean;
} & Token;

export type TokenSelectModalProps = {
  tokens: TokenOption[];
  onSelectToken: (value: Token) => void;
} & DialogProps;

export const TokenSelectModal = ({
  tokens,
  onSelectToken,
  onClose,
  ...rest
}: TokenSelectModalProps) => {
  const sortedTokens = sortWith<TokenOption>([
    ascend(prop('isSelected')),
    descend(prop('isSwappable')),
  ])(tokens);

  return (
    <Dialog
      maxWidth="sm"
      PaperProps={{
        elevation: 23,
        sx: {
          background: (theme) => theme.palette.background.paper,
          borderRadius: 2,
          border: '1px solid',
          borderColor: (theme) => theme.palette.grey[800],
          backgroundImage: 'none',
          margin: 0,
          minWidth: 'min(90vw, 33rem)',
          py: 1,
        },
      }}
      {...rest}
      onClose={onClose}
    >
      <MenuList disablePadding>
        {sortedTokens.map((token, i) => (
          <TokenListItem
            key={`token-${token.address || 'eth'}-${i}`}
            token={token}
            disabled={token.isSelected}
            onClick={() => {
              onClose({}, 'backdropClick');
              onSelectToken(token);
            }}
            sx={{
              opacity: token.isSwappable ? 1 : 0.5,
            }}
          />
        ))}
      </MenuList>
    </Dialog>
  );
};

type TokenListItemProps = {
  token: TokenOption;
} & MenuItemProps;

function TokenListItem({ token, ...rest }: TokenListItemProps) {
  const { formatAmount, formatCurrency } = useFormat();
  const { address } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: token.address,
  });
  const { data: prices } = usePrices();

  const bal = parseFloat(balance?.formatted ?? '0');
  const balUsd = bal * (prices?.[token.symbol] ?? 0);

  return (
    <MenuItem
      {...rest}
      disabled={token.isSelected}
      sx={{
        display: 'flex',
        paddingInline: 2,
        paddingBlock: 1,
        justifyContent: 'space-between',
        gap: 1.5,
        alignItems: 'center',
        background: (theme) => theme.palette.background.paper,
        borderRadius: 1,
        '&:hover': {
          background: (theme) => theme.palette.grey[700],
        },
        ...rest?.sx,
      }}
    >
      <Stack direction="row" gap={1.5} alignItems="center">
        <TokenIcon symbol={token?.symbol} width="2rem" height="2rem" />
        <Box>
          <Typography fontWeight={500}>{token?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {token.symbol}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2}>
        {token?.isSelected && (
          <Stack display="flex" justifyContent="center" alignItems="center">
            <FaCheck fontSize={16} color="#fff" />
          </Stack>
        )}
        <Box sx={{ textAlign: 'right' }}>
          <Typography fontWeight={500}>
            {isBalanceLoading ? (
              <Skeleton width={30} />
            ) : (
              formatAmount(balance?.value, balance?.decimals)
            )}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {formatCurrency(balUsd)}
          </Typography>
        </Box>
      </Stack>
    </MenuItem>
  );
}

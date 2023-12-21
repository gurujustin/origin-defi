import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  useUserDelegatorsQuery,
  useUserInfoQuery,
} from '@origin/governance/shared';
import { ExternalLink, InfoTooltip } from '@origin/shared/components';
import { tokens } from '@origin/shared/contracts';
import {
  AddressLabel,
  TransactionButton,
  useFormat,
  UserAvatar,
} from '@origin/shared/providers';
import { isNilOrEmpty } from '@origin/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { take } from 'ramda';
import { useIntl } from 'react-intl';
import { isAddressEqual } from 'viem';
import { useAccount } from 'wagmi';

import { DelegateButton } from './DelegateModal';

import type { CardProps } from '@mui/material';
import type { HexAddress } from '@origin/shared/utils';

export const VoteDelegationCard = (props: CardProps) => {
  const intl = useIntl();
  const { formatAmount } = useFormat();
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(
    { address: address },
    { enabled: !!address, select: (data) => data?.ogvAddresses?.at?.(0) },
  );
  const { data: delegators, isLoading: isDelegatorsLoading } =
    useUserDelegatorsQuery({ address: address }, { enabled: !!address });

  const visibleDelegators = take(
    5,
    delegators?.ogvAddresses?.filter(
      (d) => !isAddressEqual(d.id as HexAddress, address),
    ) ?? [],
  );
  const isSelfDelegating =
    userInfo?.delegatee?.id?.toLowerCase() === address?.toLowerCase();
  const delegatee = userInfo?.delegatee?.id as HexAddress;
  const noVotingPower = BigInt(userInfo?.veogvBalance ?? 0) === 0n;

  return (
    <Card {...props}>
      <CardHeader
        title={intl.formatMessage({ defaultMessage: 'Vote Delegation' })}
      />
      {isConnected ? (
        isUserInfoLoading ? (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '5rem',
              width: 1,
            }}
          >
            <CircularProgress size={20} />
          </Stack>
        ) : noVotingPower ? (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              width: 1,
              p: 3,
            }}
          >
            <Typography color="text.secondary">
              {intl.formatMessage({ defaultMessage: 'No voting power' })}
            </Typography>
          </Stack>
        ) : (
          <>
            <CardContent>
              <Typography color="text.secondary">
                {intl.formatMessage({ defaultMessage: 'Delegating to' })}&nbsp;
                <InfoTooltip
                  tooltipLabel={intl.formatMessage({
                    defaultMessage:
                      'veOGV holders may delegate their voting power for off-chain votes to themselves or to another wallet address. The delegatee receives the extra voting power only on proposals the delegator has not voted on.',
                  })}
                />
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} pt={2}>
                {isSelfDelegating ? (
                  <Typography>
                    {intl.formatMessage({ defaultMessage: 'Self' })}
                  </Typography>
                ) : (
                  <>
                    <UserAvatar
                      address={isSelfDelegating ? address : delegatee}
                      width={20}
                    />
                    <ExternalLink
                      href={`https://etherscan.io/address/${delegatee}`}
                    >
                      <AddressLabel
                        address={delegatee}
                        maxWidth={100}
                        enableEnsName
                      />
                    </ExternalLink>
                  </>
                )}
              </Stack>
            </CardContent>
            <CardContent sx={{ pt: 0, pl: 2 }}>
              {isSelfDelegating ? (
                <DelegateButton variant="outlined">
                  {intl.formatMessage({
                    defaultMessage: 'Delegate my voting power',
                  })}
                </DelegateButton>
              ) : (
                <TransactionButton
                  contract={tokens.mainnet.veOGV}
                  functionName="delegate"
                  args={[address]}
                  variant="outlined"
                  label={intl.formatMessage({
                    defaultMessage: 'Delegate to self',
                  })}
                  activityTitle={intl.formatMessage({
                    defaultMessage: 'Delegate',
                  })}
                  activitySubtitle={intl.formatMessage(
                    {
                      defaultMessage: 'Delegate {balance} veOGV to self',
                    },
                    {
                      balance: formatAmount(
                        BigInt(userInfo?.veogvBalance ?? 0),
                        tokens.mainnet.OGV.decimals,
                        undefined,
                        { notation: 'compact', maximumSignificantDigits: 4 },
                      ),
                    },
                  )}
                  onSuccess={() => {
                    queryClient.invalidateQueries({
                      queryKey: ['useGovernanceInfo'],
                    });
                    queryClient.invalidateQueries({
                      queryKey: [useUserInfoQuery.getKey({ address })],
                    });
                  }}
                />
              )}
            </CardContent>
            {!isNilOrEmpty(visibleDelegators) && (
              <CardContent sx={{ pt: 0 }}>
                <Typography color="text.secondary">
                  {intl.formatMessage({
                    defaultMessage: 'Delegated by others',
                  })}
                  &nbsp;
                  <InfoTooltip
                    tooltipLabel={intl.formatMessage({
                      defaultMessage:
                        'veOGV holders may delegate their voting power for off-chain votes to themselves or to another wallet address. The delegatee receives the extra voting power only on proposals the delegator has not voted on.',
                    })}
                  />
                </Typography>
                {isDelegatorsLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    pt={3}
                  >
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  <Stack>
                    {visibleDelegators.map((d) => (
                      <Stack
                        key={d.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        pt={3}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <UserAvatar address={d.id as HexAddress} width={20} />
                          <ExternalLink
                            href={`https://etherscan.io/address/${d.id}`}
                          >
                            <AddressLabel
                              address={d.id as HexAddress}
                              maxWidth={60}
                              enableEnsName
                            />
                          </ExternalLink>
                        </Stack>
                        <Typography>
                          {intl.formatMessage(
                            {
                              defaultMessage: '{count} {symbol}',
                            },
                            {
                              count: formatAmount(
                                BigInt(d.votingPower),
                                tokens.mainnet.veOGV.decimals,
                                undefined,
                                {
                                  notation: 'compact',
                                  maximumSignificantDigits: 4,
                                },
                              ),
                              symbol: tokens.mainnet.veOGV.symbol,
                            },
                          )}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </CardContent>
            )}
          </>
        )
      ) : (
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: 1,
            p: 3,
          }}
        >
          <Typography color="text.secondary">
            {intl.formatMessage({ defaultMessage: 'Connect wallet to view' })}
          </Typography>
        </Stack>
      )}
    </Card>
  );
};
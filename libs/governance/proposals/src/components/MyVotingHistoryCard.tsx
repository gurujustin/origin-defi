import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { useUserVotesQuery } from '@origin/governance/shared';
import { tokens } from '@origin/shared/contracts';
import { isNilOrEmpty } from '@origin/shared/utils';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { StatusBadge } from './StatusBadge';

import type { CardProps, StackProps } from '@mui/material';
import type { UserVotesQuery } from '@origin/governance/shared';

export const MyVotingHistoryCard = (props: CardProps) => {
  const intl = useIntl();
  const { address, isConnected } = useAccount();
  const { data: votes, isLoading: isVotesLoading } = useUserVotesQuery(
    {
      address,
    },
    { enabled: isConnected, select: (data) => data?.ogvProposalVotes ?? [] },
  );

  return (
    <Card {...props}>
      <CardHeader
        title={intl.formatMessage({ defaultMessage: 'My Voting History' })}
      />
      {isConnected ? (
        isVotesLoading ? (
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
        ) : isNilOrEmpty(votes) ? (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              width: 1,
              p: 3,
            }}
          >
            <Typography color="text.secondary">
              {intl.formatMessage({ defaultMessage: 'No votes' })}
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5} divider={<Divider />}>
            {votes.map((vote) => (
              <VoteHistory key={vote.id} vote={vote} />
            ))}
          </Stack>
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

type VoteHistoryProps = {
  vote: UserVotesQuery['ogvProposalVotes'][number];
} & StackProps;

function VoteHistory({ vote, ...rest }: VoteHistoryProps) {
  const intl = useIntl();

  const label = {
    For: intl.formatMessage({ defaultMessage: 'Voted For' }),
    Against: intl.formatMessage({ defaultMessage: 'Voted Against' }),
    Abstain: intl.formatMessage({ defaultMessage: 'Abstain' }),
  }[vote.type];
  const icon = {
    For: (
      <Box
        sx={{
          borderRadius: '50%',
          width: 14,
          height: 14,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'success.main',
          zIndex: 2,
        }}
      >
        <Box
          component="img"
          src="images/icons/check-regular-dark.svg"
          width={10}
        />
      </Box>
    ),
    Against: <Box component="img" src="/images/failed.svg" width={14} />,
    Abstain: <Box component="img" src="images/warn.webp" width={14} />,
  }[vote.type];

  return (
    <Stack spacing={1.5} px={3} py={1.5} {...rest}>
      <Stack direction="row" spacing={2}>
        <Box component="img" src={tokens.mainnet.OETH.icon} width={24} />
        <StatusBadge status={vote?.proposal?.status} />
      </Stack>
      <MuiLink
        component={Link}
        to={`/${vote.proposal.id}`}
        variant="h5"
        sx={{
          maxWidth: 1,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ':hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {vote?.proposal?.description}
      </MuiLink>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {intl.formatDate(new Date(vote.timestamp), {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
        >
          {icon}&nbsp;<Typography variant="body2">{label}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
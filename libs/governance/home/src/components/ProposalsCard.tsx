import { useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { tokens } from '@origin/shared/contracts';
import { useIntl } from 'react-intl';

import { useProposalsQuery } from '../queries.generated';
import { StatusBadge } from './StatusBadge';

import type { CardProps, StackProps } from '@mui/material';

import type { Proposal } from '../types';

export const ProposalsCard = (props: CardProps) => {
  const intl = useIntl();
  const [cursor, setCursor] = useState(undefined);
  const { data } = useProposalsQuery(
    { cursor, pageSize: 3 },
    {
      keepPreviousData: true,
    },
  );

  const handleShowMoreClick = () => {
    if (data?.ogvProposalsConnection?.pageInfo?.hasNextPage) {
      setCursor(data?.ogvProposalsConnection?.pageInfo?.endCursor);
    }
  };

  return (
    <Card>
      <CardHeader
        title={intl.formatMessage({ defaultMessage: 'Proposals' })}
        action={
          <Button>
            {intl.formatMessage({ defaultMessage: 'All Proposals' })}
            &nbsp;
            <Box
              component="img"
              src="images/icons/chevron-down-regular.svg"
              width={10}
            />
          </Button>
        }
      />
      <Stack divider={<Divider />}>
        {data?.ogvProposalsConnection?.edges?.map((edge) => (
          <ProposalRow key={edge?.node?.id} proposal={edge?.node} />
        ))}
      </Stack>
      <Stack justifyContent="center" alignItems="center" py={2}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ minWidth: 120 }}
          onClick={handleShowMoreClick}
        >
          {intl.formatMessage({ defaultMessage: 'Show more' })}
        </Button>
      </Stack>
    </Card>
  );
};

type ProposalRowProps = { proposal: Proposal } & StackProps;

function ProposalRow({ proposal, ...rest }: ProposalRowProps) {
  const intl = useIntl();

  return (
    <Stack direction="row" p={3} {...rest}>
      <Stack width={0.75} spacing={1}>
        <Stack direction="row" spacing={2}>
          <Box component="img" src={tokens.mainnet.OETH.icon} width={24} />
          <StatusBadge proposal={proposal} />
        </Stack>
        <Typography variant="h5">{proposal.description}</Typography>
        <Stack
          direction="row"
          divider={
            <Box
              sx={{
                backgroundColor: 'grey.600',
                borderRadius: '50%',
                width: 4,
                height: 4,
              }}
            />
          }
        >
          <Typography variant="body2" color="text.secondary">
            {intl.formatDate(new Date(proposal.timestamp), {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
        </Stack>
      </Stack>
      <Stack width={0.25}></Stack>
    </Stack>
  );
}

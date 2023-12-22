import { OgvProposalState } from '@origin/governance/shared';
import { defineMessage } from 'react-intl';

export const governanceChoices = ['For', 'Against'] as const;

export const statusLabels = {
  [OgvProposalState.Active]: defineMessage({ defaultMessage: 'Active' }),
  [OgvProposalState.Canceled]: defineMessage({
    defaultMessage: 'Canceled',
  }),
  [OgvProposalState.Defeated]: defineMessage({
    defaultMessage: 'Defeated',
  }),
  [OgvProposalState.Executed]: defineMessage({
    defaultMessage: 'Executed',
  }),
  [OgvProposalState.Expired]: defineMessage({
    defaultMessage: 'Expired',
  }),
  [OgvProposalState.Pending]: defineMessage({
    defaultMessage: 'Pending',
  }),
  [OgvProposalState.Queued]: defineMessage({ defaultMessage: 'Queued' }),
  [OgvProposalState.Succeeded]: defineMessage({
    defaultMessage: 'Succeeded',
  }),
  closed: defineMessage({
    defaultMessage: 'Closed',
  }),
};

export const governanceSupport = {
  Against: 0,
  For: 1,
  Abstain: 2,
};

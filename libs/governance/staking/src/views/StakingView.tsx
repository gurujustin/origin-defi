import { Stack } from '@mui/material';
import { trackSentryError } from '@origin/governance/shared';
import { ErrorBoundary, ErrorCard } from '@origin/shared/components';

import { LockupsCard } from '../components/LockupsCard';
import { StackingHeader } from '../components/StakingHeader';

export const StakingView = () => {
  return (
    <Stack spacing={3}>
      <ErrorBoundary ErrorComponent={<ErrorCard />} onError={trackSentryError}>
        <StackingHeader />
      </ErrorBoundary>
      <ErrorBoundary ErrorComponent={<ErrorCard />} onError={trackSentryError}>
        <LockupsCard />
      </ErrorBoundary>
    </Stack>
  );
};

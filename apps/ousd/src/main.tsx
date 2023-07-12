import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { OUSDRoot } from './components';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@origin/shared/data-access';
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material';
import { theme } from '@origin/shared/theme';
import { IntlProvider } from 'react-intl';
import { en } from './lang';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <IntlProvider messages={en} locale="en" defaultLocale="en">
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider theme={theme} defaultMode="dark">
          <CssBaseline />
          <OUSDRoot />
        </CssVarsProvider>
      </QueryClientProvider>
    </IntlProvider>
  </StrictMode>
);

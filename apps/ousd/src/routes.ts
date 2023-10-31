import { SwapView } from '@origin/ousd/swap';
import { NotFoundPage } from '@origin/shared/components';
import { defineMessage } from 'react-intl';

import { App } from './App';

import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: SwapView,
        handle: { label: defineMessage({ defaultMessage: 'Swap' }) },
      },
      // {
      //   path: '/redeem',
      //   Component: RedeemView,
      //   handle: { label: defineMessage({ defaultMessage: 'Redeem' }) },
      // },
      // {
      //   path: '/history',
      //   Component: HistoryView,
      //   handle: { label: defineMessage({ defaultMessage: 'History' }) },
      // },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
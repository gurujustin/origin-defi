import React from 'react';

import { SvgIcon } from '@mui/material';

export function EmptyCheckbox() {
  return (
    <SvgIcon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="3.5"
          stroke="#B5BECA"
        />
      </svg>
    </SvgIcon>
  );
}

// DO NOT EDIT - GENERATED
export const DripperABI = [
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_token', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousGovernor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newGovernor',
        type: 'address',
      },
    ],
    name: 'GovernorshipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousGovernor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newGovernor',
        type: 'address',
      },
    ],
    name: 'PendingGovernorshipTransfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'availableFunds',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collect',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectAndRebase',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'drip',
    outputs: [
      { internalType: 'uint64', name: 'lastCollect', type: 'uint64' },
      { internalType: 'uint192', name: 'perBlock', type: 'uint192' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dripDuration',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governor',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isGovernor',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_durationSeconds', type: 'uint256' },
    ],
    name: 'setDripDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_newGovernor', type: 'address' },
    ],
    name: 'transferGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_asset', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

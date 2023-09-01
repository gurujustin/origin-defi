// DO NOT EDIT - GENERATED
export const VaultValueCheckerABI = [
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_ousd', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'int256', name: 'lowValueDelta', type: 'int256' },
      { internalType: 'int256', name: 'highValueDelta', type: 'int256' },
      { internalType: 'int256', name: 'lowSupplyDelta', type: 'int256' },
      { internalType: 'int256', name: 'highSupplyDelta', type: 'int256' },
    ],
    name: 'checkDelta',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ousd',
    outputs: [{ internalType: 'contract OUSD', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'snapshots',
    outputs: [
      { internalType: 'uint256', name: 'vaultValue', type: 'uint256' },
      { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'takeSnapshot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vault',
    outputs: [
      { internalType: 'contract VaultCore', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

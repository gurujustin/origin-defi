import { contracts } from '@origin/shared/contracts';
import { useQuery } from '@tanstack/react-query';
import { readContracts } from '@wagmi/core';
import { useConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { CurveFactoryABI } from './abis/CurveFactory';
import { CurveRegistryExchangeABI } from './abis/CurveRegistryExchange';

import type { HexAddress } from '@origin/shared/utils';

export const useCurve = () => {
  const config = useConfig();

  return useQuery({
    queryKey: ['useCurve'],
    staleTime: Infinity,
    queryFn: async () => {
      const addresses = await readContracts(config, {
        contracts: [
          {
            address: contracts.mainnet.CurveAddressProvider.address,
            abi: contracts.mainnet.CurveAddressProvider.abi,
            functionName: 'get_address',
            args: [2n],
          },
          {
            address: contracts.mainnet.CurveAddressProvider.address,
            abi: contracts.mainnet.CurveAddressProvider.abi,
            functionName: 'get_address',
            args: [3n],
          },
        ],
      });

      const underlyings = await readContracts(config, {
        contracts: [
          {
            address: addresses[1].result,
            abi: CurveFactoryABI,
            functionName: 'get_coins',
            args: [contracts.mainnet.OETHCurvePool.address],
          },
          {
            address: addresses[1].result,
            abi: CurveFactoryABI,
            functionName: 'get_underlying_coins',
            args: [contracts.mainnet.OUSDCurveMetaPool.address],
          },
        ],
      });

      return {
        CurveRegistryExchange: {
          address: addresses[0].result,
          chainId: mainnet.id,
          abi: CurveRegistryExchangeABI,
          name: 'CurveRegistryExchange',
        },
        OethPoolUnderlyings: underlyings[0].result as unknown as HexAddress[],
        OusdMetaPoolUnderlyings: underlyings[1]
          .result as unknown as HexAddress[],
      };
    },
  });
};

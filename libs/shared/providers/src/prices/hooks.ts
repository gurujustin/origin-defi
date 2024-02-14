import {
  ChainlinkAggregatorABI,
  contracts,
  tokens as toks,
} from '@origin/shared/contracts';
import { useQuery } from '@tanstack/react-query';
import { readContracts } from '@wagmi/core';
import axios from 'axios';
import { pathOr } from 'ramda';
import { formatUnits, parseUnits } from 'viem';
import { useConfig } from 'wagmi';

import { coingeckoApiEndpoint, coingeckoTokenIds } from './constants';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { Config } from '@wagmi/core';

import type { SupportedToken } from './types';

const chainlinkOracles = {
  ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  DAI_USD: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  USDC_USD: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
  USDT_USD: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  FRAX_USD: '0xb9e1e3a9feff48998e45fa90847ed4d467e8bcfd',
  frxETH_ETH: '0xc58f3385fbc1c8ad2c0c9a061d7c13b141d7a5df',
  stETH_ETH: '0x86392dc19c0b719886221c78ab11eb8cf5c52812',
  rETH_ETH: '0x536218f9e9eb48863970252233c8f271f554c2d0',
} as const;

const coinGeckoTokens = [coingeckoTokenIds.WETH, coingeckoTokenIds.OGN];

export const usePrices = (
  options?: UseQueryOptions<
    Record<SupportedToken, number>,
    Error,
    Record<SupportedToken, number>,
    ['usePrices', Config]
  >,
) => {
  const config = useConfig();

  return useQuery({
    queryKey: ['usePrices', config],
    staleTime: import.meta.env.DEV ? 1000 * 60 * 30 : 1000 * 30,
    gcTime: import.meta.env.DEV ? 1000 * 60 * 60 : 1000 * 60,
    queryFn: async () => {
      const res = await Promise.allSettled([
        readContracts(config, {
          contracts: [
            ...Object.values(chainlinkOracles).map((address) => ({
              address,
              abi: ChainlinkAggregatorABI,
              functionName: 'latestRoundData',
            })),
            {
              address: toks.mainnet.wOETH.address,
              abi: toks.mainnet.wOETH.abi,
              functionName: 'previewRedeem',
              args: [parseUnits('1', toks.mainnet.wOETH.decimals)],
            },
            {
              address: toks.mainnet.wOUSD.address,
              abi: toks.mainnet.wOUSD.abi,
              functionName: 'previewRedeem',
              args: [parseUnits('1', toks.mainnet.wOUSD.decimals)],
            },
            {
              address: toks.mainnet.sfrxETH.address,
              abi: toks.mainnet.sfrxETH.abi,
              functionName: 'previewRedeem',
              args: [parseUnits('1', toks.mainnet.sfrxETH.decimals)],
            },
            {
              address: contracts.mainnet.DIAOracle.address,
              abi: contracts.mainnet.DIAOracle.abi,
              functionName: 'getValue',
              args: ['OETH/USD'],
            },
            {
              address: contracts.mainnet.DIAOracle.address,
              abi: contracts.mainnet.DIAOracle.abi,
              functionName: 'getValue',
              args: ['OUSD/USD'],
            },
          ],
          allowFailure: true,
        }),
        axios.get(
          `${coingeckoApiEndpoint}/simple/price?ids=${coinGeckoTokens.join(
            '%2C',
          )}&vs_currencies=usd`,
        ),
      ]);

      const coinGecko = res[1].status === 'fulfilled' ? res[1].value.data : {};

      const WETH = coinGecko?.[coingeckoTokenIds.WETH]?.usd ?? 0;
      const OGN = coinGecko?.[coingeckoTokenIds.OGN]?.usd ?? 0;

      const multi = res[0].status === 'fulfilled' ? res[0].value : [];

      const OETH = +formatUnits(pathOr(0n, [11, 'result', 0], multi), 8);
      const OUSD = +formatUnits(pathOr(0n, [12, 'result', 0], multi), 8);
      const ETH = +formatUnits(pathOr(0n, [0, 'result', 1], multi), 8);
      const DAI = +formatUnits(pathOr(0n, [1, 'result', 1], multi), 8);
      const USDC = +formatUnits(pathOr(0n, [2, 'result', 1], multi), 8);
      const USDT = +formatUnits(pathOr(0n, [3, 'result', 1], multi), 8);
      const FRAX = +formatUnits(pathOr(0n, [4, 'result', 1], multi), 8);
      const frxETH =
        +formatUnits(
          pathOr(0n, [5, 'result', 1], multi),
          toks.mainnet.ETH.decimals,
        ) * ETH;
      const stETH =
        +formatUnits(
          pathOr(0n, [6, 'result', 1], multi),
          toks.mainnet.ETH.decimals,
        ) * ETH;
      const rETH =
        +formatUnits(
          pathOr(0n, [7, 'result', 1], multi),
          toks.mainnet.ETH.decimals,
        ) * ETH;
      const wOETH =
        +formatUnits(
          pathOr(0n, [8, 'result'], multi),
          toks.mainnet.wOETH.decimals,
        ) * OETH;
      const wOUSD =
        +formatUnits(
          pathOr(0n, [9, 'result'], multi),
          toks.mainnet.wOUSD.decimals,
        ) * OUSD;
      const sfrxETH =
        +formatUnits(
          pathOr(0n, [10, 'result'], multi),
          toks.mainnet.sfrxETH.decimals,
        ) * frxETH;

      return {
        ETH,
        DAI,
        USDC,
        USDT,
        FRAX,
        frxETH,
        stETH,
        rETH,
        wOETH,
        wOUSD,
        sfrxETH,
        WETH,
        OETH,
        OUSD,
        OGN,
      };
    },
    ...options,
  });
};

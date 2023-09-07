import { erc20ABI } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export const tokens = {
  mainnet: {
    ETH: {
      address: undefined,
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'ETH',
      icon: '/images/tokens/ETH.svg',
      decimals: 18,
      symbol: 'ETH',
    },
    WETH: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Wrapped Ether',
      icon: '/images/tokens/WETH.svg',
      decimals: 18,
      symbol: 'WETH',
    },
    // Native stablecoins
    DAI: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Dai Stablecoin',
      icon: '/images/tokens/DAI.svg',
      decimals: 18,
      symbol: 'DAI',
    },
    USDC: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'USD Coin',
      icon: '/images/tokens/USDC.svg',
      decimals: 6,
      symbol: 'USDC',
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Tether USD',
      icon: '/images/tokens/USDT.svg',
      decimals: 6,
      symbol: 'USDT',
    },
    TUSD: {
      address: '0x0000000000085d4780B73119b644AE5ecd22b376',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'TrueUSD',
      icon: '/images/tokens/TUSD.svg',
      decimals: 18,
      symbol: 'TUSD',
    },
    // Origin
    OETH: {
      address: '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Origin Ether',
      icon: '/images/tokens/OETH.svg',
      decimals: 18,
      symbol: 'OETH',
    },
    WOETH: {
      address: '0xDcEe70654261AF21C44c093C300eD3Bb97b78192',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Wrapped Origin Ether',
      icon: '/images/tokens/WOETH.svg',
      decimals: 18,
      symbol: 'WOETH',
    },
    OUSD: {
      address: '0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Origin Dollar',
      icon: '/images/tokens/OUSD.svg',
      decimals: 18,
      symbol: 'OUSD',
    },
    WOUSD: {
      address: '0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'WrappedOrigin Dollar',
      icon: '/images/tokens/WOUSD.svg',
      decimals: 18,
      symbol: 'WOUSD',
    },
    OGN: {
      address: '0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Origin Token',
      icon: '/images/tokens/OGN.svg',
      decimals: 18,
      symbol: 'OGN',
    },
    OGV: {
      address: '0x9c354503C38481a7A7a51629142963F98eCC12D0',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Origin Dollar Governance',
      icon: '/images/tokens/OGV.svg',
      decimals: 18,
      symbol: 'OGV',
    },
    veOGV: {
      address: '0x0C4576Ca1c365868E162554AF8e385dc3e7C66D9',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Staked Origin Dollar Governance',
      icon: '/images/tokens/OGV.svg',
      decimals: 18,
      symbol: 'veOGV',
    },
    // 1-inch LP
    stETH: {
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Liquid Staked Ether 2.0',
      icon: '/images/tokens/stETH.svg',
      decimals: 18,
      symbol: 'stETH',
    },
    // rocket pool
    rETH: {
      address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Rocket Pool ETH',
      icon: '/images/tokens/rETH.svg',
      decimals: 18,
      symbol: 'rETH',
    },
    // Frax
    frxETH: {
      address: '0x5e8422345238f34275888049021821e8e08caa1f',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Frax Ether',
      icon: '/images/tokens/frxETH.svg',
      decimals: 18,
      symbol: 'frxETH',
    },
    sfrxETH: {
      address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
      chainId: mainnet.id,
      abi: erc20ABI,
      name: 'Staked Frax Ether',
      icon: ' /images/tokens/sfrxETH.svg',
      decimals: 18,
      symbol: 'sfrxETH',
    },
  },
} as const;

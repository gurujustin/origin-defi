import axios from 'axios';
import { pathOr } from 'ramda';

export const axiosInstance = axios.create({
  baseURL: 'https://squid.subsquid.io/prime-eth-squid/graphql',
});

export const graphqlClient =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: RequestInit['headers'],
  ) =>
  async () => {
    const res = await axiosInstance<TData>({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      data: { query, variables },
    });

    return pathOr<TData>({} as TData, ['data', 'data'], res);
  };

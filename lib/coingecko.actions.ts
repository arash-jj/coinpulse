"use server"

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
    ): Promise<T> {
    const url = qs.stringifyUrl(
        {
        url: `${BASE_URL}/${endpoint}`,
        query: params,
        },
        { skipEmptyString: true, skipNull: true },
    );
    const response = await fetch(url, {
        headers: {
        'x-cg-api-key': API_KEY,
        'Content-Type': 'application/json',
        } as Record<string, string>,
        next: { revalidate },
    })
    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
    }
    return response.json();
}
export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null
    ): Promise<PoolData> {
    const fallback: PoolData = {
        id: "",
        address: "",
        name: "",
        network: "",
    };
    if (network && contractAddress) {
        const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
        );
        return poolData.data?.[0] ?? fallback;
    }
    try {
        const poolData = await fetcher<{ data: PoolData[] }>(
        "/onchain/search/pools",
        { query: id }
        );
        return poolData.data?.[0] ?? fallback;
    } catch {
        return fallback;
    }
};

export async function searchCoins(query: string): Promise<SearchCoin[]> {
    if (!query) return [];
    const searchRes = await fetch(
        `${BASE_URL}/search?query=${encodeURIComponent(query)}`,
        { next: { revalidate: 60 } }
    );
    if (!searchRes.ok) {
        throw new Error('Failed to search coins');
    }
    const searchData = await searchRes.json();
    const coinIds: string[] = searchData.coins
        ?.slice(0, 10)
        .map((coin: any) => coin.id);
    if (!coinIds.length) return [];
    const marketsRes = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(
        ','
        )}&price_change_percentage=24h`,
        { next: { revalidate: 60 } }
    );
    if (!marketsRes.ok) {
        throw new Error('Failed to fetch coin markets');
    }
    const marketsData = await marketsRes.json();
    return marketsData.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        thumb: coin.image,
        data: {
        price_change_percentage_24h:
            coin.price_change_percentage_24h ?? 0,
        },
    }));
}

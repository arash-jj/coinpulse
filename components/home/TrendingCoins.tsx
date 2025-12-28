import { fetcher } from "@/lib/coingecko.actions"
import DataTable from "../DataTable"
import Link from "next/dist/client/link"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"


const TrendingCoins = async () => {
    const columns: DataTableColumn<TrendingCoin>[] = [
        {
            header: 'Coin',
            cellClassName: 'name-cell',
            cell: (coin) => {
            const item = coin.item
            return (
                <Link href={`/coins/${item.id}`}>
                <Image src={item.large} alt={item.name} width={36} height={36} />
                <p>{item.name}</p>
                </Link>
            )
            }
        },
        {
            header: '24h Change',
            cell: (coin) => {
            const item = coin.item
            const isTrendingUp = item.data.price_change_percentage_24h.usd > 0
            return (
                <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                <p className="flex items-center gap-1">
                    {isTrendingUp ? (
                    <TrendingUp width={16} height={16} />
                    ) : (
                    <TrendingDown width={16} height={16} />
                    )}
                    {item.data.price_change_percentage_24h.usd.toFixed(2)}%
                </p>
                </div>
            )
            }
        },
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (coin) => coin.item.data.price.toFixed(2)
        }
    ]
    const trendingCoins = await fetcher<TrendingCoin[]>('/search/trending', undefined, 300);
    return (
        <div id="trending-coins">
            <h4>Trending Coins</h4>
            <div id="trending-coins">
                <DataTable 
                columns={columns} 
                data={trendingCoins.coins.slice(0, 6) || []} 
                rowKey={(coin)=> coin.item.id}
                headerCellClassName="py-3"
                bodyCellClassName="py-2"
                />
            </div>
        </div>
    )
}

export default TrendingCoins
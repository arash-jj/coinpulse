import Categories from "@/components/home/Categories"
import CoinOverview from "@/components/home/CoinOverview"
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from "@/components/home/fallback"
import TrendingCoins from "@/components/home/TrendingCoins"
import { fetcher } from "@/lib/coingecko.actions"
import { cn, formatCurrency } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

const page = async () => {
  const coin = await fetcher<CoinDetailsData>('/coins/bitcoin', {
    dex_pair_format: 'symbol'
  })
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
        <CoinOverview />
        </Suspense>
        <Suspense fallback={<TrendingCoinsFallback />}>
        <TrendingCoins />
        </Suspense>
      </section>
      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  )
}

export default page
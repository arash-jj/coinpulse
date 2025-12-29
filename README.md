# CoinPulse — Analytics Dashboard 🧮
<p align="center">
    CoinPulse is a high-performance analytics dashboard built with Next.js 16, TailwindCSS v4, and shadcn/ui, delivering real-time market intelligence via CoinGecko’s API.TradingView candlestick charts to visualize OHLCV data with surgical precision.
</p>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss)

</div>

## Tech Stack ⚙️
- **[Next.js](https://nextjs.org)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Shadcn/ui](https://ui.shadcn.com/docs)**
- **[CoinGecko API](https://www.coingecko.com/en/api)**
- **[TradingView](https://www.tradingview.com/lightweight-charts/)**

## Feature ✨
- **Home Dashboard**: Displays crucial market health indicators like **Total Market Cap** and **BTC & ETH dominance**, alongside a dynamic list of **Trending Tokens**, all retrieved instantly using the CoinGecko `/global` and `/search/trending` endpoints.
-  **Token Discovery Page**: A comprehensive, sortable and searchable table featuring key token metrics (Price, 24h change, Market Cap Rank) for mass market analysis, powered by the scalable `/coins/markets` REST API and optimized with pagination for efficient browsing.
- **Interactive Candlestick Chart**: Integrates **TradingView Lightweight Charts** to visualize market trends and price action with surgical precision, rendering multi-timeframe OHLCV data fetched from CoinGecko’s high-performance market endpoints.
- **Global Search Functionality**: A powerful, unified search bar that allows users to quickly locate any crypto asset by name or symbol, linking directly to the respective Token Detail Page via the CoinGecko `/search` and `/coins/{id}` REST endpoints.

## Architecture Overview 🧠

CoinPulse is designed with a clear separation between data fetching, state management, and UI rendering:

- **Data Layer**: Market data is fetched from CoinGecko using REST endpoints and normalized before being passed to UI components.
- **Pagination Strategy**: Token lists are paginated at the API level to avoid large payloads and reduce memory pressure.
- **URL State Sync**: Query parameters (search, pagination, selected token) are synced with the URL to allow shareable, bookmarkable views.
- **Rendering Strategy**: Charts and tables are dynamically rendered with minimal re-renders to preserve performance on large datasets.

## Performance Considerations ⚡

- Avoids loading full market datasets at once by leveraging server-side pagination.
- Chart rendering is isolated from table state to prevent unnecessary re-renders.
- Lightweight Charts is used instead of heavier charting libraries to keep bundle size minimal.
- Debounced search logic reduces API load during rapid input changes.



## Quick Start 💣
**Cloning the Repository**
```bash
git clone https://github.com/arash-jj/coinpulse.git
cd coinpulse
```
**Installation**
Install the project dependencies using npm:

```bash
npm install
```
**Set Up Environment Variables**
```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=

NEXT_PUBLIC_COINGECKO_API_KEY=
```
Replace the placeholder values with your real credentials.
**Running Project**
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the project.

## UI Preview 🎨
![Screenshot](/public/screenshots/home-page.png)
![Screenshot](/public/screenshots/global-search.png)
![Screenshot](/public/screenshots/all-coins-page.png)
# A3 Elite Terminal

![Elite Intelligence for Traders](./banner.png)

[![Instagram](https://img.shields.io/badge/Instagram-%40mrhenderson.251-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/mrhenderson.251)
[![Telegram](https://img.shields.io/badge/Telegram-%40a3en3-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/a3en3)

A professional-grade, real-time financial market terminal designed for high-performance market monitoring across Forex, Metals, Indices, Crypto, and Commodities.

## 🚀 Features

- **Real-Time Market Data**: Live price updates via WebSockets for low-latency monitoring.
- **Multi-Asset Support**: Comprehensive coverage of Forex Majors, Crosses, Metals (Gold, Silver, Platinum, Palladium), Global Indices, Cryptocurrencies, and Commodities.
- **Advanced Market Analysis**:
  - **DXY & Currency Indexes**: Real-time calculation of the US Dollar Index and other major currency strength indexes.
  - **Trading Sessions**: Visual tracking of Sydney, Tokyo, London, and New York sessions.
  - **Killzones & Silver Bullets**: Integrated ICT (Inner Circle Trader) concepts for institutional timing.
- **Interactive Charts**: High-performance TradingView charts for every asset.
- **Economic Calendar**: Real-time tracking of high-impact news events.
- **Responsive Design**: Optimized for both desktop and mobile trading environments.
- **Robust Data Pipeline**: Multi-source API integration with automatic failover (OANDA, Binance, ExchangeRate-API).

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, WebSocket (ws).
- **Build Tool**: Vite.
- **State Management**: React Hooks (Context API).
- **API Integration**:
  - **Forex/Metals/Indices**: OANDA v20 API (Primary), ExchangeRate-API (Fallback).
  - **Crypto**: Binance API (Primary), Binance Public API (Fallback).
- **Charts**: TradingView Lightweight Charts & Widgets.

## 🏗️ Architecture

The application follows a modern full-stack architecture:

1.  **Server (`server.ts`)**:
    -   Acts as a proxy to external financial APIs to hide sensitive keys and bypass CORS.
    -   Implements a caching layer to optimize API usage and prevent rate limiting.
    -   Manages a WebSocket server for broadcasting real-time price fluctuations to all connected clients.
2.  **Frontend Services (`src/services/`)**:
    -   `priceService.ts`: Handles initial data fetching and WebSocket connection management.
    -   `newsService.ts`: Fetches and processes economic calendar events.
3.  **UI Components (`src/components/`)**:
    -   Modularized components for the Asset List, Chart View, Session Tracker, and News Feed.
    -   Responsive layout using CSS Grid and Flexbox.

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/a3-elite-terminal.git
    cd a3-elite-terminal
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory based on `.env.example`.

4.  Start the development server:
    ```bash
    npm run dev
    ```

## 🔑 Environment Variables

The following environment variables are required for full functionality:

| Variable | Description |
| :--- | :--- |
| `OANDA_API_KEY` | Your OANDA v20 API Personal Access Token. |
| `OANDA_ACCOUNT_ID` | Your OANDA v20 Account ID. |
| `BINANCE_API_KEY` | Your Binance API Key (optional, for higher rate limits). |

*Note: The application will automatically fall back to public APIs (ExchangeRate-API/Binance Public) if these keys are not provided.*

## 📈 API Integration Details

- **Forex/Indices/Metals**: Primary data is sourced from OANDA's institutional-grade pricing engine.
- **Crypto**: Real-time ticker data is pulled from Binance's 24hr ticker endpoint.
- **Fallback**: In case of primary API failure, the system seamlessly switches to ExchangeRate-API for FX and Binance Public API for Crypto to ensure zero downtime.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the trading community.

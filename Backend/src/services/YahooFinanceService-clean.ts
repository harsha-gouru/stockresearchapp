import yahooFinance from 'yahoo-finance2';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
  lastUpdated: string;
}

export interface DetailedStockInfo extends StockQuote {
  name: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  description?: string;
  pe?: number;
  eps?: number;
  beta?: number;
  dividend?: number;
  yield?: number;
  yearHigh?: number;
  yearLow?: number;
  avgVolume?: number;
}

export interface MarketOverview {
  indices: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
  lastUpdated: string;
}

class YahooFinanceService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1 minute cache

  /**
   * Get real-time stock quote
   */
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const cacheKey = `quote_${symbol}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const result = await yahooFinance.quote(symbol);
      
      if (!result || !result.regularMarketPrice) {
        console.warn(`No data found for symbol: ${symbol}`);
        return null;
      }

      const quote: StockQuote = {
        symbol: result.symbol || symbol,
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        volume: result.regularMarketVolume || 0,
        marketCap: this.formatMarketCap(result.marketCap),
        dayHigh: result.regularMarketDayHigh || 0,
        dayLow: result.regularMarketDayLow || 0,
        open: result.regularMarketOpen || 0,
        previousClose: result.regularMarketPreviousClose || 0,
        lastUpdated: new Date().toISOString()
      };

      this.setCache(cacheKey, quote);
      return quote;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get detailed stock information
   */
  async getDetailedStockInfo(symbol: string): Promise<DetailedStockInfo | null> {
    try {
      const cacheKey = `detailed_${symbol}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const result = await yahooFinance.quote(symbol);

      if (!result || !result.regularMarketPrice) {
        return null;
      }

      const detailedInfo: DetailedStockInfo = {
        symbol: result.symbol || symbol,
        name: result.longName || result.shortName || symbol,
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        volume: result.regularMarketVolume || 0,
        marketCap: this.formatMarketCap(result.marketCap),
        dayHigh: result.regularMarketDayHigh || 0,
        dayLow: result.regularMarketDayLow || 0,
        open: result.regularMarketOpen || 0,
        previousClose: result.regularMarketPreviousClose || 0,
        exchange: result.fullExchangeName,
        yearHigh: result.fiftyTwoWeekHigh,
        yearLow: result.fiftyTwoWeekLow,
        avgVolume: result.averageVolume,
        lastUpdated: new Date().toISOString()
      };

      this.setCache(cacheKey, detailedInfo);
      return detailedInfo;
    } catch (error) {
      console.error(`Error fetching detailed info for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Search for stocks by symbol or name
   */
  async searchStocks(query: string): Promise<Array<{ symbol: string; name: string; exchange: string }>> {
    try {
      const cacheKey = `search_${query}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const result = await yahooFinance.search(query);
      
      const stocks = result.quotes
        .filter((quote: any) => quote.symbol && quote.shortname)
        .slice(0, 10) // Limit to top 10 results
        .map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.shortname || quote.longname || quote.symbol,
          exchange: quote.exchange || quote.exchDisp || ''
        }));

      this.setCache(cacheKey, stocks);
      return stocks;
    } catch (error) {
      console.error(`Error searching stocks for query "${query}":`, error);
      return [];
    }
  }

  /**
   * Get multiple stock quotes at once
   */
  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const quotes = await Promise.all(
        symbols.map(symbol => this.getStockQuote(symbol))
      );
      
      return quotes.filter(quote => quote !== null) as StockQuote[];
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [];
    }
  }

  /**
   * Get market overview with indices and trending stocks
   */
  async getMarketOverview(): Promise<MarketOverview> {
    try {
      const cacheKey = 'market_overview';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Major market indices
      const indexSymbols = ['^GSPC', '^DJI', '^IXIC', '^RUT']; // S&P 500, Dow, NASDAQ, Russell 2000
      const indexNames = ['S&P 500', 'Dow Jones', 'NASDAQ', 'Russell 2000'];

      const indices = await Promise.all(
        indexSymbols.map(async (symbol, index) => {
          try {
            const quote = await yahooFinance.quote(symbol);
            return {
              symbol,
              name: indexNames[index],
              price: quote.regularMarketPrice || 0,
              change: quote.regularMarketChange || 0,
              changePercent: quote.regularMarketChangePercent || 0
            };
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
            return {
              symbol,
              name: indexNames[index],
              price: 0,
              change: 0,
              changePercent: 0
            };
          }
        })
      );

      // Get trending stocks (using popular symbols)
      const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
      const trendingQuotes = await this.getMultipleQuotes(trendingSymbols);

      // Sort by change percent for gainers/losers
      const gainers = trendingQuotes
        .filter(q => q.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 5);

      const losers = trendingQuotes
        .filter(q => q.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 5);

      const mostActive = trendingQuotes
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);

      const overview: MarketOverview = {
        indices: indices.filter(idx => idx.price > 0),
        topGainers: gainers,
        topLosers: losers,
        mostActive,
        lastUpdated: new Date().toISOString()
      };

      this.setCache(cacheKey, overview, 300000); // Cache for 5 minutes
      return overview;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return {
        indices: [],
        topGainers: [],
        topLosers: [],
        mostActive: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Get historical data for a stock
   */
  async getHistoricalData(symbol: string, period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' = '1y') {
    try {
      const result = await yahooFinance.historical(symbol, {
        period1: this.getPeriodStartDate(period),
        period2: new Date(),
        interval: this.getIntervalForPeriod(period)
      });

      return result.map(data => ({
        date: data.date.toISOString(),
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        volume: data.volume,
        adjClose: data.adjClose
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  // Helper methods
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, customTimeout?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Clean up expired cache entries
    setTimeout(() => {
      this.cache.delete(key);
    }, customTimeout || this.cacheTimeout);
  }

  private formatMarketCap(marketCap?: number): string | undefined {
    if (!marketCap) return undefined;
    
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(1)}M`;
    }
    return marketCap.toString();
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '5d': return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      case '1mo': return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case '3mo': return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case '6mo': return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case '1y': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case '2y': return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      case '5y': return new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      case '10y': return new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
      case 'ytd': return new Date(now.getFullYear(), 0, 1);
      case 'max': return new Date(1970, 0, 1);
      default: return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
  }

  private getIntervalForPeriod(period: string): '1d' | '1wk' | '1mo' {
    switch (period) {
      case '1d':
      case '5d':
      case '1mo': return '1d';
      case '3mo':
      case '6mo':
      case '1y': return '1wk';
      default: return '1mo';
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();

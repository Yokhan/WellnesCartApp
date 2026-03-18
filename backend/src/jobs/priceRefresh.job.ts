import { logger } from '../utils/logger';

/**
 * Placeholder for the price refresh job.
 *
 * In v1.5 this will:
 *  - Query data_freshness table for stale store catalogues
 *  - Trigger scraping / Pyaterochka / Perekrestok / VkusVill API calls
 *  - Update the `products` Tier-B table with fresh prices
 *
 * For MVP it only logs a heartbeat so the cron schedule is wired up
 * and observable in production logs.
 */
export async function runPriceRefreshJob(): Promise<void> {
  logger.info('priceRefresh job: running (placeholder — price scraping not yet implemented)');
}

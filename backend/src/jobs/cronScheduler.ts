import cron from 'node-cron';
import { logger } from '../utils/logger';
import { runListGenerationJob } from './listGeneration.job';
import { runPriceRefreshJob } from './priceRefresh.job';

let cronJobs: ReturnType<typeof cron.schedule>[] = [];

export function startCronJobs(): void {
  if (cronJobs.length > 0) {
    logger.warn({}, 'Cron jobs already started');
    return;
  }

  // Weekly list generation: every Sunday at 04:00 Moscow time
  const weeklyListJob = cron.schedule(
    '0 4 * * 0',
    async () => {
      try {
        await runListGenerationJob();
      } catch (err) {
        logger.error({ err }, 'Weekly list generation job failed unexpectedly');
      }
    },
    { timezone: 'Europe/Moscow' }
  );

  // Price refresh: every day at 06:00
  const priceRefreshJob = cron.schedule(
    '0 6 * * *',
    async () => {
      try {
        await runPriceRefreshJob();
      } catch (err) {
        logger.error({ err }, 'Price refresh job failed unexpectedly');
      }
    },
    { timezone: 'Europe/Moscow' }
  );

  cronJobs = [weeklyListJob, priceRefreshJob];
  logger.info({ count: cronJobs.length }, 'Cron jobs started');
}

export function stopCronJobs(): void {
  for (const job of cronJobs) {
    job.stop();
  }
  cronJobs = [];
  logger.info('Cron jobs stopped');
}

import { getSupabaseAdminClient } from '../utils/supabase';
import { generateShoppingList } from '../services/list-builder.service';
import { logger } from '../utils/logger';

/**
 * Finds all users who have an active nutrition profile and generates
 * a weekly shopping list for each one.
 *
 * Failures for individual users are caught and logged so one user's
 * error cannot stop list generation for others.
 */
export async function runListGenerationJob(): Promise<void> {
  logger.info('listGeneration job: starting');

  const supabase = getSupabaseAdminClient();

  const { data: profiles, error } = await supabase
    .from('user_nutrition_profiles')
    .select('user_id');

  if (error) {
    logger.error({ err: error }, 'listGeneration job: failed to fetch user profiles');
    return;
  }

  const userIds = (profiles ?? []).map((p: Record<string, unknown>) => String(p['user_id']));
  logger.info({ total: userIds.length }, 'listGeneration job: processing users');

  let successCount = 0;
  let failureCount = 0;

  for (const userId of userIds) {
    try {
      await generateShoppingList(userId);
      successCount += 1;
      logger.debug({ userId }, 'listGeneration job: list generated');
    } catch (err) {
      failureCount += 1;
      logger.error({ err, userId }, 'listGeneration job: failed for user');
    }
  }

  logger.info(
    { successCount, failureCount, total: userIds.length },
    'listGeneration job: completed'
  );
}

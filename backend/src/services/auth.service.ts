import crypto from 'crypto';
import { getSupabaseAdminClient } from '../utils/supabase';
import { generateTokenPair } from '../utils/jwt';
import { logger } from '../utils/logger';
import env from '../config/env';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

function parseTelegramInitData(initData: string): TelegramUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(env.TELEGRAM_BOT_TOKEN ?? '')
    .digest();

  const expectedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (expectedHash !== hash) {
    logger.warn('Telegram initData HMAC mismatch');
    return null;
  }

  const userStr = params.get('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as TelegramUser;
  } catch {
    return null;
  }
}

export interface TelegramAuthResult {
  user: { id: string; firstName: string; username?: string };
  token: string;
  refreshToken: string;
}

export async function authenticateTelegram(initData: string): Promise<TelegramAuthResult> {
  const tgUser = parseTelegramInitData(initData);
  if (!tgUser) throw new Error('Invalid Telegram initData');

  const supabase = getSupabaseAdminClient();

  // Find existing user by telegram_id
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, first_name, username')
    .eq('telegram_id', tgUser.id)
    .single();

  let userId: string;

  if (existingUser) {
    userId = String(existingUser.id);
    await supabase
      .from('users')
      .update({
        first_name: tgUser.first_name,
        last_name: tgUser.last_name ?? null,
        username: tgUser.username ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  } else {
    // Create Supabase auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `tg_${tgUser.id}@smartcart.app`,
      password: crypto.randomBytes(32).toString('hex'),
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create auth user: ${authError?.message ?? 'unknown'}`);
    }

    userId = authData.user.id;

    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      telegram_id: tgUser.id,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name ?? null,
      username: tgUser.username ?? null,
    });

    if (insertError) {
      throw new Error(`Failed to create user record: ${insertError.message}`);
    }
  }

  const { token, refreshToken } = generateTokenPair({ userId, telegramId: String(tgUser.id) });

  return {
    user: { id: userId, firstName: tgUser.first_name, username: tgUser.username },
    token,
    refreshToken,
  };
}

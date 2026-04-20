import type { Product, UserProfile, ProductDetail } from '../../shared/types';
import { evalGate } from '../quality-gate';
import { computeValueScore } from '../value-score';

export function rankSwaps(
  candidates: Product[],
  current: Product,
  profile: UserProfile,
  limit = 3,
): ProductDetail[] {
  const ranked = candidates
    .filter((c) => c.id !== current.id)
    .filter((c) => c.convenience_tier === current.convenience_tier)
    .filter((c) => c.use_context.some((ctx) => current.use_context.includes(ctx)))
    .map((c) => {
      const gate = evalGate(c);
      const value = computeValueScore(c, profile);
      return { ...c, gate, value, evidence: 'SR/MA' as const };
    })
    .filter((c) => c.gate.gate_passed)
    .sort((a, b) => b.value.composite_score - a.value.composite_score);
  return ranked.slice(0, limit);
}

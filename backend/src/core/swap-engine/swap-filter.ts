import { ConvenienceTier, UseContext } from '../../shared/types/enums';
import { ProductWithScore } from '../../shared/types/product.types';

export interface SwapFilterInput {
  sourceConvenienceTier: ConvenienceTier;
  sourceUseContext: UseContext[];
  candidates: ProductWithScore[];
  excludeIds?: string[]; // products already in list
}

// From BRD: swaps only within same convenience_tier AND at least one shared use_context
export function filterSwapCandidates(input: SwapFilterInput): ProductWithScore[] {
  const { sourceConvenienceTier, sourceUseContext, candidates, excludeIds = [] } = input;

  return candidates.filter((candidate) => {
    if (excludeIds.includes(candidate.id)) return false;
    if (candidate.convenienceTier !== sourceConvenienceTier) return false;
    return candidate.useContext.some((ctx) => sourceUseContext.includes(ctx));
  });
}

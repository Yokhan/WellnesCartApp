import { evaluateQualityGate } from './gate';
import { QualityGateInput } from '../../shared/types/quality-gate.types';

const baseInput: QualityGateInput = {
  nutriscoreGrade: 'A',
  nutriscoreScore: -3,
  novaGroup: 1,
  hasTransFats: false,
  sodiumMg: 50,
  ingredients: [],
};

describe('evaluateQualityGate', () => {
  describe('TIER-1 BLOCKS', () => {
    it('blocks product with NutriScore D', () => {
      const result = evaluateQualityGate({ ...baseInput, nutriscoreGrade: 'D' });
      expect(result.gatePassed).toBe(false);
      expect(result.gateTier).toBe(1);
      expect(result.blockReason).toContain('NutriScore D');
    });

    it('blocks product with NutriScore E', () => {
      const result = evaluateQualityGate({ ...baseInput, nutriscoreGrade: 'E' });
      expect(result.gatePassed).toBe(false);
      expect(result.gateTier).toBe(1);
      expect(result.blockReason).toContain('NutriScore E');
    });

    it('blocks NOVA 4 + NutriScore C', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        novaGroup: 4,
        nutriscoreGrade: 'C',
      });
      expect(result.gatePassed).toBe(false);
      expect(result.gateTier).toBe(1);
      expect(result.blockReason).toContain('NOVA 4');
      expect(result.blockReason).toContain('NutriScore C');
    });

    it('blocks NOVA 4 + NutriScore D', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        novaGroup: 4,
        nutriscoreGrade: 'D',
      });
      expect(result.gatePassed).toBe(false);
    });

    it('blocks product with trans fats', () => {
      const result = evaluateQualityGate({ ...baseInput, hasTransFats: true });
      expect(result.gatePassed).toBe(false);
      expect(result.gateTier).toBe(1);
      expect(result.transFatFlagged).toBe(true);
      expect(result.blockReason).toContain('трансжиры');
    });
  });

  describe('TIER-2 WARNINGS', () => {
    it('warns for NOVA 4 with good NutriScore A — does not block', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        novaGroup: 4,
        nutriscoreGrade: 'A',
      });
      expect(result.gatePassed).toBe(true);
      expect(result.gateTier).toBe(2);
      const codes = result.warnings.map((w) => w.code);
      expect(codes).toContain('NOVA4_GOOD_NUTRISCORE');
    });

    it('warns for NOVA 4 with NutriScore B — does not block', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        novaGroup: 4,
        nutriscoreGrade: 'B',
      });
      expect(result.gatePassed).toBe(true);
      expect(result.warnings.some((w) => w.code === 'NOVA4_GOOD_NUTRISCORE')).toBe(true);
    });

    it('warns for high sodium (> 1500mg)', () => {
      const result = evaluateQualityGate({ ...baseInput, sodiumMg: 1600 });
      expect(result.gatePassed).toBe(true);
      expect(result.sodiumFlagged).toBe(true);
      expect(result.warnings.some((w) => w.code === 'HIGH_SODIUM')).toBe(true);
    });

    it('does not warn for sodium at exactly 1500mg', () => {
      const result = evaluateQualityGate({ ...baseInput, sodiumMg: 1500 });
      expect(result.sodiumFlagged).toBe(false);
      expect(result.warnings.some((w) => w.code === 'HIGH_SODIUM')).toBe(false);
    });

    it('warns for emulsifiers in ingredients', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        ingredients: ['E471', 'sunflower oil'],
      });
      expect(result.gatePassed).toBe(true);
      expect(result.emulsifierFlagged).toBe(true);
      expect(result.warnings.some((w) => w.code === 'EMULSIFIERS')).toBe(true);
    });

    it('accumulates multiple warnings', () => {
      const result = evaluateQualityGate({
        ...baseInput,
        sodiumMg: 2000,
        ingredients: ['E466'],
      });
      expect(result.gatePassed).toBe(true);
      expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('CLEAN PASS', () => {
    it('passes clean product with no warnings', () => {
      const result = evaluateQualityGate(baseInput);
      expect(result.gatePassed).toBe(true);
      expect(result.gateTier).toBeNull();
      expect(result.warnings).toHaveLength(0);
      expect(result.transFatFlagged).toBe(false);
      expect(result.emulsifierFlagged).toBe(false);
      expect(result.sodiumFlagged).toBe(false);
    });

    it('passes NutriScore B product cleanly', () => {
      const result = evaluateQualityGate({ ...baseInput, nutriscoreGrade: 'B' });
      expect(result.gatePassed).toBe(true);
      expect(result.gateTier).toBeNull();
    });

    it('passes NutriScore C product with NOVA 1', () => {
      const result = evaluateQualityGate({ ...baseInput, nutriscoreGrade: 'C', novaGroup: 1 });
      expect(result.gatePassed).toBe(true);
    });

    it('preserves nutriscoreGrade and novaGroup in result', () => {
      const result = evaluateQualityGate({ ...baseInput, nutriscoreGrade: 'B', novaGroup: 2 });
      expect(result.nutriscoreGrade).toBe('B');
      expect(result.novaGroup).toBe(2);
    });
  });
});

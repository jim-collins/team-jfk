import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';
import { questions } from '../questions';

// Expected results come from spec.md requirements 14-18 and the reason wording in intent.md.

const allEligible = {
  propertyType: 'house',
  ownership: 'outright',
  incomeBand: 'up-to-30000',
  insulation: 'none',
  heating: 'gas',
};

function labelOf(questionId, value) {
  const question = questions.find((q) => q.id === questionId);
  return question.options.find((o) => o.value === value).label;
}

describe('checkEligibility', () => {
  it('says a homeowner with no limiting answers is eligible, with no reasons', () => {
    expect(checkEligibility(allEligible)).toEqual({ status: 'eligible', reasons: [] });
  });

  it('treats every property type, both kinds of ownership, and gas or oil heating as eligible', () => {
    for (const propertyType of ['house', 'flat', 'bungalow']) {
      for (const ownership of ['outright', 'mortgage']) {
        for (const heating of ['gas', 'oil']) {
          const result = checkEligibility({ ...allEligible, propertyType, ownership, heating });
          expect(result.status).toBe('eligible');
        }
      }
    }
  });

  it('says a home that already has a heat pump is not eligible', () => {
    expect(checkEligibility({ ...allEligible, heating: 'heat-pump' })).toEqual({
      status: 'not-eligible',
      reasons: ['Your home already has a heat pump.'],
    });
  });

  it('says a home with loft and wall insulation is not eligible', () => {
    expect(checkEligibility({ ...allEligible, insulation: 'loft-and-walls' })).toEqual({
      status: 'not-eligible',
      reasons: ['Your home already has loft and wall insulation.'],
    });
  });

  it('says electric heating is partially eligible', () => {
    expect(checkEligibility({ ...allEligible, heating: 'electric' })).toEqual({
      status: 'partial',
      reasons: ['Your home is heated by electric heating.'],
    });
  });

  it('says loft only or walls only is partially eligible', () => {
    for (const insulation of ['loft', 'walls']) {
      expect(checkEligibility({ ...allEligible, insulation })).toEqual({
        status: 'partial',
        reasons: ['Your home already has some insulation.'],
      });
    }
  });

  it('puts an income of exactly £30,000 in the eligible band', () => {
    expect(labelOf('incomeBand', 'up-to-30000')).toBe('Up to £30,000');
    expect(checkEligibility({ ...allEligible, incomeBand: 'up-to-30000' }).status).toBe('eligible');
  });

  it('puts an income of exactly £50,000 in the partially eligible band', () => {
    expect(labelOf('incomeBand', '30001-to-50000')).toBe('£30,001 to £50,000');
    expect(checkEligibility({ ...allEligible, incomeBand: '30001-to-50000' })).toEqual({
      status: 'partial',
      reasons: ['Your household income is between £30,001 and £50,000, so you can get part of the grant.'],
    });
  });

  it('says an income over £50,000 is not eligible', () => {
    expect(labelOf('incomeBand', 'over-50000')).toBe('Over £50,000');
    expect(checkEligibility({ ...allEligible, incomeBand: 'over-50000' })).toEqual({
      status: 'not-eligible',
      reasons: ['Your household income is over £50,000.'],
    });
  });

  it('lets "not eligible" win over "partial", and lists every reason in question order', () => {
    const result = checkEligibility({
      ...allEligible,
      incomeBand: 'over-50000',
      insulation: 'loft',
      heating: 'heat-pump',
    });
    expect(result).toEqual({
      status: 'not-eligible',
      reasons: [
        'Your household income is over £50,000.',
        'Your home already has some insulation.',
        'Your home already has a heat pump.',
      ],
    });
  });

  it('stays partial when several answers are partial', () => {
    const result = checkEligibility({
      ...allEligible,
      incomeBand: '30001-to-50000',
      insulation: 'walls',
      heating: 'electric',
    });
    expect(result.status).toBe('partial');
    expect(result.reasons).toHaveLength(3);
  });
});

describe('questions', () => {
  it('offers exactly the answers in the spec, in order (req 4)', () => {
    const offered = Object.fromEntries(questions.map((q) => [q.id, q.options.map((o) => o.label)]));
    expect(offered).toEqual({
      propertyType: ['House', 'Flat', 'Bungalow'],
      ownership: ['Own outright', 'Own with a mortgage'],
      incomeBand: ['Up to £30,000', '£30,001 to £50,000', 'Over £50,000'],
      insulation: ['None', 'Loft only', 'Walls only', 'Loft and walls'],
      heating: ['Gas boiler', 'Oil boiler', 'Electric heating', 'Heat pump'],
    });
  });
});

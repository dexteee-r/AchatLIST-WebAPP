import { describe, it, expect } from 'vitest';
import { pmeta, validUrl } from './helpers';

describe('pmeta', () => {
  it('returns correct metadata for known priority', () => {
    expect(pmeta('high').weight).toBe(3);
    expect(pmeta('medium').weight).toBe(2);
    expect(pmeta('low').weight).toBe(1);
  });

  it('falls back to medium for unknown priority', () => {
    expect(pmeta('unknown').weight).toBe(2);
  });
});

describe('validUrl', () => {
  it('accepts empty string', () => {
    expect(validUrl('')).toBe(true);
  });

  it('accepts valid URL', () => {
    expect(validUrl('https://example.com')).toBe(true);
  });

  it('rejects invalid URL', () => {
    expect(validUrl('not-a-url')).toBe(false);
  });
});

import { formatPrice, formatDate, formatDateTime, slugify, truncate, generateOrderNumber, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats positive numbers correctly', () => {
    expect(formatPrice(0)).toBe('₹0');
    expect(formatPrice(100)).toBe('₹100');
    expect(formatPrice(1000)).toBe('₹1,000');
    expect(formatPrice(99999)).toBe('₹99,999');
  });

  it('handles decimal prices', () => {
    expect(formatPrice(100.50)).toBe('₹101'); // Rounds to nearest integer
    expect(formatPrice(100.49)).toBe('₹100');
  });

  it('uses Indian numbering format', () => {
    expect(formatPrice(100000)).toBe('₹1,00,000');
    expect(formatPrice(10000000)).toBe('₹1,00,00,000');
  });
});

describe('formatDate', () => {
  const testDate = new Date('2024-03-15T10:30:00Z');

  it('formats date in Indian locale', () => {
    const result = formatDate(testDate);
    expect(result).toMatch(/15 Mar 2024/);
  });
});

describe('formatDateTime', () => {
  const testDate = new Date('2024-03-15T10:30:00Z');

  it('formats date and time in Indian locale', () => {
    const result = formatDateTime(testDate);
    expect(result).toMatch(/15 Mar 2024/);
    expect(result).toMatch(/\d{2}:\d{2}/); // Time format
  });
});

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  it('handles multiple spaces', () => {
    expect(slugify('hello    world')).toBe('hello-world');
  });

  it('trims whitespace but preserves internal hyphens', () => {
    // slugify only trims whitespace, not hyphens
    expect(slugify('  hello world  ')).toBe('-hello-world-');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    // 'hello world' with length 8 -> 'hello wo' + '...' = 'hello wo...'
    expect(truncate('hello world', 8)).toBe('hello wo...');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('handles zero length', () => {
    expect(truncate('hello', 0)).toBe('...');
  });
});

describe('generateOrderNumber', () => {
  it('generates order number with SGD prefix', () => {
    const orderNum = generateOrderNumber();
    expect(orderNum).toMatch(/^SGD-[A-Z0-9]+-[A-Z0-9]{4}$/);
  });

  it('generates unique order numbers', () => {
    const nums = new Set();
    for (let i = 0; i < 100; i++) {
      nums.add(generateOrderNumber());
    }
    expect(nums.size).toBe(100);
  });
});

describe('cn (classnames utility)', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'not-included')).toBe('base conditional');
  });

  it('handles object syntax', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('handles arrays', () => {
    expect(cn(['a', 'b', 'c'])).toBe('a b c');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4'); // px-4 overrides px-2
  });
});
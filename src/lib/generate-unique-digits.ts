/**
 * Returns a uniformly distributed integer in the range [0, maxExclusive).
 * Implementations must be unbiased, otherwise the generator's uniformity
 * guarantee does not hold.
 */
export type RandomInt = (maxExclusive: number) => number;

export const DIGIT_COUNT = 6;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const UINT32_RANGE = 2 ** 32;

/**
 * Unbiased random integer backed by the Web Crypto API.
 *
 * A plain `value % max` would favour small numbers, because 2^32 is not a
 * multiple of 10, 9, 7 or 6. Values from the incomplete last bucket are
 * therefore rejected and drawn again (rejection sampling). With max <= 10
 * the chance of a retry is below 0.000001 %, so this practically never loops.
 */
export const cryptoRandomInt: RandomInt = (maxExclusive) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError(`maxExclusive must be an integer in [1, 2^32], got ${maxExclusive}`);
  }

  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  const buffer = new Uint32Array(1);

  for (;;) {
    globalThis.crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % maxExclusive;
  }
};

/**
 * Draws `count` distinct digits (0–9) in random order.
 *
 * Uses a partial Fisher–Yates shuffle: position i is swapped with a random
 * position from the not-yet-used rest of the pool. A digit that was placed
 * in front can never be drawn again, so uniqueness holds by construction,
 * with no retries and no "already used?" checks. Each of the
 * 10·9·8·7·6·5 = 151,200 ordered results is exactly one path of random
 * choices, so all of them are equally likely.
 */
export function generateUniqueDigits(
  count: number = DIGIT_COUNT,
  randomInt: RandomInt = cryptoRandomInt,
): number[] {
  if (!Number.isInteger(count) || count < 0 || count > DIGITS.length) {
    throw new RangeError(`count must be an integer between 0 and ${DIGITS.length}, got ${count}`);
  }

  const pool: number[] = [...DIGITS];

  for (let i = 0; i < count; i++) {
    const j = i + randomInt(pool.length - i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

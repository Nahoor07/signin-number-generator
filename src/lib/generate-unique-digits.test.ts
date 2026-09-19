import { describe, expect, it, vi } from "vitest";

import {
  cryptoRandomInt,
  DIGIT_COUNT,
  generateUniqueDigits,
  type RandomInt,
} from "./generate-unique-digits";

/** Feeds a fixed list of choices into the generator instead of real randomness. */
function scripted(choices: number[]): RandomInt {
  let call = 0;
  return (maxExclusive) => {
    const value = choices[call++];
    if (value === undefined || value < 0 || value >= maxExclusive) {
      throw new Error(`scripted choice ${value} out of range [0, ${maxExclusive})`);
    }
    return value;
  };
}

describe("generateUniqueDigits", () => {
  it("returns six digits by default", () => {
    expect(DIGIT_COUNT).toBe(6);
    expect(generateUniqueDigits()).toHaveLength(6);
  });

  it("only returns unique integers from 0 to 9 (10,000 runs)", () => {
    for (let run = 0; run < 10_000; run++) {
      const digits = generateUniqueDigits();

      expect(new Set(digits).size).toBe(6);
      for (const digit of digits) {
        expect(Number.isInteger(digit)).toBe(true);
        expect(digit).toBeGreaterThanOrEqual(0);
        expect(digit).toBeLessThanOrEqual(9);
      }
    }
  });

  it("asks for exactly one random number per digit, from a shrinking range", () => {
    const randomInt = vi.fn<RandomInt>(() => 0);

    generateUniqueDigits(6, randomInt);

    expect(randomInt.mock.calls.map(([max]) => max)).toEqual([10, 9, 8, 7, 6, 5]);
  });

  it("is deterministic for a given sequence of random choices", () => {
    expect(generateUniqueDigits(6, scripted([0, 0, 0, 0, 0, 0]))).toEqual([0, 1, 2, 3, 4, 5]);
    expect(generateUniqueDigits(6, scripted([9, 8, 7, 6, 5, 4]))).toEqual([9, 0, 1, 2, 3, 4]);
    expect(generateUniqueDigits(6, scripted([3, 0, 7, 1, 2, 4]))).toEqual([3, 1, 9, 4, 6, 2]);
  });

  it("maps every possible choice sequence to a different result (proof of uniformity)", () => {
    // Enumerate all 10·9·8·7·6·5 = 151,200 choice sequences. If each one yields
    // a distinct valid result, the mapping is a bijection onto all ordered
    // 6-digit selections, so every result has probability exactly 1 / 151,200.
    const results = new Set<string>();
    const choices = [0, 0, 0, 0, 0, 0];

    const enumerate = (position: number) => {
      if (position === DIGIT_COUNT) {
        const digits = generateUniqueDigits(DIGIT_COUNT, scripted(choices));
        expect(new Set(digits).size).toBe(DIGIT_COUNT);
        results.add(digits.join(""));
        return;
      }
      for (let choice = 0; choice < 10 - position; choice++) {
        choices[position] = choice;
        enumerate(position + 1);
      }
    };
    enumerate(0);

    expect(results.size).toBe(151_200);
  });

  it("spreads digits evenly over all positions (statistical smoke test)", () => {
    const runs = 60_000;
    const counts = Array.from({ length: DIGIT_COUNT }, () => new Array<number>(10).fill(0));

    for (let run = 0; run < runs; run++) {
      generateUniqueDigits().forEach((digit, position) => counts[position][digit]++);
    }

    // Expected 6,000 per cell. A ±10 % band is roughly 13 standard
    // deviations wide, so a correct implementation will not flake here,
    // while a biased one (e.g. sort(() => Math.random() - 0.5)) fails.
    for (const row of counts) {
      for (const count of row) {
        expect(count).toBeGreaterThan(5_400);
        expect(count).toBeLessThan(6_600);
      }
    }
  });

  it("supports other lengths and rejects impossible ones", () => {
    expect(generateUniqueDigits(0)).toEqual([]);
    expect([...generateUniqueDigits(10)].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(() => generateUniqueDigits(11)).toThrow(RangeError);
    expect(() => generateUniqueDigits(-1)).toThrow(RangeError);
    expect(() => generateUniqueDigits(2.5)).toThrow(RangeError);
  });
});

describe("cryptoRandomInt", () => {
  it("stays within [0, max)", () => {
    for (let max = 1; max <= 10; max++) {
      for (let run = 0; run < 1_000; run++) {
        const value = cryptoRandomInt(max);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(max);
      }
    }
  });

  it("rejects values from the incomplete last bucket to avoid modulo bias", () => {
    // 2^32 % 10 = 6, so 4294967290..4294967295 must be redrawn.
    const values = [4_294_967_295, 4_294_967_290, 42];
    const spy = vi
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
        (array as unknown as Uint32Array)[0] = values.shift()!;
        return array;
      });

    expect(cryptoRandomInt(10)).toBe(2);
    expect(spy).toHaveBeenCalledTimes(3);
    spy.mockRestore();
  });

  it("throws on invalid ranges", () => {
    expect(() => cryptoRandomInt(0)).toThrow(RangeError);
    expect(() => cryptoRandomInt(1.5)).toThrow(RangeError);
  });
});

import { describe, expect, test } from 'vitest';

import { compareVersions } from './compare-versions';

describe(`${compareVersions.name}()`, function () {
  test('組み合わせテスト', function () {
    const versions = [
      '1.0.0-alpha',
      '1.0.0-alpha.1',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-beta.11',
      '1.0.0-rc.1',
      '1.0.0',
      '1.0.1',
      '1.1.0',
      '2.0.0',
    ];

    for (let x = 0; x < versions.length; x++) {
      for (let y = 0; y < versions.length; y++) {
        const a = versions[x];
        const b = versions[y];
        const result = compareVersions(a, b);
        if (x === y) {
          expect(result, `${a} === ${b}`).toBe(0);
        } else if (x < y) {
          expect(result, `${a} < ${b}`).toBeLessThan(0);
        } else {
          expect(result, `${a} > ${b}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

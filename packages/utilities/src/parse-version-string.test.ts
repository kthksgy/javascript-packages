import { describe, expect, test } from 'vitest';

import { parseVersionString } from './parse-version-string';

describe(`${parseVersionString.name}()`, function () {
  test.each([
    ['1.0.0-alpha', { major: 1, minor: 0, patch: 0, prerelease: 'alpha' }],
    ['1.0.0-alpha.1', { major: 1, minor: 0, patch: 0, prerelease: 'alpha.1' }],
    ['1.0.0-alpha.beta', { major: 1, minor: 0, patch: 0, prerelease: 'alpha.beta' }],
    ['1.0.0-beta', { major: 1, minor: 0, patch: 0, prerelease: 'beta' }],
    ['1.0.0-beta.2', { major: 1, minor: 0, patch: 0, prerelease: 'beta.2' }],
    ['1.0.0-beta.11', { major: 1, minor: 0, patch: 0, prerelease: 'beta.11' }],
    ['1.0.0-rc.1', { major: 1, minor: 0, patch: 0, prerelease: 'rc.1' }],
    ['1.0.0', { major: 1, minor: 0, patch: 0 }],
    ['1.0.1', { major: 1, minor: 0, patch: 1 }],
    ['1.1.0', { major: 1, minor: 1, patch: 0 }],
    ['2.0.0', { major: 2, minor: 0, patch: 0 }],
  ])('[%#] %s', function (versionString, expected) {
    expect(parseVersionString(versionString)).toStrictEqual(expected);
  });
});

import { parseVersionString } from "./parse-version-string";
import { Version } from "./types";

/**
 * バージョンを比較する。`build`は無視される。
 * @param a バージョンA
 * @param b バージョンB
 * @returns
 * - `a`が`b`よりも古いバージョンの場合、`< 0`
 * - `a`と`b`が同じバージョンの場合、`=== 0`
 * - `a`が`b`よりも新しいバージョンの場合、`> 0`
 */
export function compareVersions(a: string | Version, b: string | Version) {
  if (typeof a === "string") {
    a = parseVersionString(a);
  }
  if (typeof b === "string") {
    b = parseVersionString(b);
  }
  return a.major !== b.major
    ? a.major - b.major
    : a.minor !== b.minor
      ? a.minor - b.minor
      : a.patch !== b.patch
        ? a.patch - b.patch
        : comparePrereleases(a.prerelease, b.prerelease);
}

function comparePrereleases(a: string | undefined, b: string | undefined) {
  if (a && b) {
    const aIdentifiers = a.split(".");
    const bIdentifiers = b.split(".");
    for (let i = 0; i < Math.max(aIdentifiers.length, bIdentifiers.length); i++) {
      const aIdentifier = aIdentifiers.at(i);
      const bIdentifier = bIdentifiers.at(i);
      if (aIdentifier === bIdentifier) {
        continue;
      } else if (aIdentifier && bIdentifier) {
        return /^(0|[1-9]\d*)$/.test(aIdentifier) && /^(0|[1-9]\d*)$/.test(bIdentifier)
          ? Number.parseInt(aIdentifier) - Number.parseInt(bIdentifier)
          : aIdentifier < bIdentifier
            ? -1
            : 1;
      } else if (aIdentifier) {
        return 1;
      } else if (bIdentifier) {
        return -1;
      }
    }
    return 0;
  } else if (a) {
    return -1;
  } else if (b) {
    return 1;
  } else {
    return 0;
  }
}

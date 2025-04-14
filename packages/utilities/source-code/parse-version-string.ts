/**
 * バージョン文字列をパースする。
 * @param versionString バージョン文字列
 * @returns バージョン
 *
 * @see https://semver.org/lang/ja/
 */
export function parseVersionString(versionString: string) {
  /**
   * Semantic Versioning 2.0.0の正規表現
   * @see https://semver.org
   * > #### Is there a suggested regular expression (RegEx) to check a SemVer string?
   * > There are two. ……
   */
  const re =
    /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  const groups = versionString.match(re)?.groups;
  if (groups) {
    return {
      major: Number.parseInt(groups.major),
      minor: Number.parseInt(groups.minor),
      patch: Number.parseInt(groups.patch),
      ...(groups.prerelease && { prerelease: groups.prerelease }),
      ...(groups.build && { build: groups.build }),
    };
  } else {
    throw new Error(`バージョン(${versionString})のパースに失敗しました。`);
  }
}

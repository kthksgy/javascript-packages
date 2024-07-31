/** バージョン */
export type Version = VersionObject | VersionString;

/**
 * バージョンオブジェクト
 * @see https://semver.org/lang/ja/
 */
export type VersionObject = {
  /** メジャー */
  major: number;
  /** マイナー */
  minor: number;
  /** パッチ */
  patch: number;
  /** プレリリース */
  prerelease?: string;
  /** ビルド */
  build?: string;
};

/**
 * バージョン文字列
 * @see https://semver.org/lang/ja/
 */
export type VersionString =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`
  | `${number}.${number}.${number}+${string}`
  | `${number}.${number}.${number}-${string}+${string}`;

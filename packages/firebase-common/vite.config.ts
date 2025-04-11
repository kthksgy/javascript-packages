import { existsSync, readFileSync, statSync } from "fs";
import * as path from "node:path";
import { resolve } from "path";

import { defineConfig } from "vite";
import { type UserConfig as ViteConfiguration } from "vite";
import { type UserConfig as VitestConfiguration } from "vitest/node";

export default defineConfig(function () {
  const SOURCE_CODE_DIRECTORY_NAME = "source-code";

  /** パッケージパラメーター */
  const packageParameters = loadPackageParameters(resolve(__dirname, "package.json"));

  /** 設定 */
  const configuration: ViteConfiguration & VitestConfiguration = {
    build: {
      lib: {
        entry: {
          firestore: path.resolve(
            import.meta.dirname,
            SOURCE_CODE_DIRECTORY_NAME,
            "firestore",
            "index.ts",
          ),
          index: path.resolve(import.meta.dirname, SOURCE_CODE_DIRECTORY_NAME, "index.ts"),
        },
        name: getPackageNameSpaceName(packageParameters.name),
      },
      minify: false,
      outDir: "lib",
      rollupOptions: {
        external: [
          ...(packageParameters?.peerDependencies
            ? Object.keys(packageParameters.peerDependencies)
            : []),
        ],
        output: {
          globals: {
            ...(packageParameters?.peerDependencies
              ? Object.fromEntries(
                  Object.keys(packageParameters.peerDependencies).map(function (key) {
                    return [key, getPackageNameSpaceName(key)];
                  }),
                )
              : {}),
          },
        },
      },
      sourcemap: true,
    },

    define: {
      /** バージョン(`package.json` `version`) */
      __version: "'" + process.env.npm_package_version + "'",
      // `if(import.meta.vitest) { ... }`を削除する。
      "import.meta.vitest": "undefined",
    },

    test: {
      includeSource: ["src/**/*.{js,ts}"],
    },
  };

  console.debug(JSON.stringify(configuration, null, 2));

  return configuration;
});

/**
 * パッケージ名前空間の名前を取得する。
 * @param packageIdentifier パッケージ識別子
 * @returns パッケージ名前空間の名前
 *
 * @version 1.0.0
 */
function getPackageNameSpaceName(packageIdentifier: string) {
  const groups = packageIdentifier.match(
    /^(?:@(?<scopeName>[-a-z]+)\/)?(?<packageName>[-a-z]+)$/,
  )?.groups;
  if (groups) {
    const { packageName, scopeName } = groups;
    return (scopeName ? upperCamelCase(scopeName) : "") + upperCamelCase(packageName);
  } else {
    throw new Error("パッケージ名が不正です。");
  }
}

/**
 * パッケージパラメーターを読み込む。
 * @param path `package.json`のパス
 * @returns パッケージパラメーター
 *
 * @version 1.0.0
 */
function loadPackageParameters(path: string) {
  if (existsSync(path) && statSync(path).isFile()) {
    const parameters: { name: string; peerDependencies?: Partial<Record<string, string>> } =
      JSON.parse(readFileSync(path, "utf8"));
    if (typeof parameters.name !== "string" || parameters.name.length === 0) {
      throw new Error("`name` is required.");
    }
    if (
      (typeof parameters.peerDependencies !== "object" || parameters.peerDependencies === null) &&
      parameters.peerDependencies !== undefined
    ) {
      throw new Error("`peerDependencies` is invalid.");
    }
    return parameters;
  } else {
    throw new Error(`\`${path}\` does not exist.`);
  }
}

/**
 * ケバブケースの文字列をアッパーキャメルケースの文字列に変換する。
 * @param kebabCase ケバブケースの文字列
 * @returns アッパーキャメルケースの文字列
 *
 * @version 1.0.0
 */
function upperCamelCase(kebabCase: string) {
  return kebabCase.replace(/(?:^|-+)(?<segment>[^-]+)/g, function (_, segment: string) {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  });
}

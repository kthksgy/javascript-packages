/**
 * @file ESLintの設定ファイル
 * @version 2.0.1
 *
 * @tutorial VSCodeで使用している場合、変更を行った後は必ず再起動する。
 * @tutorial VSCodeで使用している場合、`eslint.workingDirectories`を設定する。
 * ```json
 * {
 *   "eslint.workingDirectories": [{ "mode": "location" }]
 * }
 * ```
 */

import js from "@eslint/js";
import confusingBrowserGlobals from "confusing-browser-globals";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importPlugin from "eslint-plugin-import-x";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/*
```
# 必須のパッケージをインストールする。
# Yarnを使用する場合は`yarn add`にコマンドを変更する。
$ npm i -D \
  '@eslint/js@~9.18.0' \
  'confusing-browser-globals@~1.0.11' \
  'eslint-config-prettier@~10.0.1' \
  'eslint-import-resolver-typescript@~3.7.0' \
  'eslint-plugin-import-x@~4.6.1' \
  'eslint-plugin-prettier@~5.2.3' \
  'eslint-plugin-react@~7.37.4' \
  'eslint-plugin-react-hooks@~5.1.0' \
  'globals@~15.14.0' \
  'typescript-eslint@~8.21.0'
```
*/

const ERROR = 2;
const OFF = 0;
const WARN = 1;

export default tseslint.config(
  { files: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"] },
  { languageOptions: { ecmaVersion: 2024, globals: { ...globals.browser, ...globals.node } } },
  { ignores: ["**/{build,coverage,dist,lib,styled-system}/**/*.{cjs,js,mjs,ts}"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  react.configs.flat.recommended,

  /** TypeScriptの基本設定 */
  {
    files: ["**/*.{cts,mts,ts,tsx}"],
    settings: {
      "import/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          // `packages`内の`tsconfig.json`を指定する。
          project: ["tsconfig.json", "packages/*/tsconfig.json"],
        }),
      ],
    },
  },
  /** Reactの基本設定 */
  {
    files: ["**/*.{jsx,tsx}"],
    // TODO: React HooksのプラグインがFlat Configsに対応したら`plugins`と`rules`を変更する。
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
    settings: { react: { version: "detect" } },
  },

  {
    rules: {
      /** 必要な場合、配列のコールバック関数の`return`を書く。 */
      "array-callback-return": WARN,
      /** `switch`文で`default`節を記述する。 */
      "default-case": WARN,
      /** プロパティ参照時のドットの位置を規定する。 */
      "dot-location": [WARN, "property"],
      /** 厳密等価演算子を使用する。 */
      eqeqeq: [ERROR, "smart"],
      /** 引数無しのコンストラクタにも空の括弧を挿入する。 */
      "new-parens": ERROR,
      /** 配列要素を引数にした配列のコンストラクタ(`new Array(a, b, c)`)は使わない。 */
      "no-array-constructor": WARN,
      /** `arguments.caller`と`arguments.callee`を使用しない。 */
      "no-caller": ERROR,
      /** 同じファイルからのインポートをまとめる。 */
      "no-duplicate-imports": OFF, // `import-x/no-duplicates`を使用する。
      /** `eval()`を使用しない。 */
      "no-eval": ERROR,
      /** ビルトインやネイティブのオブジェクトを拡張しない。 */
      "no-extend-native": ERROR,
      /** 冗長な`bind()`を使用しない。 */
      "no-extra-bind": WARN,
      /** 冗長なラベルを使用しない。 */
      "no-extra-label": WARN,
      /** 特定の関数で可能な`eval()`ライクな処理をしない。 */
      "no-implied-eval": ERROR,
      /** `__iterator__`プロパティを使用しない。 */
      "no-iterator": ERROR,
      /** 変数とラベルで同じ名前を使用しない。 */
      "no-label-var": ERROR,
      /** 冗長なブロックを作成しない。 */
      "no-lone-blocks": WARN,
      /** ループ内で安全でない参照を持つ関数を作成しない。 */
      "no-loop-func": ERROR,
      /** 複雑な数式には括弧を付けて優先順位を明確にする。 */
      "no-mixed-operators": WARN,
      /** 複数行の文字列リテラルを使用しない。 */
      "no-multi-str": ERROR,
      /** `Function`クラスに対して`new`演算子を使用しない。 */
      "no-new-func": ERROR,
      /** `Object`クラスのコンストラクタを使用しない。 */
      "no-new-object": ERROR,
      /** `String`クラス／`Number`クラス／`Boolean`クラスに対して`new`演算子を使用しない。 */
      "no-new-wrappers": ERROR,
      /** 文字列リテラル内で8進エスケープシーケンスを使用しない。 */
      "no-octal-escape": ERROR,
      /** `__proto__`プロパティを使用しない。 */
      "no-proto": ERROR,
      /** 非推奨のグローバル変数を規定する。 */
      "no-restricted-globals": [ERROR, ...confusingBrowserGlobals],
      /** `javascript:`URLを使用しない。 */
      "no-script-url": ERROR,
      /** 同じ変数同士を比較しない。 */
      "no-self-compare": ERROR,
      /** カンマ演算子を使用しない。 */
      "no-sequences": ERROR,
      /** テンプレートリテラル内ではなく文字列リテラル内で`${x}`構文を使用しない。 */
      "no-template-curly-in-string": WARN,
      /** 例外としてリテラルをスローしない。 */
      "no-throw-literal": ERROR,
      /** 1度しか実行されないループを使用しない。 */
      "no-unreachable-loop": ERROR,
      /** プログラムの状態に影響を与えない未使用の式を禁止する。 */
      "no-unused-expressions": [
        ERROR,
        {
          /** 短絡評価は許可する。 */
          allowShortCircuit: true,
          /** 三項演算子は許可する。 */
          allowTernary: true,
          /** タグ付きテンプレートリテラルは許可する。 */
          allowTaggedTemplates: true,
        },
      ],
      /** 未使用の変数を禁止する。 */
      "no-unused-vars": [
        WARN,
        {
          /** 関数の引数の設定。 */
          args: "none",
          /** `catch`の`error`に対する設定。 */
          caughtErrors: "none",
          /** スプレッド構文を用いたプロパティ省略のための定義は無視する。 */
          ignoreRestSiblings: true,
        },
      ],
      /** 冗長な計算プロパティ名を禁止する。 */
      "no-useless-computed-key": WARN,
      /** 冗長なリテラルの連結を禁止する。 */
      "no-useless-concat": WARN,
      /** 空のコンストラクタを禁止する。 */
      "no-useless-constructor": WARN,
      /** 同じ名前へのリネームを禁止する。 */
      "no-useless-rename": WARN,
      /** プロパティの前にスペースを挿入しない。 */
      "no-whitespace-before-property": WARN,
      /** スプレッド構文の`...`と変数名の間にスペースを挿入する。 */
      "rest-spread-spacing": [WARN, "never"],
      /** インポートの順番を規定する。 */
      "sort-imports": [
        WARN,
        {
          /** デフォルトインポートをソートしない。 */
          ignoreDeclarationSort: true,
          /** 連続するインポート行の順番のみ考慮する。 */
          allowSeparatedGroups: true,
        },
      ],
      /** 厳格モード構文(`"use strict";`)を挿入する。 */
      strict: [WARN, "never"],
      /** Unicode Byte Order Markを挿入する。 */
      "unicode-bom": [WARN, "never"],
    },
  },

  {
    rules: {
      /** デフォルトエクスポートが存在しないファイルからデフォルトインポートしない。 */
      "import-x/default": OFF,
      /** ファイル先頭以外でインポートしない。 */
      "import-x/first": WARN,
      /** インポートの後に空行を挿入する。 */
      "import-x/newline-after-import": [WARN, { count: 1 }],
      /** AMDの`require()`と`define()`を禁止する。 */
      "import-x/no-amd": ERROR,
      /** 循環インポートを禁止する。 */
      "import-x/no-cycle": OFF, // NOTE: 処理に時間が掛かるので無効化する。
      /** 名前付きエクスポートされた名前と同じ名前でデフォルトエクスポートのプロパティを参照しない。 */
      "import-x/no-named-as-default-member": OFF,
      /** 自己インポートを禁止する。 */
      "import-x/no-self-import": ERROR,
      /** 不要なパスセグメントを省く。 */
      "import-x/no-useless-path-segments": WARN,
      /** webpackのローダー構文を禁止する。 */
      "import-x/no-webpack-loader-syntax": ERROR,
      /** インポートの順番を規定する。 */
      "import-x/order": [
        WARN,
        {
          alphabetize: {
            /** ソート順。 */
            order: "asc",
            /** 大文字と小文字を区別しない。 */
            caseInsensitive: false,
          },
          groups: [
            /**
             * Node.jsビルトインインポート
             * @example `import fs from 'fs';`
             */
            "builtin",
            /**
             * 外部インポート
             * @example `import _ from 'lodash';`
             * @example `import chalk from 'chalk';`
             */
            "external",
            /**
             * 内部インポート
             * @example `import { a } from 'local/internal';`
             */
            "internal",
            /**
             * 相対インポート(親)
             * @example `import { a } from '../parent';`
             */
            "parent",
            /**
             * 相対インポート(兄弟)
             * @example `import { a } from './sibling';`
             */
            "sibling",
            /**
             * インデックスインポート
             * @example `import { a } from './';`
             */
            "index",
            /**
             * オブジェクトインポート
             * @example `import log = console.log;`
             */
            "object",
            /**
             * 型インポート
             * @example `import type { Type } from 'types';`
             */
            "type",
            /**
             * 不明なインポート
             */
            "unknown",
          ],
          /** グループ間の改行。 */
          "newlines-between": "always",
          pathGroups: [{ pattern: "~/**", group: "internal", position: "before" }],
        },
      ],
    },
  },

  {
    files: ["**/*.{cts,mts,ts,tsx}"],

    rules: {
      /** @description `tsconfig.json`の`noFallthroughCasesInSwitch`を利用する。 */
      "default-case": OFF,
      /** @description `@typescript-eslint/no-unused-vars`を代わりに利用する。 */
      "no-unused-vars": OFF,

      /** 空の関数を作成しない。 */
      "@typescript-eslint/no-empty-function": OFF,
      /** `any`型を明示的に使用しない。 */
      "@typescript-eslint/no-explicit-any": OFF,
      /** 値から推論可能な型を宣言しない。 */
      "@typescript-eslint/no-inferrable-types": OFF,
      /** `namespace`の宣言をしない。 */
      "@typescript-eslint/no-namespace": OFF,
      /** `require()`を使用しない。 */
      "@typescript-eslint/no-require-imports": OFF,
      /** 未使用の変数を禁止する。 */
      "@typescript-eslint/no-unused-vars": [
        WARN,
        {
          /** 関数の引数の設定。 */
          args: "none",
          /** `catch`の`error`に対する設定。 */
          caughtErrors: "none",
          /** スプレッド構文を用いたプロパティ省略のための定義は無視する。 */
          ignoreRestSiblings: true,
        },
      ],

      /** 名前付きのインポートとエクスポートの対応を確認する。 */
      "import-x/named": OFF, // TypeScriptが行う。
      /** 解決できないインポートをしない。 */
      "import-x/no-unresolved": OFF, // TypeScriptが行う。

      /** PropTypesを用いてReactコンポーネントプロパティの型を設定する。 */
      "react/prop-types": OFF,
    },
  },

  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      /** 他のコンポーネントの`propTypes`プロパティを参照しない。 */
      "react/forbid-foreign-prop-types": [WARN, { allowInPropTypes: true }],
      /** `boolean`型の属性をJSXで指定する場合、`={true}`を省略する。 */
      "react/jsx-boolean-value": WARN,
      /** コンポーネント名は`PascalCase`で命名する。 */
      "react/jsx-pascal-case": [WARN, { allowAllCaps: true }],
      /** `import React from 'react';`を要する。 */
      "react/react-in-jsx-scope": OFF,
      /** コンポーネントプロパティの順番を規定する。 */
      "react/jsx-sort-props": WARN,
      /** コンポーネントの`style`プロパティをオブジェクトで指定する。 */
      "react/style-prop-object": WARN,
    },
    settings: { react: { version: "detect" } },
  },

  prettier,
);

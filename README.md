# Node.jsパッケージ

## Visual Studio Codeの拡張機能がpnpmでインストールしたESLintおよびPrettierを利用できない件について (2025/04/12)

`.npmrc`ファイルを作成し、次の内容を記載すると解決します。

```plaintext
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

- [Remove the default option `*eslint*` and `*prettier*` from `public-hoist-pattern` option in next major version #8378](https://github.com/pnpm/pnpm/issues/8378)

## ビルドする

```bash
$ npm -w ./packages/[PACKAGE] run clean
$ npm -w ./packages/[PACKAGE] run build
```

## パブリッシュする

```bash
$ npm -w ./packages/[PACKAGE] publish
```

### 初回のみ公開範囲を指定する必要がある

`@kthksgy/common`のようにスコープ付きでパブリッシュする場合、既定ではプライベートリポジトリとして扱われるため、`--access public`を明示的に指定する必要がある。

```bash
$ npm -w ./packages/[PACKAGE] publish --access public
```

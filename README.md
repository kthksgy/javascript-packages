# Node.jsパッケージ

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

# 開発フロー

**すべてのパッケージ管理とスクリプト実行コマンドには、`npm`、`npx`、`yarn`の代わりに常に`bun`と`bunx`を使用すること。**

# 1.変更を加える

bun run ui:add <ComponentName> # shadcnのコンポーネントをコードベースに追加

# 2.型チェック

bun run typecheck

# 3.テスト実行

bun run test

# 4.コミット前

bun run lint

# 5.PR作成前

bun run lint && bun run test

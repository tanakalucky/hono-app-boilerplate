# 開発フロー

**常にbunを使用すること**

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

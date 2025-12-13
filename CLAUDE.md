# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドラインを提供します。

## 言語設定

Claude Codeはこのリポジトリで作業する際、**日本語で回答**してください。

## 開発コマンド

基本的なコマンドは `package.json` を参照してください。以下は非自明なコマンドの説明です：

```bash
# 型チェックとビルド検証（bunx tsgoによる先行型チェック）
bun run check

# Cloudflare Worker型の再生成
bun run cf-typegen
```

## 型チェック戦略

複数のtsconfig.jsonで異なるコンテキストを管理：
- `tsconfig.app.json` - React用（ES2020、React JSX）
- `tsconfig.worker.json` - Worker用（Cloudflare環境）
- `tsconfig.node.json` - Vite設定用

ビルド前に `tsgo` が全プロジェクトの型チェックを実行します。

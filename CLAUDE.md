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

## 利用可能なMCPサーバー

このプロジェクトでは以下のMCPサーバーを利用しています（`.mcp.json`に設定）：

### context7

ライブラリドキュメントの取得用MCPサーバー。

- **パッケージ**: `@upstash/context7-mcp`
- **用途**: 最新のライブラリドキュメントとコード例を取得
- **使い方**: ライブラリ名からContext7互換のIDを解決し、APIリファレンスや概念的なガイドを取得

### serena

セマンティックなコード編集とナビゲーション用MCPサーバー。

- **リポジトリ**: `oraios/serena`
- **用途**: シンボルベースのコード検索・編集
- **主な機能**:
  - シンボル検索（クラス、関数、メソッドなど）
  - 参照検索（どこで使われているかを調査）
  - セマンティックな編集（シンボル単位での置換・挿入）
  - ファイル・パターン検索
  
**重要**: コンテキスト使用量の最適化のため、標準的な `Edit`/`Read`/`Glob`/`Grep`/`Write` ツールは無効化されています。代わりにSerenaのセマンティックツールを使用してください。

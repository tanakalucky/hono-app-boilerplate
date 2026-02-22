# Hono App Boilerplate

React + Hono + Cloudflare Workers のフルスタックアプリケーションボイラープレート。

## 技術スタック

### フロントエンド

- [React](https://react.dev/) 19 - UI ライブラリ
- [Tailwind CSS](https://tailwindcss.com/) v4 - ユーティリティファースト CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI コンポーネント
- [TanStack Query](https://tanstack.com/query) - データフェッチング
- [wouter](https://github.com/molefrog/wouter) - ルーティング
- [ts-pattern](https://github.com/gvergnaud/ts-pattern) - パターンマッチング

### バックエンド

- [Hono](https://hono.dev/) - Web フレームワーク
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - エッジランタイム

### 開発ツール

- [Bun](https://bun.sh/) - パッケージマネージャー / スクリプトランナー
- [Vite](https://vite.dev/) 8 - ビルドツール
- [TypeScript](https://www.typescriptlang.org/) 5.9 + [tsgo](https://github.com/nicolo-ribaudo/tsgo) - 型チェック
- [Vitest](https://vitest.dev/) - テストフレームワーク（Unit + Browser Mode）
- [Playwright](https://playwright.dev/) - ブラウザテスト
- [oxlint](https://oxc.rs/docs/guide/usage/linter) - リンター
- [oxfmt](https://oxc.rs/docs/guide/usage/formatter) - フォーマッター
- [Lefthook](https://github.com/evilmartians/lefthook) - Git hooks

## プロジェクト構成

```
src/
├── react-app/          # フロントエンド
│   ├── app/            # アプリケーション設定・プロバイダー
│   │   ├── providers/  # ErrorBoundary など
│   │   └── styles/     # グローバル CSS
│   ├── pages/          # ページコンポーネント
│   │   └── home/
│   └── shared/         # 共有モジュール
│       ├── ui/         # shadcn/ui コンポーネント
│       ├── lib/        # ユーティリティ関数
│       └── assets/     # 静的アセット
└── worker/             # バックエンド（Hono API）
    ├── index.ts        # API ルート定義
    └── env.ts          # 環境変数の型定義
```

## セットアップ

```bash
# 依存関係のインストール
bun install

# 環境変数の設定
cp .env.example .env.local
```

## 開発

```bash
# 開発サーバーの起動
bun run dev
```

http://localhost:5173 でアクセスできます。

## スクリプト一覧

| コマンド                | 説明                           |
| ----------------------- | ------------------------------ |
| `bun run dev`           | 開発サーバーの起動             |
| `bun run build`         | プロダクションビルド           |
| `bun run preview`       | ビルド結果のプレビュー         |
| `bun run typecheck`     | 型チェック（tsgo）             |
| `bun run test`          | テスト実行（Unit + Browser）   |
| `bun run lint`          | リント + 自動修正              |
| `bun run format`        | コードフォーマット             |
| `bun run deploy`        | Cloudflare Workers へデプロイ  |
| `bun run ui:add <name>` | shadcn/ui コンポーネントの追加 |

## テスト

Vitest の [Project](https://vitest.dev/guide/workspace) 機能を使い、2種類のテストを実行します。

- **Unit テスト** (`*.unit.test.{ts,tsx}`) - Node.js 環境で実行
- **Browser テスト** (`*.browser.test.{ts,tsx}`) - Playwright (Chromium) で実行

```bash
bun run test
```

## デプロイ

```bash
bun run build && bun run deploy
```

# プロジェクト背景とコンテキスト

## プロジェクト概要
Cloudflare Workers上で動作するフルスタックReactアプリケーション

## 技術スタック
- **フロントエンド**: React 19 + Vite
- **バックエンド**: Hono.js（Cloudflare Workers）
- **ルーティング**: Wouter（クライアントサイド）
- **状態管理**: TanStack Query（サーバー状態）
- **スタイリング**: Tailwind CSS v4 + shadcn/ui（New Yorkスタイル）

## アーキテクチャの制約
- Cloudflare Workersの制約に従う必要がある
- エッジコンピューティング環境での最適化が必要
- SPAとWorkerの両方で動作する構成

## デプロイメント環境
- 本番環境: Cloudflare Workers
- 開発環境: Vite開発サーバー + Worker
- ビルド: Viteによる静的アセット生成

## 重要な設定
- Node.js互換性有効
- 互換性日付: 2025-04-01
- アセット配信: `/dist/client`からSPAルーティング
- APIルート: `/api/*`でHonoが処理
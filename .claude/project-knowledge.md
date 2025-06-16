# プロジェクト技術知識とパターン

## アーキテクチャ決定

### フロントエンド
- **React 19**: 最新機能とパフォーマンス向上
- **Vite**: 高速ビルドとHMR
- **Wouter**: 軽量なクライアントサイドルーティング
- **TanStack Query**: サーバー状態管理とキャッシング

### バックエンド
- **Hono.js**: 軽量で高速なWebフレームワーク
- **Cloudflare Workers**: エッジコンピューティング環境

### スタイリング
- **Tailwind CSS v4**: 最新のCSS変数サポート
- **shadcn/ui**: New Yorkスタイルで統一
- **パスエイリアス**: `@/`で`src/`にマップ

## 実装パターン

### ディレクトリ構造
```
src/
├── react-app/       # Reactアプリケーション
├── worker/          # Honoバックエンド
├── components/ui/   # shadcn/uiコンポーネント
└── lib/            # 共有ユーティリティ
```

### 開発フロー
1. `npm run dev` - フロントエンド＋ワーカー開発サーバー
2. `npm run check` - TypeScript型チェック
3. `npm run biome-check` - コード品質チェック
4. `npm run build` - 本番ビルド
5. `npm run deploy` - Cloudflare Workersデプロイ

### 型安全性
- 複数のtsconfig.jsonで環境別設定
- Cloudflare Worker型生成(`npm run cf-typegen`)
- 厳密なTypeScript設定

## ベストプラクティス

### コード品質
- Biomeによる統一されたフォーマット
- lefthookによるプリコミットフック
- 自動修正可能なリンティングルール

### パフォーマンス
- エッジでの高速応答
- 静的アセットの効率的な配信
- SPA最適化
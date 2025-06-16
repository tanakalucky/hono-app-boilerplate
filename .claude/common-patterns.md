# よく使用するパターンとコマンド

## 開発コマンド

### 基本開発フロー
```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run check

# コード品質チェック
npm run biome-check

# ビルド
npm run build

# プレビュー
npm run preview

# デプロイ
npm run deploy
```

### トラブルシューティング
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# Cloudflare Worker型生成
npm run cf-typegen

# 全体クリーンビルド
npm run build
```

## コードパターン

### React コンポーネント
```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="default">Click me</Button>
    </div>
  )
}
```

### Hono API ルート
```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello World' })
})

export default app
```

### TanStack Query
```tsx
import { useQuery } from '@tanstack/react-query'

function useApiData() {
  return useQuery({
    queryKey: ['api-data'],
    queryFn: async () => {
      const response = await fetch('/api/data')
      return response.json()
    }
  })
}
```

## ファイル構造パターン

### コンポーネント作成
```
src/components/
├── ui/              # shadcn/uiコンポーネント
│   ├── button.tsx
│   └── ...
├── feature/         # 機能別コンポーネント
│   ├── Header.tsx
│   └── ...
└── common/          # 共通コンポーネント
    ├── Layout.tsx
    └── ...
```

### API ルート構造
```
src/worker/
├── index.ts         # メインエントリポイント
├── routes/          # ルート定義
│   ├── api.ts
│   └── ...
└── utils/           # ユーティリティ
    ├── response.ts
    └── ...
```

## 設定パターン

### TypeScript設定
- `tsconfig.json`: ベース設定
- `tsconfig.app.json`: React app用
- `tsconfig.worker.json`: Worker用
- `tsconfig.node.json`: Node.js用

### Tailwind CSS
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* CSS変数でテーマ設定 */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
}
```

## デバッグパターン

### 開発時ログ
```ts
// Worker側
console.log('Worker:', data)

// React側
console.log('Client:', data)
```

### エラーハンドリング
```ts
try {
  // API処理
} catch (error) {
  console.error('API Error:', error)
  return c.json({ error: 'Internal Error' }, 500)
}
```
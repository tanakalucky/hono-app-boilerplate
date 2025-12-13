# TypeScript コーディング規約

このドキュメントは、プロジェクトの TypeScript コーディング規約を定義します。ツールで自動化できることは含めず、開発者が判断・実践すべき原則に焦点を当てています。

## 命名規約

- **変数/関数**: `camelCase`
- **型/インターフェース/クラス**: `PascalCase`
- **定数**: `UPPER_SNAKE_CASE`
- **ファイル名**: プロジェクトの慣習に従う（例: React コンポーネントは `PascalCase.tsx`）

**理由**: TypeScript/JavaScript コミュニティの標準的な慣習に従う。IDE の補完やリファクタリングツールとの相性が良く、チーム間での一貫性が保たれる。

## Export ルール

### 全て named export を使用 (default export 禁止)

```typescript
export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  // ...
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  // ...
}
```

**理由**:
- IDE の自動補完が正確に機能する
- リファクタリング時の安全性が高い（リネーム追跡が容易）
- import 時の名前の一貫性が保たれる（開発者ごとに異なる名前を付けることを防ぐ）
- tree-shaking がより効果的に機能する

## Type vs Interface

### オブジェクト型の定義: `interface` を優先

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

### Union Types / Intersection Types: `type` を使用

```typescript
type Size = "sm" | "md" | "lg";
type Status = "idle" | "loading" | "success" | "error";

type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### プリミティブ型のエイリアス: `type` を使用

```typescript
type UserId = string;
type Timestamp = number;
type Percentage = number;
```

**理由**: それぞれの特性に合った使い分けをする。`interface` は拡張性（declaration merging、extends による継承）に優れ、`type` は表現力（Union Types、Intersection Types、Mapped Types など）に優れている。

## 禁止事項

### 1. `any` の使用禁止

`any` の使用は原則禁止。やむを得ない場合は `unknown` を経由して型ガードを実装すること。

```typescript
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error", error);
  }
}

function parseJson(json: string): unknown {
  return JSON.parse(json);
}
```

**理由**: `any` は型安全性を完全に破壊する。`unknown` なら型ガードを強制でき、型安全性を保ちながら柔軟性を確保できる。

### 2. `enum` の使用禁止 (Union Types を使用)

`enum` の代わりに Union Types または `as const` を使用すること。

```typescript
// Union Types
type Size = "sm" | "md" | "lg";

interface ComponentProps {
  size?: Size;
}

// または as const（値と型の両方が必要な場合）
const SIZES = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

type Size = typeof SIZES[keyof typeof SIZES];
```

**理由**: 
- `enum` はランタイムコードを生成し、bundle サイズが増える
- tree-shaking を阻害する
- Union Types で同等の型安全性を確保できる
- `as const` を使えばランタイムオブジェクトと型の両方を得られる

### 3. magic number の使用禁止

数値や文字列のリテラルは定数化すること。

```typescript
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const API_BASE_URL = "https://api.example.com";

async function fetchWithRetry(url: string) {
  for (let i = 0; i < MAX_RETRY_COUNT; i++) {
    try {
      const response = await fetch(url, { 
        timeout: DEFAULT_TIMEOUT_MS 
      });
      return response;
    } catch (error) {
      if (i === MAX_RETRY_COUNT - 1) throw error;
    }
  }
}
```

**理由**: コードの可読性と保守性を向上させる。変更が必要な場合、一箇所の修正で済む。定数名が値の意味を明確にする。

## まとめ

このコーディング規約は以下の原則に基づいています：

1. **型安全性の最大化**: `any` を避け、適切な型定義を行う
2. **一貫性の確保**: 命名規則とエクスポートルールを統一
3. **保守性の向上**: magic number を避け、理由を明確にする
4. **ツールとの協調**: IDE やリファクタリングツールが効果的に機能するパターンを採用
5. **最小限の規約**: 自動化できることは規約に含めず、人間が判断すべきことに焦点を当てる

コードレビューで主観的判断が必要な事項はこのドキュメントに含めません。リンターやフォーマッターで自動化できることはツールに任せます。

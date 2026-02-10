---
name: writing-typescript
description: TypeScriptコードの記述・レビュー・リファクタリング時に、プロジェクト固有のコーディング規約を適用する。関数定義スタイル、型安全性の禁止パターン（any, enum, as, !, @ts-ignore, magic number）、命名規約、export規則、readonly活用、Discriminated Unionパターン、コメント・例外処理の方針を含む。
---

# TypeScript コーディング規約

ツールで自動化できることは含めず、開発者が判断・実践すべき原則に焦点を当てる。

## ルールサマリー

| ルール                               | 強制力 | 代替手段                                         |
| ------------------------------------ | ------ | ------------------------------------------------ |
| `const` + アロー関数で関数定義       | 必須   | `.tsx`のジェネリクスは `<T,>` で回避             |
| `any` 禁止                           | 必須   | `unknown` + 型ガード                             |
| `enum` 禁止                          | 必須   | Union Types / `as const`                         |
| `as` 型アサーション禁止              | 必須   | `satisfies` / 型ガード（`as const` は許容）      |
| 非nullアサーション `!` 禁止          | 必須   | `?.` / `??` / narrowing                          |
| `@ts-ignore` 禁止                    | 必須   | `@ts-expect-error` + 理由コメント                |
| magic number 禁止                    | 必須   | 名前付き定数                                     |
| named export のみ                    | 必須   | フレームワーク要件の場合のみ default export 許容 |
| interface でオブジェクト型定義       | 推奨   | Union/Intersection/エイリアスは `type`           |
| 関数引数に `readonly` 付与           | 推奨   | ―                                                |
| Discriminated Union + 網羅性チェック | 推奨   | ―                                                |
| コメントは「なぜ」のみ               | 推奨   | ―                                                |

## 必須ルール

### 関数定義スタイル

`function` 宣言ではなく `const` + アロー関数を使用する。

```typescript
// ✅
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

`.tsx` ファイル内でジェネリクスがJSXと曖昧になる場合は、`<T,>` で回避する。

```typescript
// ✅ .tsx 内のジェネリクス: カンマで曖昧さを回避
export const identity = <T>(value: T): T => value;
```

### `any` 禁止

`unknown` + 型ガードで代替する。

### `enum` 禁止 → Union Types / `as const`

```typescript
// ✅ Union Types
type Status = "idle" | "loading" | "success" | "error";

// ✅ as const（値と型の両方が必要な場合）
const SIZES = { SM: "sm", MD: "md", LG: "lg" } as const;
type Size = (typeof SIZES)[keyof typeof SIZES];
```

### `as` 型アサーション禁止 → `satisfies` / 型ガード

`as const` のみ許容。それ以外の `as` は禁止。

```typescript
// ✅ satisfies
const config = { port: 3000, host: "localhost" } satisfies ServerConfig;

// ✅ 型ガード
const isUser = (value: unknown): value is User => {
  return typeof value === "object" && value !== null && "id" in value;
};

// ✅ as const は許容
const ROLES = ["admin", "editor", "viewer"] as const;
```

### 非nullアサーション `!` 禁止

`?.` / `??` / narrowing で代替する。

### `@ts-ignore` 禁止

`@ts-expect-error` + 理由コメントで代替する。

### magic number 禁止

名前付き定数（`UPPER_SNAKE_CASE`）で置き換える。

### Export ルール

named export のみ使用。default export は禁止。

フレームワーク（Next.js の page/layout 等）が要求する場合のみ default export を許容する。その場合も const で定義した上で export する。

```typescript
// ✅ named export
export const UserCard = ({ name }: UserCardProps) => { ... };

// ✅ フレームワーク要件による例外
const Page = () => { return <div>...</div>; };
export default Page;
```

## 推奨パターン

### 命名規約

| 対象       | スタイル                                                          |
| ---------- | ----------------------------------------------------------------- |
| ファイル名 | プロジェクト慣習に従う（React コンポーネントは `PascalCase.tsx`） |

### Type vs Interface

| 用途                       | 使用                                    |
| -------------------------- | --------------------------------------- |
| オブジェクト型の定義       | `interface`（拡張性・extends に優れる） |
| Union / Intersection Types | `type`                                  |
| プリミティブ型エイリアス   | `type`                                  |

```typescript
interface User {
  id: string;
  name: string;
} // オブジェクト型
type Status = "idle" | "loading" | "success"; // Union
type UserId = string; // エイリアス
```

### `readonly` の活用

関数が引数を変更しない場合、`readonly` で不変性を明示する。

```typescript
const calculateAverage = (values: readonly number[]): number => {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

const formatUser = (user: Readonly<User>): string => {
  return `${user.name} <${user.email}>`;
};
```

### Discriminated Union と網羅性チェック

複数の状態を持つデータは Discriminated Union で定義し、`never` で網羅性を保証する。

```typescript
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

const handleState = <T>(state: AsyncState<T>): string => {
  switch (state.status) {
    case "idle":
      return "待機中";
    case "loading":
      return "読み込み中";
    case "success":
      return JSON.stringify(state.data);
    case "error":
      return state.error.message;
    default:
      return assertNever(state);
  }
};
```

## コメント・例外処理

### コメント規約

コメントは「なぜ」のみ記載し、「何を」は書かない。ADR に記録済みの決定はコード内で繰り返さない。

```typescript
// ✅ セキュリティ要件: 短時間での使用を強制し、漏洩リスクを軽減
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// ❌ トークンの有効期限を1時間に設定
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
```

### 例外処理

外部API・ファイルI/O・DB操作・JSONパース等、例外が発生しうる箇所では try-catch を使用する。
catch節では `error: unknown` として型ガードを行う。

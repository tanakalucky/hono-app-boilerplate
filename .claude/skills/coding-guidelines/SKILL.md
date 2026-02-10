---
name: coding-guidelines
description: TypeScriptコーディング規約。命名規約、export/import、型定義の使い分け、関数定義スタイル、禁止事項（any、enum、as、!、@ts-ignore、magic number）、readonly活用、Discriminated Union、コメント規約、例外処理などを定義。TypeScriptコードを書く際、レビューする際、リファクタリングする際に使用。
---

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
export const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  // ...
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  // ...
};
```

### 例外: フレームワークが default export を要求する場合

Next.js の page/layout/route 等、フレームワークの仕様上 default export が必須な場合のみ許容する。その場合もnamed functionではなく、constで定義した上でexportする。

```typescript
// Next.js page（フレームワーク要件による例外）
const Page = () => {
  return <div>...</div>;
};

export default Page;
```

**理由**:

- IDE の自動補完が正確に機能する
- リファクタリング時の安全性が高い（リネーム追跡が容易）
- import 時の名前の一貫性が保たれる（開発者ごとに異なる名前を付けることを防ぐ）
- tree-shaking がより効果的に機能する

## 関数定義スタイル

### `const` + アロー関数を標準にする

関数の定義には `function` 宣言ではなく、`const` + アロー関数を使用する。

```typescript
// ✅ Good: const + アロー関数
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// ✅ Good: Reactコンポーネントも同様
export const UserCard = ({ name, email }: UserCardProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

// ❌ Bad: function 宣言
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 例外: ジェネリクスでJSXと曖昧になる場合

`.tsx` ファイル内でジェネリクスを使用する場合、パーサーがJSXタグと混同するため `function` 宣言を許容する。

```typescript
// .tsx ファイル内でのジェネリクス: function宣言を許容
export function identity<T>(value: T): T {
  return value;
}
```

**理由**:

- `const` は再代入を防ぎ、関数が意図せず上書きされるリスクを排除する
- hoisting が発生しないため、コードの実行順序が宣言順と一致し、可読性が向上する
- プロジェクト全体で関数定義のスタイルが統一される
- アロー関数は `this` を束縛しないため、意図しない `this` の参照を防ぐ

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

type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; error: Error };
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
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error", error);
  }
};

const parseJson = (json: string): unknown => {
  return JSON.parse(json);
};
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

type Size = (typeof SIZES)[keyof typeof SIZES];
```

**理由**:

- `enum` はランタイムコードを生成し、bundle サイズが増える
- tree-shaking を阻害する
- Union Types で同等の型安全性を確保できる
- `as const` を使えばランタイムオブジェクトと型の両方を得られる

### 3. `as` 型アサーションの使用制限

`as` による型アサーションは原則禁止。型ガード、`satisfies`、ジェネリクスで代替すること。

```typescript
// ✅ Good: satisfies で型チェック
const config = {
  port: 3000,
  host: "localhost",
} satisfies ServerConfig;

// ✅ Good: 型ガードで安全に絞り込み
const isUser = (value: unknown): value is User => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
};

// ❌ Bad: as で型を強制
const user = data as User;

// ❌ Bad: as で無理やり型を変換
const id = someValue as unknown as string;
```

### 唯一の許容ケース: `as const`

`as const` はリテラル型の推論に必要であり、型安全性を**強化**するものなので許容する。

```typescript
// ✅ OK: as const は許容
const ROLES = ["admin", "editor", "viewer"] as const;
```

**理由**: `as` は型チェックをバイパスするため、ランタイムエラーの原因になる。`satisfies` や型ガードは実際の値を検証するため、型安全性が保たれる。

### 4. 非nullアサーション (`!`) の使用禁止

`!` 演算子は原則禁止。optional chaining (`?.`) やnullish coalescing (`??`)、型のnarrowingで代替すること。

```typescript
// ✅ Good: optional chaining + nullish coalescing
const userName = user?.name ?? "Unknown";

// ✅ Good: 型ガードでnarrowing
const getElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element not found: ${id}`);
  }
  return element; // この時点でHTMLElement型に絞り込まれる
};

// ❌ Bad: 非nullアサーション
const userName = user!.name;
const element = document.getElementById("app")!;
```

**理由**: `!` は「null/undefinedではないと開発者が断言する」意味だが、実行時に保証がない。明示的なチェックの方がランタイムエラーを防げる。

### 5. `@ts-ignore` の使用禁止 (`@ts-expect-error` を使用)

`@ts-ignore` は禁止。やむを得ず型エラーを抑制する場合は `@ts-expect-error` を使用し、必ず理由をコメントで記載すること。

```typescript
// ✅ Good: @ts-expect-error + 理由を記載
// @ts-expect-error: ライブラリの型定義が古く、新しいオプションに対応していない
someLibrary.doSomething({ newOption: true });

// ❌ Bad: @ts-ignore（理由なし）
// @ts-ignore
someLibrary.doSomething({ newOption: true });
```

**理由**: `@ts-ignore` は対象のエラーが解消されても無警告でそのまま残る。`@ts-expect-error` はエラーが解消されると「不要な抑制」として警告が出るため、不要になったタイミングで検知・削除できる。

### 6. magic number の使用禁止

数値や文字列のリテラルは定数化すること。

```typescript
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const API_BASE_URL = "https://api.example.com";

const fetchWithRetry = async (url: string) => {
  for (let i = 0; i < MAX_RETRY_COUNT; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (i === MAX_RETRY_COUNT - 1) throw error;
    }
  }
};
```

**理由**: コードの可読性と保守性を向上させる。変更が必要な場合、一箇所の修正で済む。定数名が値の意味を明確にする。

## `readonly` の活用

### 基本方針

変更する意図がないデータには積極的に `readonly` を付与し、不変性を明示する。

### プロパティの `readonly`

```typescript
interface User {
  readonly id: string;
  readonly email: string;
  name: string; // 変更可能なプロパティのみreadonlyを付けない
}
```

### 関数引数での `Readonly<T>` / `readonly` 配列

関数が引数を変更しない場合は、`readonly` で意図を明示する。

```typescript
// 配列を変更しないことを型で保証
const calculateAverage = (values: readonly number[]): number => {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

// オブジェクトを変更しないことを型で保証
const formatUser = (user: Readonly<User>): string => {
  return `${user.name} <${user.email}>`;
};
```

**理由**: `readonly` を使うことで、意図しないミュータブル操作をコンパイル時に検出できる。特に関数の引数に付与することで、副作用がないことを型レベルで保証でき、コードの予測可能性が向上する。

## Discriminated Union と網羅性チェック

### 状態管理での Discriminated Union パターン

複数の状態を持つデータは、共通の判別プロパティ（discriminant）を持つ Discriminated Union で定義する。

```typescript
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### `never` を使った網羅性チェック

switch 文で全ケースを処理していることをコンパイル時に保証する。

```typescript
const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

const renderState = (state: AsyncState<User>) => {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <Spinner />;
    case "success":
      return <UserProfile data={state.data} />;
    case "error":
      return <ErrorMessage error={state.error} />;
    default:
      return assertNever(state); // 新しいstatusが追加されたらコンパイルエラー
  }
};
```

**理由**: Discriminated Union により、各状態で利用可能なプロパティが型レベルで保証される。`never` を使った網羅性チェックにより、新しい状態が追加された際にハンドリング漏れをコンパイル時に検出できる。

## コメント規約

### 基本方針

コメントは最低限にする。ADR（Architecture Decision Records）で重要な決定を記録しているため、コード内のコメントは補足的な役割に留める。

### コメントを書く場合

- **「なぜ」を記載する**：実装の意図や背景を説明する
- **「何を」は書かない**：コードを読めば分かることは書かない

```typescript
// ✅ 良いコメント：「なぜ」を説明
// タイムアウトを5秒に設定: APIサーバーの応答が遅い場合に備える
const TIMEOUT_MS = 5000;

// パスワードリセットトークンの有効期限を1時間に制限
// セキュリティ要件: 短時間での使用を強制し、漏洩リスクを軽減
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// ❌ 悪いコメント：「何を」を説明（コードで明らか）
// タイムアウトを5000ミリ秒に設定
const TIMEOUT_MS = 5000;

// ユーザーIDを取得
const userId = user.id;
```

### コメントが不要な場合

- 自己説明的なコード（適切な命名で意図が明確）
- 単純なロジック（コードを読めば分かる）
- ADRで詳細に記録済みの決定

**理由**: コメントはコードと同期が取れなくなるリスクがある。ADRに記録された重要な決定はそちらを参照し、コード内のコメントは最小限に留めることで保守性を高める。

## 例外処理

### 基本方針

例外が発生する可能性がある箇所では、原則として try-catch を使用する。

### try-catch を使用する場面

- 外部APIへのリクエスト
- ファイル入出力
- データベース操作
- JSON パース
- ユーザー入力のバリデーション

```typescript
// ✅ 適切な例外処理
const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching user ${userId}:`, error.message);
    }
    throw error;
  }
};
```

### エラーハンドリングのパターン

1. **キャッチ＆リスロー**：エラーをログに記録してから上位に投げる
2. **キャッチ＆リカバリ**：エラーを処理してデフォルト値を返す
3. **キャッチ＆通知**：エラーをユーザーに通知する

**理由**: 例外処理を明示的に行うことで、エラー発生時の挙動を予測可能にし、デバッグを容易にする。

## その他

コードレビューで主観的判断が必要な事項はこのドキュメントに含めません。リンターやフォーマッターで自動化できることはツールに任せます。

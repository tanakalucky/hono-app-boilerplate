---
name: writing-test
description: テストコードの記述・レビュー時に、プロジェクト固有のテスト規約を適用する。AAAパターン、振る舞い駆動テスト、偽陽性・偽陰性防止、ファイル配置・命名、Vitest Browser Modeの使い分けを含む。
---

# テスト規約

## 1. 基本方針

- テストピラミッド準拠（ユニット多め、統合少なめ、E2E最小限）
- カバレッジ測定しない（質重視）
- フレームワーク: Vitest（globals有効）
- Browser Mode: DOM操作が必要なときのみ

## 2. ファイル配置と命名

### コロケーション

テストファイルはソースと同じディレクトリに配置する。

```
src/react-app/shared/lib/
├── utils.ts
├── utils.unit.test.ts        # ユニットテスト
└── utils.browser.test.tsx     # ブラウザテスト（必要な場合のみ）
```

### 命名パターン

| 種別     | パターン             | Vitest project |
| -------- | -------------------- | -------------- |
| ユニット | `*.unit.test.ts`     | unit           |
| ブラウザ | `*.browser.test.tsx` | browser        |

### describe / it の記述

日本語で記述する。`describe` に対象、`it` に振る舞いを書く。

```typescript
describe("UserService", () => {
  it("有効なメールアドレスでユーザーを登録できる", () => {
    // ...
  });

  it("無効なメールアドレスで登録するとエラーになる", () => {
    // ...
  });
});
```

## 3. AAAパターン

Arrange（準備）→ Act（実行）→ Assert（検証）の構造を守る。

### シンプルなケース

各セクションが1回ずつ & 各3行以内の場合、空行で区切る。

```typescript
// ✅
it("合計金額を計算する", () => {
  const items = [{ price: 100 }, { price: 200 }];

  const total = calculateTotal(items);

  expect(total).toBe(300);
});
```

### 複雑なケース

上記以外（セクションが複数行、複数のArrangeがある等）はコメントで明示する。

```typescript
// ✅
it("割引適用後の合計金額を計算する", () => {
  // Arrange
  const items = [{ price: 100 }, { price: 200 }, { price: 300 }];
  const discount = { type: "percentage" as const, value: 10 };
  const user = createUser({ membershipLevel: "gold" });

  // Act
  const total = calculateDiscountedTotal(items, discount, user);

  // Assert
  expect(total).toBe(540);
  expect(total).toBeLessThan(600);
});
```

## 4. 振る舞い駆動テスト

外部から観測可能な振る舞いをテストする。実装の詳細ではなく、ユースケースを起点にテストを書く。

### 単純な関数は間接テスト

単純なヘルパー関数は、それを使う上位の関数で間接的にテストする。

```typescript
// ❌ 単純な関数の直接テスト（プロダクションコードのコピーになる）
it("isAdultは18歳以上でtrueを返す", () => {
  expect(isAdult(18)).toBe(true);
});

// ✅ 上位の振る舞いでテスト
it("未成年のユーザーはアカウント登録できない", () => {
  const minorUser = { age: 16, email: "test@example.com" };

  const result = registerUser(minorUser);

  expect(result).toEqual({ success: false, error: "未成年は登録できません" });
});
```

### 実装の詳細に依存しない

```typescript
// ❌ 内部状態を確認
it("ユーザー登録時にuserCountが増える", async () => {
  const initialCount = getUserCount();
  await registerUser(user);
  expect(getUserCount()).toBe(initialCount + 1);
});

// ✅ 外部から観測可能な振る舞いを確認
it("ユーザー登録に成功すると確認メールが送信される", async () => {
  const user = { email: "test@example.com", password: "pass123" };

  await registerUser(user);

  expect(mailService.send).toHaveBeenCalledWith({
    to: "test@example.com",
    subject: "登録確認",
  });
});
```

## 5. 偽陽性・偽陰性の防止

### 偽陽性（リファクタで壊れるテスト）を防ぐ

内部状態に依存しない。モックは外部依存（API、DB、メール等）に限定する。

```typescript
// ❌ 内部メソッドの呼び出し順序をテスト（リファクタで壊れる）
it("処理順序を確認する", () => {
  const spy = vi.spyOn(service, "validate");
  service.process(data);
  expect(spy).toHaveBeenCalledBefore(vi.spyOn(service, "save"));
});

// ✅ 結果だけを確認
it("有効なデータを処理すると保存される", () => {
  const data = createValidData();

  const result = service.process(data);

  expect(result.saved).toBe(true);
});
```

### 偽陰性（バグを見逃すテスト）を防ぐ

期待値にプロダクションコードの定数を使わない。アサーションは具体的にする。

```typescript
// ❌ プロダクションコードの定数を使う（定数が間違っていてもテストが通る）
import { MAX_RETRY_COUNT } from "./constants";
it("最大リトライ回数を超えるとエラーになる", () => {
  expect(getMaxRetries()).toBe(MAX_RETRY_COUNT);
});

// ✅ 具体的な値でアサート
it("最大リトライ回数を超えるとエラーになる", () => {
  expect(getMaxRetries()).toBe(3);
});
```

```typescript
// ❌ 曖昧なアサーション（バグを見逃す）
expect(result).toBeTruthy();

// ✅ 具体的なアサーション
expect(result).toEqual({ id: "1", name: "テストユーザー" });
```

## 6. Browser Modeの使い分け

### 使う場合（`*.browser.test.tsx`）

- DOM操作・レンダリング確認が必要なテスト
- ブラウザAPIが必要なテスト（localStorage, fetch等）

```tsx
import { page } from "@vitest/browser/context";
import { render } from "vitest-browser-react";

it("ボタンクリックでカウンターが増加する", async () => {
  const screen = await render(<Counter />);

  await screen.getByRole("button", { name: "増加" }).click();

  await expect.element(screen.getByText("1")).toBeVisible();
});
```

### 使わない場合（`*.unit.test.ts`）

- 純粋なロジック、データ変換、バリデーション
- APIクライアント、ユーティリティ関数

```typescript
it("パスワードがハッシュ化される", async () => {
  const hashed = await hashPassword("password123");

  expect(hashed).not.toBe("password123");
  expect(hashed.length).toBeGreaterThan(20);
});
```

## 7. やること / やらないこと

### やること

- 振る舞い（入力→出力、副作用）をテストする
- テスト名に「何をしたら」「どうなるか」を書く
- 1テスト1アサーション（論理的に1つの検証）
- テストデータはテスト内で完結させる（共有フィクスチャを避ける）

### やらないこと

- 単純な関数（getter、ワンライナー）の直接テスト
- 実装詳細（プライベートメソッド、呼び出し順序）のテスト
- スナップショットテスト
- テスト間の暗黙的な依存（実行順序に依存するテスト）
- `any` や `@ts-ignore` でテストコードの型エラーを回避

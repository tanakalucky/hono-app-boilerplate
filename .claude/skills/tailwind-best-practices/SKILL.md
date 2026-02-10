---
name: tailwind-best-practices
description: Tailwind CSSクラス指定のベストプラクティス。ユーティリティファースト、cn()によるクラス結合、任意値の制限、レスポンシブ設計、状態バリアント、ダークモード、CVA、@apply制限を定義。Tailwindクラスを書く際、レビューする際に使用。
---

# Tailwind CSS ベストプラクティス

このドキュメントは、Tailwind CSS のクラス指定におけるベストプラクティスを定義します。リンター（oxlint + eslint-plugin-better-tailwindcss）で自動検出できるルール（ショートハンド強制、重複検出、矛盾検出、正規クラス名）は含めず、開発者が判断・実践すべき原則に焦点を当てています。

## ユーティリティファースト原則

Tailwind のユーティリティクラスを最優先で使用する。カスタム CSS は原則として書かない。

```tsx
// ✅ ユーティリティクラスを使用
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
</div>

// ❌ カスタム CSS を書かない
// styles.css: .card { display: flex; align-items: center; ... }
<div className="card">
  <h2 className="card-title">Title</h2>
</div>
```

**理由**:

- CSS ファイルの肥大化を防ぐ
- クラス名の命名に悩む時間を減らす
- デザインの一貫性を保てる
- スタイルがコンポーネントと同じ場所にあり、影響範囲が明確になる

## クラスの結合方法

### `cn()` を必ず使用する

条件付きクラスや外部から受け取る `className` のマージには、必ず `cn()` を使用する。

```tsx
import { cn } from "@/shared/lib/shadcn-utils";

// ✅ cn() で結合
<div className={cn("flex items-center gap-2", isActive && "bg-blue-500", className)} />

// ❌ テンプレートリテラルで結合しない
<div className={`flex items-center gap-2 ${isActive ? "bg-blue-500" : ""} ${className}`} />

// ❌ 配列の join で結合しない
<div className={["flex items-center gap-2", isActive && "bg-blue-500"].filter(Boolean).join(" ")} />
```

**理由**:

- `cn()` は内部で `clsx` + `tailwind-merge` を使用しており、条件付きクラスの適用と Tailwind クラスの競合解決を同時に行う
- テンプレートリテラルや `join` では、`text-red-500` と `text-blue-500` のような競合を解決できない

### 静的なクラスに `cn()` は不要

条件分岐がなく、外部の `className` もマージしない場合は、直接文字列を指定する。

```tsx
// ✅ 静的なクラスはそのまま
<div className="flex items-center gap-4" />

// ❌ 不要な cn() を使わない
<div className={cn("flex items-center gap-4")} />
```

## 任意値 (Arbitrary Values) の制限

### テーマトークンを優先する

Tailwind のデザイントークン（テーマ値）が存在する場合は、任意値 `[...]` を使わない。

```tsx
// ✅ テーマトークンを使用
<div className="p-4 text-sm text-gray-500 rounded-lg" />

// ❌ 任意値で同じ値を指定しない
<div className="p-[16px] text-[14px] text-[#6b7280] rounded-[8px]" />
```

### 任意値が許容されるケース

テーマにない値が必要な場合に限り使用する。ただし、頻出する場合は CSS 変数としてテーマに追加することを検討する。

```tsx
// ✅ テーマにない値を一度だけ使う
<div className="top-[117px]" />
<div className="grid-cols-[1fr_2fr_1fr]" />

// ⚠️ 繰り返し使う値はテーマに追加を検討
// @theme { --spacing-header: 72px; } → className="h-header"
```

**理由**:

- テーマトークンを使えばデザインの一貫性が保たれる
- 任意値が増えるとデザインシステムの意味が薄れ、保守性が低下する

## レスポンシブ設計

### モバイルファーストの原則

ベースにモバイル向けのスタイルを書き、ブレイクポイントプレフィクス（`sm:` → `md:` → `lg:` → `xl:`）で段階的に上書きする。

```tsx
// ✅ モバイルファースト: 小さい画面がベース → 大きい画面で上書き
<div className="flex flex-col gap-4 md:flex-row md:gap-8 lg:gap-12" />
<div className="p-4 md:p-6 lg:p-8" />
<h1 className="text-2xl md:text-3xl lg:text-4xl" />

// ❌ デスクトップファースト: max-width で逆方向に指定しない
<div className="flex-row max-md:flex-col" />
```

**理由**:

- Tailwind のブレイクポイントは `min-width` ベースで設計されている
- モバイルファーストで書くことで、各ブレイクポイントの意図が明確になる
- 段階的に複雑なレイアウトを構築でき、コードの可読性が高い

## 状態バリアント

### `focus` より `focus-visible` を優先する

マウスクリック時のフォーカスリングを避けるため、`focus-visible` を使用する。

```tsx
// ✅ キーボードフォーカス時のみリングを表示
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" />

// ❌ マウスクリック時にもリングが表示される
<button className="focus:ring-2 focus:ring-blue-500 focus:outline-none" />
```

**理由**:

- `focus-visible` は Web 標準の擬似クラスで、キーボード操作時にのみフォーカススタイルを適用する
- マウスユーザーの UX を損なわずにアクセシビリティを確保できる

## ダークモード

### CSS 変数を優先し、`dark:` の記述量を最小化する

本プロジェクトでは `@custom-variant dark (&:is(.dark *))` でダークモードを実現している。色指定にはテーマ定義の CSS 変数（`bg-background`, `text-foreground`, `bg-card` 等）を優先し、`dark:` プレフィクスの使用を最小限にする。

```tsx
// ✅ CSS 変数でライト/ダーク両対応（dark: 不要）
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground border-border" />

// ⚠️ 毎回 dark: で個別指定するのは冗長
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />

// ✅ CSS 変数にない色で dark: が必要な場合
<div className="text-blue-600 dark:text-blue-400" />
```

**理由**:

- CSS 変数はテーマ切り替え時に自動で値が変わるため、コンポーネントごとに `dark:` を書く必要がなくなる
- コード量の削減とテーマの一貫性が向上する

## CVA によるバリアント管理

### 2つ以上のバリアント軸があるコンポーネントには CVA を使用する

同じコンポーネントで複数のスタイルバリエーション（例: variant + size）がある場合、条件分岐ではなく `class-variance-authority` を使用する。

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/shadcn-utils";

// ✅ CVA でバリアントを宣言的に管理
const buttonVariants = cva("inline-flex items-center justify-center rounded-md font-medium", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

// コンポーネントでは cn() で外部 className とマージ
function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

```tsx
// ❌ 条件分岐でスタイルを切り替えない
<button
  className={cn(
    "inline-flex items-center justify-center",
    variant === "default" && "bg-primary text-primary-foreground",
    variant === "outline" && "border border-input bg-background",
    className,
  )}
/>
```

**理由**:

- バリアントの定義を宣言的に管理でき、型安全性も確保される
- 条件分岐が増えるほど CVA の恩恵が大きくなる
- shadcn/ui のコンポーネントと設計思想が統一される

## `@apply` の使用制限

### 原則として `@apply` は使わない

`@apply` はコンポーネントの JSX 内にユーティリティクラスを直接書くことで代替する。

```css
/* ❌ @apply でユーティリティをまとめない */
.btn-primary {
  @apply inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white;
}
```

### `@apply` が許容されるケース

グローバルな基盤スタイル（`@layer base`）に限定して使用可能。

```css
/* ✅ グローバルなベーススタイルでは許容 */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**理由**:

- `@apply` を多用するとユーティリティファーストの利点（コロケーション、明示性）が失われる
- React コンポーネントでは CVA + `cn()` の組み合わせで同等以上の再利用性を実現できる

## その他

フォーマッターやリンターで自動化できることはこのドキュメントに含めません。以下はツールに委譲しています：

- **クラスの並び順**: oxfmt（フォーマッター）
- **ショートハンドの強制**: oxlint（`enforce-shorthand-classes`）
- **正規クラス名の強制**: oxlint（`enforce-canonical-classes`）
- **重複・矛盾クラスの検出**: oxlint（`no-duplicate-classes`, `no-conflicting-classes`）

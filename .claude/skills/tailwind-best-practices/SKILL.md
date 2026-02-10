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

**理由**: Tailwind のユーティリティクラスを使うことで、CSS ファイルの肥大化を防ぎ、クラス名の命名に悩む時間を減らし、デザインの一貫性を保てる。

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

**理由**: `cn()` は内部で `clsx` + `tailwind-merge` を使用しており、条件付きクラスの適用と Tailwind クラスの競合解決を同時に行う。テンプレートリテラルや `join` では、`text-red-500` と `text-blue-500` のような競合を解決できない。

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

## レスポンシブ設計

### モバイルファーストの原則

ベースにモバイル向けのスタイルを書き、ブレイクポイントで上書きする。

```tsx
// ✅ モバイルファースト: 小さい画面がベース
<div className="flex flex-col gap-4 md:flex-row md:gap-8 lg:gap-12" />
<div className="p-4 md:p-6 lg:p-8" />
<h1 className="text-2xl md:text-3xl lg:text-4xl" />

// ❌ max-width で逆方向に指定しない
<div className="flex-row max-md:flex-col" />
```

**理由**: Tailwind のブレイクポイントは `min-width` ベースで設計されている。モバイルファーストで書くことで、各ブレイクポイントの意図が明確になり、段階的に複雑なレイアウトを構築できる。

### ブレイクポイントの適用順序

小さい順に指定する。

```tsx
// ✅ sm → md → lg → xl の順
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" />

// ❌ 順序がバラバラ
<div className="w-full lg:w-1/4 sm:w-1/2 xl:w-1/5 md:w-1/3" />
```

## 状態バリアント

### 一般的な優先順序

ベーススタイル → インタラクション状態 → フォーカス状態 → アクティブ状態 → 無効状態の順で指定する。

```tsx
// ✅ 論理的な順序で指定
<button className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 active:bg-blue-800 disabled:opacity-50" />
```

### `focus` より `focus-visible` を優先する

マウスクリック時のフォーカスリングを避けるため、`focus-visible` を使用する。

```tsx
// ✅ キーボードフォーカス時のみリングを表示
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" />

// ❌ マウスクリック時にもリングが表示される
<button className="focus:ring-2 focus:ring-blue-500 focus:outline-none" />
```

**理由**: `focus-visible` は Web 標準の擬似クラスで、キーボード操作時にのみフォーカススタイルを適用する。これによりマウスユーザーの UX を損なわずにアクセシビリティを確保できる。

## ダークモード

### プロジェクトのダークモード方式

本プロジェクトでは `@custom-variant dark (&:is(.dark *))` を使用しているため、`dark:` プレフィクスでダークモードスタイルを指定する。

```tsx
// ✅ dark: プレフィクスを使用
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100" />

// ✅ CSS 変数を活用してダークモードを自動化
// テーマで定義された CSS 変数を使えば dark: が不要になる
<div className="bg-background text-foreground" />
```

### CSS 変数の活用

ダークモードの色指定は、できるだけ CSS 変数（`bg-background`, `text-foreground` 等）を使用し、`dark:` プレフィクスの記述量を最小化する。

```tsx
// ✅ CSS 変数でライト/ダーク両対応（dark: 不要）
<div className="bg-card text-card-foreground border-border" />

// ⚠️ 毎回 dark: で個別指定するのは冗長
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
```

**理由**: CSS 変数はテーマ切り替え時に自動で値が変わるため、コンポーネントごとに `dark:` を書く必要がなくなる。コード量の削減とテーマの一貫性が向上する。

## CVA によるバリアント管理

### コンポーネントのバリアントには `class-variance-authority` を使用する

同じコンポーネントで複数のスタイルバリエーションがある場合、条件分岐ではなく CVA を使用する。

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/shadcn-utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

```tsx
// ❌ 条件分岐でスタイルを切り替えない
function Button({ variant, className }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        variant === "outline" && "border border-input bg-background",
        className,
      )}
    />
  );
}
```

**理由**: CVA はバリアントの定義を宣言的に管理でき、型安全性も確保される。条件分岐が増えるほど CVA の恩恵が大きくなる。

## `@apply` の使用制限

### 原則として `@apply` は使わない

`@apply` はコンポーネントの JSX 内にユーティリティクラスを直接書くことで代替する。

```css
/* ❌ @apply でユーティリティをまとめない */
.btn-primary {
  @apply inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700;
}
```

```tsx
// ✅ JSX にユーティリティクラスを直接書く（CVA 推奨）
<button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" />
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

**理由**: `@apply` を多用するとユーティリティファーストの利点（コロケーション、明示性）が失われる。React コンポーネントでは CVA + `cn()` の組み合わせで同等以上の再利用性を実現できる。

---
paths: src/**/*
---

# Feature-Sliced Design (FSD) アーキテクチャルール

このプロジェクトでは、フロントエンドコードに Feature-Sliced Design (FSD) を採用しています。

## 概要

FSD は、プロジェクトの安定性と理解度を高めるための建築方法論です。コードを3つの階層構造で整理します：

1. **Layers（レイヤー）** - 責任度による階層分け
2. **Slices（スライス）** - ビジネスドメインによる分割
3. **Segments（セグメント）** - 技術的性質による分類

## レイヤー構造

以下の7つのレイヤーを上から下の順で使用します（すべて必須ではありません）：

### 1. app（必須）

- **責務**: アプリケーション全体の設定・初期化
- **含むもの**: ルーティング、エントリーポイント、グローバルスタイル、プロバイダー
- **例**: `app/providers/`, `app/styles/`, `app/router.tsx`

### 2. pages（推奨）

- **責務**: ページ/画面全体の構成
- **含むもの**: ページコンポーネント、ページ固有のロジック
- **例**: `pages/home/`, `pages/dashboard/`, `pages/settings/`
- **注意**: ページ固有のロジックのみ。再利用可能な部分は下位レイヤーへ

### 3. widgets（任意）

- **責務**: 大規模で自己完結したUIブロック
- **含むもの**: ヘッダー、サイドバー、フッターなど
- **例**: `widgets/header/`, `widgets/sidebar/`
- **判断基準**: 複数のfeaturesを組み合わせた複雑なUI

### 4. features（推奨）

- **責務**: ユーザーが実行できる具体的な機能
- **含むもの**: ビジネス価値を持つ再利用可能な機能
- **例**: `features/auth/`, `features/post-comment/`, `features/search/`
- **判断基準**: 「ユーザーができること」で考える

### 5. entities（推奨）

- **責務**: ビジネスドメインの概念・モデル
- **含むもの**: ビジネスエンティティの定義、基本的なUI
- **例**: `entities/user/`, `entities/post/`, `entities/product/`
- **注意**: ビジネスロジックは含まず、純粋なモデルとUI

### 6. shared（必須）

- **責務**: プロジェクト全体で再利用される汎用的なコード
- **含むもの**: UIキット、ユーティリティ、API設定
- **例**: `shared/ui/`, `shared/lib/`, `shared/api/`, `shared/config/`

### 7. processes（非推奨）

- ページ間シナリオ用（現在は非推奨、使用しない）

## スライス（Slices）

スライスはビジネスドメインでコードを分割します。

### 命名規則

- ビジネスドメインを反映した名前を使用
- 技術的な名前は避ける
- 例: `user`, `post`, `comment`, `authentication`

### ルール

- **同一レイヤー内のスライス間での相互参照は禁止**
- 各スライスは独立している必要がある
- スライスをフォルダでグループ化可能（例: `entities/user/profile/`, `entities/user/settings/`）

### Public API

各スライスは必ず `index.ts` でPublic APIを定義します：

```typescript
// features/auth/index.ts
export { LoginForm } from "./ui/LoginForm";
export { useAuth } from "./model/useAuth";
export type { AuthState } from "./model/types";
```

外部からは `index.ts` 経由でのみアクセス可能とし、内部実装を隠蔽します。

#### パフォーマンスに関する考慮事項

バレルファイル（index.ts）を多用すると、大規模プロジェクトでパフォーマンス問題が発生する可能性があります。

##### 問題点

1. **循環参照のリスク**: 同一ディレクトリ内でバレルファイル経由のimportを行うと、循環依存が容易に発生します
2. **開発サーバーの速度低下**: バレルファイルをimportすると、そのファイル内のすべてのモジュールが同期的に読み込まれ、起動時間が増大します
3. **ビルド最適化の妨害**: バレルファイルに再エクスポート以外のコードが含まれると、Tree Shakingなどの最適化が効果的に機能しません

##### 推奨される対策

**1. shared レイヤーでの細分化**

`shared/ui` や `shared/lib` では、大きな単一のindex.tsではなく、コンポーネント/ライブラリごとに独立したindex.tsを配置します：

```
✅ 推奨
shared/ui/
├── Button/
│   ├── Button.tsx
│   └── index.ts          # Buttonのみをexport
├── Input/
│   ├── Input.tsx
│   └── index.ts          # Inputのみをexport
└── Dialog/
    ├── Dialog.tsx
    └── index.ts          # Dialogのみをexport

❌ 避けるべき
shared/ui/
├── Button.tsx
├── Input.tsx
├── Dialog.tsx
└── index.ts              # すべてのコンポーネントをまとめてexport
```

**2. セグメントレベルのindex.ts削減**

スライスが存在するレイヤー（pages、features、entities）では、セグメント内でのindex.ts作成を避けます：

```typescript
// ❌ 避けるべき: features/auth/ui/index.ts を作成
import { LoginForm } from "./features/auth/ui";

// ✅ 推奨: スライスのindex.tsから直接export
// features/auth/index.ts
export { LoginForm } from "./ui/LoginForm";
export { LogoutButton } from "./ui/LogoutButton";

// 使用側
import { LoginForm } from "./features/auth";
```

**3. プロジェクト規模に応じた構造検討**

非常に大規模なプロジェクト（例: 10,000+ モジュール）では、モノレポ構造への移行を検討します。各パッケージが独立したFSDレイヤー構成を持つことで、依存関係とビルド時間を最適化できます。

**参考資料:**

- [FSD: Public API - Performance considerations](https://feature-sliced.design/docs/reference/public-api#worse-performance-of-bundlers-on-large-projects)
- [TkDodo: Please Stop Using Barrel Files](https://tkdodo.eu/blog/please-stop-using-barrel-files)

## セグメント（Segments）

セグメントは技術的性質でコードを分類します。

### 標準セグメント名

#### ui

- UIコンポーネント、スタイル
- 例: `Button.tsx`, `Form.module.css`

#### api

- バックエンド連携
- 例: `getUserApi.ts`, `types.ts`

#### model

- データモデル、ビジネスロジック、ストア
- 例: `useUserStore.ts`, `schema.ts`, `types.ts`

#### lib

- ライブラリコード、ヘルパー関数
- 例: `formatDate.ts`, `validation.ts`

#### config

- 設定ファイル
- 例: `constants.ts`, `routes.ts`

### 命名規則

- 目的を説明する名前を使用
- ❌ 避けるべき: `components/`, `hooks/`, `types/`
- ✅ 推奨: `ui/`, `model/`, `lib/`

## 依存関係のルール

### レイヤー間の依存

上位レイヤーは下位レイヤーにのみ依存可能：

```
app → pages → widgets → features → entities → shared
```

例:

- ✅ `pages` は `features` をimport可能
- ✅ `features` は `entities` をimport可能
- ❌ `entities` は `features` をimport不可
- ❌ `features` は `pages` をimport不可

### スライス間の依存

同一レイヤー内のスライス間での相互参照は禁止：

```
❌ features/auth → features/post  # 禁止
✅ features/auth → entities/user  # OK（下位レイヤー）
```

### 例外

- **app** と **shared** は特殊で、セグメント間での相互参照が許可されます

## インポートルール

### エイリアスの使用

他のレイヤーからインポートする場合は、必ずエイリアス `@/` を使用してください。

#### 設定されているエイリアス

| エイリアス | パス    |
| ---------- | ------- |
| `@/*`      | `src/*` |

#### 使用例

```typescript
// ✅ 推奨: 他のレイヤーからのインポートはエイリアスを使用
import { Button } from "@/shared/ui/Button";
import { useAuth } from "@/features/auth";
import { UserCard } from "@/entities/user";

// ❌ 避けるべき: 相対パスでの他レイヤー参照
import { Button } from "../../shared/ui/Button";
import { useAuth } from "../../../features/auth";
```

### 同一スライス内のインポート

同一スライス内（セグメント間）でのインポートは相対パスのみ使用します。
**循環参照を防ぐため、barrel（index.ts）経由やエイリアス使用は禁止です。**

```typescript
// features/auth/ui/LoginForm.tsx

// ✅ 同一スライス内は相対パスのみ
import { useAuth } from "../model/useAuth";
import { AuthButton } from "./AuthButton";

// ❌ 循環参照の原因となるため禁止
import { useAuth } from "@/features/auth"; // barrel経由
import { useAuth } from "@/features/auth/model/useAuth"; // エイリアス使用
```

### 同一レイヤー内のスライス間インポート（@xノーテーション）

同一レイヤー内のスライス間での相互参照は通常禁止されていますが、エンティティレイヤーではビジネスドメインの性質上、完全に排除することが困難な場合があります。

そのような場合は、**@xノーテーション**を使用してクロスインポート用の専用Public APIを定義します。

#### ディレクトリ構造

```
entities/
├── user/
│   ├── @x/
│   │   └── post.ts      # post専用のPublic API
│   ├── ui/
│   ├── model/
│   └── index.ts         # 通常のPublic API
└── post/
    ├── ui/
    │   └── PostCard.tsx # @x/post.ts経由でuserをimport
    ├── model/
    └── index.ts
```

#### 使用例

```typescript
// entities/user/@x/post.ts
// postスライスに公開するuserのPublic API
export type { User } from "../model/types";
export { UserAvatar } from "../ui/UserAvatar";

// entities/post/ui/PostCard.tsx
// @xノーテーションでuserからimport
import type { User } from "@/entities/user/@x/post";
import { UserAvatar } from "@/entities/user/@x/post";
```

#### 重要な制限

- **エンティティレイヤーでのみ使用**してください
- クロスインポートは最小限に抑えてください
- 可能な限り、下位レイヤー（shared）への移動を検討してください

**参考**: [FSD公式 - Cross-imports用Public API](https://feature-sliced.design/ja/docs/reference/public-api#public-api-for-cross-imports)

## ディレクトリ構造の例

```
src
├── app/
│   ├── providers/
│   │   └── index.tsx
│   ├── styles/
│   │   └── global.css
│   └── index.tsx
├── pages/
│   ├── home/
│   │   ├── ui/
│   │   │   └── HomePage.tsx
│   │   └── index.ts
│   └── dashboard/
│       ├── ui/
│       │   └── DashboardPage.tsx
│       └── index.ts
├── widgets/
│   └── header/
│       ├── ui/
│       │   └── Header.tsx
│       └── index.ts
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── model/
│   │   │   ├── useAuth.ts
│   │   │   └── types.ts
│   │   └── index.ts
│   └── post-comment/
│       ├── ui/
│       │   └── CommentForm.tsx
│       ├── model/
│       │   └── useComment.ts
│       └── index.ts
├── entities/
│   ├── user/
│   │   ├── ui/
│   │   │   └── UserCard.tsx
│   │   ├── model/
│   │   │   └── types.ts
│   │   └── index.ts
│   └── post/
│       ├── ui/
│       │   └── PostCard.tsx
│       ├── model/
│       │   └── types.ts
│       └── index.ts
└── shared/
    ├── ui/
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── index.ts
    │   └── Input/
    │       ├── Input.tsx
    │       └── index.ts
    ├── lib/
    │   ├── formatDate.ts
    │   └── validation.ts
    ├── api/
    │   ├── client.ts
    │   └── types.ts
    └── config/
        └── constants.ts
```

## 実装時のチェックリスト

コードを書く際は、以下を確認してください：

- [ ] 適切なレイヤーに配置しているか？
- [ ] スライス名はビジネスドメインを反映しているか？
- [ ] セグメント名は技術的性質を示しているか？
- [ ] 依存関係のルールを守っているか？（上位→下位のみ）
- [ ] 同一レイヤー内のスライス間で相互参照していないか？
- [ ] Public API（index.ts）を定義しているか？
- [ ] すべてのimportはPublic API経由か？
- [ ] sharedレイヤーでは、コンポーネント/ライブラリごとに独立したindex.tsを使用しているか？
- [ ] セグメントレベル（例: features/auth/ui/）でのindex.ts作成を避けているか？

## 参考リンク

- [FSD公式ドキュメント](https://feature-sliced.design/)
- [Overview](https://feature-sliced.design/docs/get-started/overview)
- [Layers Reference](https://feature-sliced.design/docs/reference/layers)
- [Slices & Segments](https://feature-sliced.design/docs/reference/slices-segments)
- [FSD: Public API - Performance considerations](https://feature-sliced.design/docs/reference/public-api#worse-performance-of-bundlers-on-large-projects)
- [TkDodo: Please Stop Using Barrel Files](https://tkdodo.eu/blog/please-stop-using-barrel-files)

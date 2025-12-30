---
paths: src/react-app/**/*
---

# Feature-Sliced Design (FSD) アーキテクチャルール

このプロジェクトでは、フロントエンドコード（`src/react-app`）に Feature-Sliced Design (FSD) を採用しています。

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
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/useAuth'
export type { AuthState } from './model/types'
```

外部からは `index.ts` 経由でのみアクセス可能とし、内部実装を隠蔽します。

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

## ディレクトリ構造の例

```
src/react-app/
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

## 参考リンク

- [FSD公式ドキュメント](https://feature-sliced.design/)
- [Overview](https://feature-sliced.design/docs/get-started/overview)
- [Layers Reference](https://feature-sliced.design/docs/reference/layers)
- [Slices & Segments](https://feature-sliced.design/docs/reference/slices-segments)

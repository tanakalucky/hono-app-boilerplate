# コミット規約

このドキュメントは、日本語のConventional Commit形式によるコミットメッセージを定義します。

## Conventional Commits形式（日本語版）

すべてのコミットは以下の形式に従ってください：

```
type(scope): 日本語のメッセージ
```

scopeは省略可能です。

## Type（種類）

コミットの種類を示します：

- **feat**: 新機能の追加
- **fix**: バグ修正
- **chore**: ビルドプロセスや補助ツールの変更、依存関係の更新
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンなど）
- **refactor**: バグ修正や機能追加を伴わないコードの変更
- **perf**: パフォーマンス改善
- **test**: テストの追加や修正
- **build**: ビルドシステムや外部依存関係に影響する変更
- **ci**: CI設定ファイルやスクリプトの変更

## Scope（範囲）

プロジェクトの構造に基づいた範囲指定（省略可能ですが、明確な場合は指定を推奨）：

### 依存関係関連
- **deps**: 依存関係の更新（最も頻繁に使用）

### フロントエンド関連
- **react-app**: Reactアプリケーション全般
- **components**: コンポーネントの変更
- **hooks**: カスタムフックの変更
- **ui**: UIコンポーネント（shadcn/ui）の変更
- **styles**: スタイリング関連

### バックエンド関連
- **worker**: Cloudflare Worker関連
- **api**: APIエンドポイント関連
- **routes**: ルーティング関連

### 設定・ツール関連
- **vite**: Vite設定
- **tsconfig**: TypeScript設定
- **oxfmt**: oxfmt（フォーマッター）設定
- **lefthook**: Git hooksの設定
- **ci**: CI/CD設定

### その他
- **lib**: 共有ライブラリ
- **test**: テスト関連
- **config**: 一般的な設定ファイル

## メッセージの書き方

1. **日本語で記述**: メッセージ本文は日本語で明確に
2. **動詞で始める**: 「追加」「修正」「更新」「削除」「変更」「改善」など
3. **簡潔に**: 50文字以内を目安
4. **具体的に**: 何をしたのか、何のためかを明確に

### 良い例
- `feat(api): ユーザー認証エンドポイントを追加`
- `fix(components): ボタンの無限ループバグを修正`
- `chore(deps): React 19.2.0に更新`
- `refactor(hooks): useApiフックのエラーハンドリングを改善`
- `docs: READMEにデプロイ手順を追加`
- `style(ui): ボタンの余白を調整`
- `test(components): LoadingSpinnerのテストを追加`

### 悪い例
- `update` （何を更新したか不明）
- `fix bug` （どのバグか不明）
- `add new feature for user authentication and authorization system` （長すぎる、英語）

## Breaking Changes

破壊的変更がある場合は `!` を追加し、詳細を記述：

```
feat(api)!: 認証APIのレスポンス形式を変更

BREAKING CHANGE: レスポンスの構造が変更されました。
詳細は移行ガイドを参照してください。
```

## プロジェクト固有の考慮事項

- **Cloudflare Workers環境**: workerやapi関連の変更はworker/apiスコープを使用
- **モノレポ構造**: src/react-app/とsrc/worker/の分離を意識したscopeを選択
- **依存関係更新頻度**: chore(deps)が最も頻繁に使用されるパターン

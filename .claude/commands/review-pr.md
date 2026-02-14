---
allowed-tools: Bash(gh issue view:*),Bash(gh search:*),Bash(gh issue list:*),Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr list:*),Bash(gh api:*),Bash(jq:*),WebFetch,WebSearch,mcp__github_inline_comment__create_inline_comment
description: 5つの観点 (品質、パフォーマンス、テスト、ドキュメント、セキュリティ) からPRを包括的にレビューする
argument-hint: [owner/repo] [pr-number]
---

REPO: $1
PR NUMBER: $2

## ステップ 1: プロジェクトルールの読み込み

最初に、プロジェクトルートの CLAUDE.md ファイルを Read ツールで読み込み、プロジェクト固有のルール、開発環境、設計方針を確認する。この情報は、後続のすべてのサブエージェントに共有される。

CLAUDE.md が存在しない場合はこのステップをスキップする。

## ステップ 2: PR情報の取得

以下のコマンドでPRの概要情報を取得する:

```
gh pr view $2 --repo $1
gh pr diff $2 --repo $1
```

PR のタイトル、説明、変更ファイル一覧、差分を取得し、ステップ3の各サブエージェントに渡す前提知識とする。

## ステップ 3: サブエージェントによる包括的レビュー

以下の5つのサブエージェントを**並列で**起動し、それぞれ独立したコンテキストウィンドウでレビューを実行する:

- @code-quality-reviewer (コード品質レビュアー)
- @performance-reviewer (パフォーマンスレビュアー)
- @test-coverage-reviewer (テストカバレッジレビュアー)
- @documentation-accuracy-reviewer (ドキュメント正確性レビュアー)
- @security-code-reviewer (セキュリティコードレビュアー)

**重要**:

- 各サブエージェントには、ステップ1で読み込んだ CLAUDE.md の内容と、ステップ2で取得したPR情報を前提知識として提供する
- 各サブエージェントは `mcp__github_inline_comment__create_inline_comment` を使って Files changed タブに直接インラインコメントする
- 注目すべきフィードバック**のみ**を提供するよう指示する (ノイズを減らす)
- 具体的な修正提案がある場合は GitHub の suggestion 構文を使用する

## ステップ 4: フィードバックの統合と投稿

各サブエージェントの結果を統合し、以下をPRにコメントとして投稿する:

1. **全般的な所見のサマリー** (各レビュアーの結果を要約)
2. **称賛すべき点** (良いコードや設計があればハイライト)
3. **最終判断**: PR をマージしてよいか、修正が必要かを明示
   - 🟢 **Approve**: 問題なし、マージ可能
   - 🟡 **Request Changes (Minor)**: 軽微な修正が必要
   - 🔴 **Request Changes (Critical)**: 重大な問題あり、修正必須

サマリーコメントには `gh pr comment` を使用する。
個別の指摘はステップ3でインラインコメント済みなので、サマリーでは繰り返さない。

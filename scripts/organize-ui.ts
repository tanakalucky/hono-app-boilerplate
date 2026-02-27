/**
 * shadcn/ui コンポーネントをFSD推奨のディレクトリ構造に変換するスクリプト
 *
 * 変換例:
 *   button.tsx → Button/Button.tsx + Button/index.ts
 *   sonner.tsx → Sonner/Sonner.tsx + Sonner/index.ts
 */

import { readdir, readFile, rename, mkdir, writeFile, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const UI_DIR = "src/shared/ui";

/**
 * ファイル名をPascalCaseに変換
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * ファイルからexport文を解析してエクスポート名を抽出
 */
function extractExports(content: string): string[] {
  const exports: string[] = [];

  // named exports: export { Foo, Bar }
  const namedExportRegex = /export\s*\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(",")
      .map((name) => {
        // "Foo as Bar" の場合は "Bar" を取得
        const parts = name.trim().split(/\s+as\s+/);
        return parts[parts.length - 1].trim();
      })
      .filter((name) => name.length > 0);
    exports.push(...names);
  }

  // export function/const/class: export function Foo() / export const Foo = / export class Foo
  const directExportRegex = /export\s+(?:function|const|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  while ((match = directExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return exports;
}

/**
 * index.ts の内容を生成
 */
function generateIndexContent(componentName: string, exports: string[]): string {
  if (exports.length === 0) {
    return `export * from "./${componentName}";\n`;
  }
  return `export { ${exports.join(", ")} } from "./${componentName}";\n`;
}

/**
 * フラットな.tsxファイルをディレクトリ構造に変換
 */
async function organizeComponent(filePath: string, fileName: string): Promise<void> {
  const { name } = parse(fileName);
  const pascalName = toPascalCase(name);
  const dirPath = join(UI_DIR, pascalName);
  const newFilePath = join(dirPath, `${pascalName}.tsx`);
  const indexPath = join(dirPath, "index.ts");

  // ファイル内容を読み取ってエクスポートを解析
  const content = await readFile(filePath, "utf-8");
  const exports = extractExports(content);

  // ディレクトリを作成
  await mkdir(dirPath, { recursive: true });

  // ファイルを移動（リネーム）
  await rename(filePath, newFilePath);

  // index.tsを生成
  const indexContent = generateIndexContent(pascalName, exports);
  await writeFile(indexPath, indexContent);

  console.log(`✅ ${fileName} → ${pascalName}/${pascalName}.tsx`);
  console.log(`   exports: ${exports.length > 0 ? exports.join(", ") : "(wildcard export)"}`);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  console.log("📁 shadcn/ui コンポーネントを整理中...\n");

  const entries = await readdir(UI_DIR);
  let processedCount = 0;

  for (const entry of entries) {
    const entryPath = join(UI_DIR, entry);
    const entryStat = await stat(entryPath);

    // ディレクトリはスキップ（既に整理済みのコンポーネント）
    if (entryStat.isDirectory()) {
      continue;
    }

    // .tsxファイルのみ処理
    if (!entry.endsWith(".tsx")) {
      continue;
    }

    await organizeComponent(entryPath, entry);
    processedCount++;
  }

  if (processedCount === 0) {
    console.log("整理が必要なファイルはありません。");
  } else {
    console.log(`\n✨ ${processedCount}件のコンポーネントを整理しました。`);
  }
}

main().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});

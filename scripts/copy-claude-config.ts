/**
 * .claude 配下のファイルを指定パスにコピーするスクリプト
 * settings.local.json は除外される
 *
 * 使用例:
 *   bun run claude:copy /path/to/destination
 */

import { cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, "..");
const SOURCE_DIR = join(PROJECT_ROOT, ".claude");

const EXCLUDE_FILES = ["settings.local.json"];

function shouldExclude(relativePath: string): boolean {
  return EXCLUDE_FILES.some(
    (exclude) => relativePath === exclude || relativePath.endsWith(`/${exclude}`),
  );
}

function copyDir(src: string, dest: string, baseDir: string): number {
  let count = 0;
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    const rel = relative(baseDir, srcPath);

    if (shouldExclude(rel)) {
      console.log(`  スキップ: ${rel}`);
      continue;
    }

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, baseDir);
    } else {
      cpSync(srcPath, destPath, { recursive: true });
      console.log(`  コピー: ${rel}`);
      count++;
    }
  }

  return count;
}

function main(): void {
  const dest = process.argv[2];

  if (!dest) {
    console.log("使用方法: bun run claude:copy <destination>");
    console.log("例: bun run claude:copy ../other-project/.claude");
    process.exit(1);
  }

  if (!existsSync(SOURCE_DIR) || !statSync(SOURCE_DIR).isDirectory()) {
    console.error("エラー: .claude ディレクトリが見つかりません");
    process.exit(1);
  }

  console.log(`📁 コピー元: ${SOURCE_DIR}`);
  console.log(`📁 コピー先: ${dest}\n`);

  const count = copyDir(SOURCE_DIR, dest, SOURCE_DIR);

  console.log(`\n✅ ${count} ファイルをコピーしました`);
}

main();

/**
 * shadcn/ui コンポーネント追加のラッパースクリプト
 *
 * 使用例:
 *   bun run ui:add button
 *   bun run ui:add card dialog
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * コマンドを実行して終了を待つ
 */
function runCommand(command: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        TS_NODE_PROJECT: "tsconfig.app.json",
      },
    });

    proc.on("close", (code) => {
      resolve(code ?? 0);
    });

    proc.on("error", (error) => {
      reject(error);
    });
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("使用方法: bun run ui:add <component> [component...]");
    console.log("例: bun run ui:add button");
    console.log("例: bun run ui:add card dialog accordion");
    process.exit(1);
  }

  console.log(`📦 shadcn/ui コンポーネントを追加中: ${args.join(", ")}\n`);

  // shadcn add を実行
  const shadcnExitCode = await runCommand("bun", ["shadcn", "add", ...args]);

  if (shadcnExitCode !== 0) {
    console.error("\n❌ shadcn add に失敗しました");
    process.exit(shadcnExitCode);
  }

  console.log("\n📁 ディレクトリ構造を整理中...\n");

  // organize-ui.ts を実行
  const organizeScript = join(__dirname, "organize-ui.ts");
  const organizeExitCode = await runCommand("bun", ["run", organizeScript]);

  if (organizeExitCode !== 0) {
    console.error("\n❌ ディレクトリ整理に失敗しました");
    process.exit(organizeExitCode);
  }

  console.log("\n🎉 完了しました！");
}

main().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});

import * as fs from "node:fs";
import * as path from "node:path";

import { Command } from "commander";
import * as esbuild from "esbuild";
import * as v from "valibot";

process.chdir(path.join(import.meta.dirname, ".."));

const command = new Command();

command
  .name(import.meta.filename)
  .description("ビルドします。")
  .option("--clean", "既に作成されたファイルを削除します。")
  .option("--watch", "監視する場合、指定します。")
  .action(async function (options) {
    const DISTRIBUTIONS_DIRECTORY_NAME = "distributions";
    const SOURCE_CODE_DIRECTORY_NAME = "source-code";

    const { clean, watch } = v.parse(
      v.object({ clean: v.optional(v.boolean()), watch: v.optional(v.boolean()) }),
      options,
    );

    const packageInformation = v.parse(
      v.object({ peerDependencies: v.record(v.string(), v.string()) }),
      JSON.parse(fs.readFileSync("package.json", "utf8")),
    );

    const externalPackageNames = Array.from(Object.keys(packageInformation.peerDependencies));

    const buildOptions = {
      bundle: true,
      entryPoints: [
        {
          in: path.join(SOURCE_CODE_DIRECTORY_NAME, "index.ts"),
          out: "index",
        },
      ],
      external: externalPackageNames,
      logLevel: "verbose",
      minify: true,
      preserveSymlinks: true,
      sourcemap: true,
      treeShaking: true,
    } satisfies esbuild.BuildOptions;

    const targets = [
      {
        format: "cjs",
        outdir: path.join(DISTRIBUTIONS_DIRECTORY_NAME, "node"),
        platform: "node",
        target: "node22",
      },
      {
        format: "esm",
        outdir: path.join(DISTRIBUTIONS_DIRECTORY_NAME, "browser"),
        platform: "browser",
        target: "es2024",
      },
    ] satisfies Array<esbuild.BuildOptions>;

    if (clean && fs.existsSync(DISTRIBUTIONS_DIRECTORY_NAME)) {
      fs.rmSync(DISTRIBUTIONS_DIRECTORY_NAME, { recursive: true });
    }

    if (watch) {
      const contexts: Array<esbuild.BuildContext> = [];
      const { promise, resolve } = Promise.withResolvers();

      async function unsubscribe() {
        for (const context of contexts) {
          await context.dispose();
        }
        resolve(undefined);
      }

      process.on("SIGINT", unsubscribe).on("SIGTERM", unsubscribe);

      for (const target of targets) {
        const context = await esbuild.context({ ...buildOptions, ...target });
        contexts.push(context);
        await context.watch();
      }

      // 終了を待つ。
      await promise;
    } else {
      for (const target of targets) {
        await esbuild.build({ ...buildOptions, ...target });
      }
    }
  });

await command.parse();

import * as path from "node:path";

import { Command } from "commander";
import * as esbuild from "esbuild";
import * as v from "valibot";

process.chdir(path.join(import.meta.dirname, ".."));

const command = new Command();

command
  .name(import.meta.filename)
  .description("ビルドします。")
  .option("--watch", "監視する場合、指定します。")
  .action(async function (options) {
    const EXTERNAL_PACKAGE_NAMES = ["firebase-admin", "firebase-functions"];
    const DISTRIBUTION_DIRECTORY_NAME = "distribution";
    const SOURCE_CODE_DIRECTORY_NAME = "source-code";

    const optionsSchema = v.object({
      watch: v.optional(v.boolean()),
    });

    const { watch } = v.parse(optionsSchema, options);

    const buildOptions = {
      bundle: true,
      entryPoints: {
        in: path.join(SOURCE_CODE_DIRECTORY_NAME, "firestore", "index.ts"),
        out: "firestore.js",
      },
      external: EXTERNAL_PACKAGE_NAMES,
      logLevel: "verbose",
      minify: true,
      outdir: DISTRIBUTION_DIRECTORY_NAME,
      platform: "node",
      preserveSymlinks: true,
      sourcemap: true,
      target: "node22",
      treeShaking: true,
    } satisfies esbuild.BuildOptions;

    if (watch) {
      const { promise, resolve } = Promise.withResolvers();
      const context = await esbuild.context(buildOptions);

      async function unsubscribe() {
        await context.dispose();
        resolve(undefined);
      }

      process.on("SIGINT", unsubscribe).on("SIGTERM", unsubscribe);

      await context.watch();

      // 終了を待つ。
      await promise;
    } else {
      await esbuild.build(buildOptions);
    }
  });

await command.parse();

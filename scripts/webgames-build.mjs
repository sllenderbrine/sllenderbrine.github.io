import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
    entryPoints: ["src/projects/webgames/main.ts"],
    bundle: true,
    format: "esm",
    outfile: "projects/webgames/main.js",
    sourcemap: true,
    target: "es2020",
});

if (watch) {
    console.log("Watching webgames...");
    await ctx.watch();
} else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("Webgames build complete.");
}
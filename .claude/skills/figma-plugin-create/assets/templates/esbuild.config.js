const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const watch = process.argv.includes("--watch");

// Build the main plugin code (runs in Figma sandbox)
const mainBuild = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "dist/code.js",
  target: "es2020",
  format: "iife",
  logLevel: "info",
};

// Build the UI code (runs in iframe) — only if ui.ts exists
const uiExists = fs.existsSync(path.join(__dirname, "src", "ui.ts"));
const uiBuild = uiExists
  ? {
      entryPoints: ["src/ui.ts"],
      bundle: true,
      outfile: "dist/ui.js",
      target: "es2020",
      format: "iife",
      logLevel: "info",
    }
  : null;

// Generate ui.html that includes the bundled JS
function generateUIHtml() {
  if (!uiExists) return;
  const uiJs = fs.readFileSync("dist/ui.js", "utf8");
  const template = fs.readFileSync("ui.html", "utf8");
  const html = template.replace("<!-- INJECT_JS -->", `<script>${uiJs}</script>`);
  fs.writeFileSync("dist/ui.html", html);
}

async function build() {
  if (watch) {
    const mainCtx = await esbuild.context(mainBuild);
    await mainCtx.watch();

    if (uiBuild) {
      const uiCtx = await esbuild.context({
        ...uiBuild,
        plugins: [
          {
            name: "generate-ui-html",
            setup(build) {
              build.onEnd(() => generateUIHtml());
            },
          },
        ],
      });
      await uiCtx.watch();
    }

    console.log("Watching for changes...");
  } else {
    await esbuild.build(mainBuild);
    if (uiBuild) {
      await esbuild.build(uiBuild);
      generateUIHtml();
    }
    console.log("Build complete.");
  }
}

build().catch(() => process.exit(1));

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const requiredFiles = [
	"dist/easy-date-range.js",
	"dist/easy-date-range.umd.cjs",
	"dist/index.d.ts",
	"README.md",
	"LICENSE",
	"package.json",
];
const npmCache = join(tmpdir(), "easy-date-range-npm-cache");

const packOutput = execFileSync("npm", ["pack", "--dry-run", "--json"], {
	encoding: "utf8",
	env: {
		...process.env,
		NPM_CONFIG_CACHE: npmCache,
		npm_config_cache: npmCache,
	},
});

const [packInfo] = JSON.parse(packOutput);
const packedFiles = new Set(packInfo.files.map((file) => file.path));

for (const file of requiredFiles) {
	if (!packedFiles.has(file)) {
		throw new Error(`Package smoke check failed. Missing file: ${file}`);
	}
}

const esm = await import("../dist/easy-date-range.js");
if (typeof esm.DateRange !== "function") {
	throw new Error("Package smoke check failed. ESM DateRange export is missing.");
}

const require = createRequire(import.meta.url);
const cjs = require("../dist/easy-date-range.umd.cjs");
if (typeof cjs.DateRange !== "function") {
	throw new Error("Package smoke check failed. CJS DateRange export is missing.");
}

const esmRangeLength = new esm.DateRange().getWeek().dateTimes.length;
const cjsRangeLength = new cjs.DateRange().getDays().dateTimes.length;

if (esmRangeLength !== 7 || cjsRangeLength !== 1) {
	throw new Error("Package smoke check failed. Runtime imports are invalid.");
}

console.log("Package smoke check passed.");

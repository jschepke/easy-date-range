/// <reference types="vitest" />

import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

emptyDir(resolve(__dirname, "dist"));

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			fileName: "easy-date-range",
			name: "easy-date-range",
		},
		rollupOptions: {
			external: ["luxon"],
		},
	},
	plugins: [dts()],
	test: {
		coverage: {
			reportsDirectory: "tests/coverage",
		},
	},
});

function emptyDir(dir: string): void {
	if (!existsSync(dir)) {
		return;
	}

	for (const file of readdirSync(dir)) {
		const abs = resolve(dir, file);

		// baseline is Node 12 so can't use rmSync
		if (lstatSync(abs).isDirectory()) {
			emptyDir(abs);
			rmdirSync(abs);
		} else {
			unlinkSync(abs);
		}
	}
}

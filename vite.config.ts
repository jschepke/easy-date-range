/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			fileName: "easy-date-range",
			name: "easy-date-range",
		},
		rollupOptions: {
			external: ["luxon"],
			output: {
				globals: {
					luxon: "luxon",
				},
			},
		},
	},
	plugins: [dts()],
	test: {
		coverage: {
			reportsDirectory: "tests/coverage",
		},
	},
});

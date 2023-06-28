/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: { entry: resolve(__dirname, "src/index.ts"), name: "easy-date-range" },
		rollupOptions: {
			external: ["luxon"],
			output: {
				globals: {
					luxon: "DateTime",
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

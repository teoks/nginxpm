import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import "vitest/config";
import { execFileSync } from "node:child_process";

const runLocaleScripts = () => {
	try {
		const out1 = execFileSync("yarn", ["locale-compile"], { encoding: "utf-8" });
		if (out1) console.log(out1);
		const out2 = execFileSync("yarn", ["locale-sort"], { encoding: "utf-8" });
		if (out2) console.log(out2);
	} catch (error) {
		console.error("Failed to run locale scripts:", error);
	}
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		{
			name: 'run-on-start',
			configureServer(_server) {
				if (!process.env.VITEST) {
					runLocaleScripts();
				}
			},
		},
		{
			name: "trigger-on-reload",
			configureServer(server) {
				if (!process.env.VITEST) {
					server.watcher.on("change", (file) => {
						if (file.includes("locale/src")) {
							console.log(`File changed: ${file}, running locale scripts...`);
							runLocaleScripts();
						}
					});
				}
			},
		},
		react(),
		checker({
			// e.g. use TypeScript check
			typescript: true,
		}),
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		allowedHosts: true,
	},
	test: {
		environment: "happy-dom",
		setupFiles: ["./vitest-setup.js"],
	},
	assetsInclude: ["**/*.md", "**/*.png", "**/*.svg"],
});

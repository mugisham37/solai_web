import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["./tests/integration/setup.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
    // Requests against the same backend/account can trip real rate limits
    // if run concurrently — see Redis-backed limits in solai_server.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

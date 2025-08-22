import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                dashboard: resolve(__dirname, "./src/views/dashboard.html"),
                auth: resolve(__dirname, "./src/views/auth.html"),
            },
        },
    },
});

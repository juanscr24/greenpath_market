import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "./src/views/login.html"),
                register: resolve(__dirname, "./src/views/register.html"),
                dashboard: resolve(__dirname, "./src/views/dashboard.html"),
            },
        },
    },
});

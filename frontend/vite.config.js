import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                auth: resolve(__dirname, "./src/views/auth.html"),
                dashboard: resolve(__dirname, "./src/views/dashboard.html"),
                ofers: resolve(__dirname, "./src/views/ofers.html"),
                profile: resolve(__dirname, "./src/views/profile.html"),
                shoppingCard: resolve(__dirname, "./src/views/shopping_card.html")
            },
        },
    },
});

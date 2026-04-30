import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    css: {
        devSourcemap: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                add: resolve(__dirname, "login.html"),
                about: resolve(__dirname, "register.html")
            }
        }
    }
});
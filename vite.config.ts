// Configura la compilación de la aplicación React y su publicación bajo la ruta base del proyecto.

import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/rule-the-realm/",
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
    ],
});

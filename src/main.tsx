import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Tokens de diseño.
import "./styles/tokens/colours.css";
import "./styles/tokens/fonts.css";
import "./styles/tokens/spacing.css";
import "./styles/tokens/sizes.css";
import "./styles/tokens/effects.css";

// Estilos globales.
import "./styles/base/global.css";

// Estilos compartidos.
import "./styles/shared/Buttons.css";
import "./styles/shared/Panels.css";
import "./styles/shared/Toast.css";

// Aplicación y estilos particulares.
import App from "./App.tsx";

// Adaptaciones a cada tamaño de pantalla.
import "./styles/base/responsive.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

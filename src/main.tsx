import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./utils/colours.css";
import "./utils/fonts.css";
import "./utils/spacing.css";
import "./utils/sizes.css";
import "./utils/effects.css";

import "./styles/base/global.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

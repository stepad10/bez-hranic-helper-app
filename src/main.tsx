/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";

import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";

render(
    () => (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    ),
    document.getElementById("root")!,
);

import { createContext, useContext, createSignal, createEffect, type ParentProps, untrack } from "solid-js";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
    theme: () => Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: () => "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider(props: ParentProps<{ defaultTheme?: Theme; storageKey?: string }>) {
    const [theme, setTheme] = createSignal<Theme>(
        untrack(() => (localStorage.getItem(props.storageKey || "vite-ui-theme") as Theme) || props.defaultTheme || "system"),
    );

    createEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme() === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme());
    });

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(props.storageKey || "vite-ui-theme", theme);
            setTheme(theme);
        },
    };

    return <ThemeProviderContext.Provider value={value}>{props.children}</ThemeProviderContext.Provider>;
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};

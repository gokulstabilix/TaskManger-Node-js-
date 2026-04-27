import { useState, useEffect } from "react";

/**
 * Custom hook to manage dark mode.
 *
 * How it works:
 * 1. On first load, checks localStorage for a saved preference.
 * 2. If nothing is saved, falls back to the user's system preference.
 * 3. Toggles a "dark" class on the <html> element so Tailwind's
 *    dark: variants and our custom CSS variables both work.
 * 4. Persists the choice to localStorage so it survives page reloads.
 *
 * Usage:
 *   const [isDark, toggleDark] = useDarkMode();
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";

    // 2. Fall back to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Persist choice
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return [isDark, toggleDark];
}

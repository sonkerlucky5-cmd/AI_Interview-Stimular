import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("nexa_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    } catch {
      // Fallback for SSR or restricted localStorage
    }
    return "dark";
  });

  // Keep DOM attribute in sync
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem("nexa_theme", theme);
    } catch {
      // LocalStorage access restricted
    }
  }, [theme]);

  // Listen to OS system theme changes automatically
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemChange = (e) => {
      try {
        const manual = localStorage.getItem("nexa_theme_manual");
        if (!manual) {
          setTheme(e.matches ? "light" : "dark");
        }
      } catch {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handleSystemChange);
      return () => mq.removeEventListener("change", handleSystemChange);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("nexa_theme_manual", "true");
      } catch {
        // LocalStorage access restricted
      }
      return next;
    });
  };

  const handleSetTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      try {
        localStorage.setItem("nexa_theme_manual", "true");
      } catch {
        // LocalStorage access restricted
      }
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;

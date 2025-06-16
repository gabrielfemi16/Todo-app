import { ReactNode, useEffect, useState } from "react";
import ThemeContext, { Theme } from "./ThemeContext";
//This defines that ThemeProvider must receive childern (any JSX element) to wrap inside the context provider

interface ThemeProviderProps {
  children: ReactNode;
  //represent all of the things React can render.
}

//wrap your whole app and gives it access to theme data.
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  //the theme is a function - it gets the theme value fro localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

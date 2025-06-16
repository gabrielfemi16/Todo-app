import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

//themecontext with an initail value of null
const ThemeContext = createContext<ThemeContextType | null>(null);

//now, instead of doing useContext(ThemeContext) everywhere, you just call useTheme() - clean and reusable.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeContext;

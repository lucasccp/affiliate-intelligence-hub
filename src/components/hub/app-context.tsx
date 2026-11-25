import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { HubData } from "@/lib/hub.functions";
type Context = {
  data: HubData;
  selectedId: string;
  setSelectedId: (id: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};
const AppContext = createContext<Context | null>(null);
export function AppProvider({ data, children }: { data: HubData; children: ReactNode }) {
  const [selectedId, setSelectedId] = useState("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const value =
      data.profile.theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : data.profile.theme;
    setTheme(value === "dark" ? "dark" : "light");
  }, [data.profile.theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(() => {
    if (selectedId !== "all" && !data.communities.some((c) => c.id === selectedId))
      setSelectedId("all");
  }, [data.communities, selectedId]);
  return (
    <AppContext.Provider value={{ data, selectedId, setSelectedId, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
export function useHub() {
  const context = useContext(AppContext);
  if (!context) throw new Error("Contexto do workspace indisponível");
  return context;
}

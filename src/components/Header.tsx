"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToTemplates = () => {
    document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="glass max-w-6xl mx-auto rounded-full px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-vesak-gold)] to-[var(--color-vesak-orange)] flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)] animate-pulse">
            <span className="text-white text-sm font-bold text-center">☸</span>
          </div>
          <h1 className="font-bold text-base sm:text-lg block tracking-wide">
            <span className="text-gradient">Vesak</span> Card Maker
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={scrollToTemplates}
            className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity px-4 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            Templates
          </button>
          
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground transition-colors cursor-pointer border border-transparent hover:border-[var(--glass-border)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-[var(--color-vesak-gold)]" />
              ) : (
                <Moon size={20} className="text-indigo-900" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}


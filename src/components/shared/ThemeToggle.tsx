"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-10 h-10" />;
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-300 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-green-500"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 0 : 1,
            rotate: theme === "dark" ? 90 : 0,
            opacity: theme === "dark" ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -90,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.button>
  );
}

"use client"

import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("metro-theme")
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    return savedTheme || (prefersDark ? "dark" : "light")
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      localStorage.setItem("metro-theme", newTheme)
      return newTheme
    })
  }

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme)
    if (theme === "dark") {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

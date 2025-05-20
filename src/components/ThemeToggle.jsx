"use client"

import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { FiSun, FiMoon } from "react-icons/fi"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const isDark = theme === "dark"

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="toggle-icon-wrapper">
        {isDark ? <FiSun className="toggle-icon sun" /> : <FiMoon className="toggle-icon moon" />}
      </div>
      <span className="toggle-text">{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}

export default ThemeToggle

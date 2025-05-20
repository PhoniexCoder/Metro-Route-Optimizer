import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Wait for the DOM to be fully loaded before rendering
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root")

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } else {
    console.error("Could not find root element to mount React app")
  }
})

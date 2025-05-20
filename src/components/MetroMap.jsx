"use client"

import { useEffect, useRef, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { metroData } from "../data/metroData"

const MetroMap = ({ city, route }) => {
  const canvasRef = useRef(null)
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cityData = metroData[city]
    if (!cityData) {
      console.error(`No data found for city: ${city}`)
      return
    }

    // Check if required properties exist
    if (!cityData.stations || !cityData.lines || !cityData.stationCoordinates) {
      console.error(`Missing required data for city: ${city}`)
      return
    }

    // Set canvas dimensions with higher resolution for better display
    const scale = window.devicePixelRatio || 1
    canvas.width = 800 * scale
    canvas.height = 600 * scale
    ctx.scale(scale, scale)
    canvas.style.width = "800px"
    canvas.style.height = "600px"

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw metro lines and stations
    drawMetroMap(ctx, cityData, route, theme)
  }, [city, route, theme])

  const drawMetroMap = (ctx, cityData, highlightedRoute, currentTheme) => {
    const { stations, lines, stationCoordinates } = cityData
    const isDark = currentTheme === "dark"

    // Draw background
    ctx.fillStyle = isDark ? "#1a1a1a" : "#f8fafc"
    ctx.fillRect(0, 0, 800, 600)

    // Draw grid lines (light)
    ctx.strokeStyle = isDark ? "#333333" : "#e2e8f0"
    ctx.lineWidth = 1
    for (let i = 0; i < 800; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 600)
      ctx.stroke()
    }
    for (let i = 0; i < 600; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(800, i)
      ctx.stroke()
    }

    // Draw metro lines
    if (Array.isArray(lines)) {
      lines.forEach((line) => {
        if (!line || !line.color) return

        ctx.beginPath()
        ctx.strokeStyle = line.color
        ctx.lineWidth = 6
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (Array.isArray(line.stations)) {
          let validStationsFound = false

          line.stations.forEach((station, index) => {
            const coords = stationCoordinates[station]
            if (!coords) return // Skip stations without coordinates

            if (index === 0) {
              ctx.moveTo(coords.x, coords.y)
            } else {
              ctx.lineTo(coords.x, coords.y)
            }
            validStationsFound = true
          })

          if (validStationsFound) {
            ctx.stroke()
          }
        }
      })
    }

    // Draw highlighted route if available
    if (Array.isArray(highlightedRoute) && highlightedRoute.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#10b981" // Emerald color
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      let validRouteFound = false

      highlightedRoute.forEach((station, index) => {
        const coords = stationCoordinates[station]
        if (!coords) return

        if (index === 0) {
          ctx.moveTo(coords.x, coords.y)
        } else {
          ctx.lineTo(coords.x, coords.y)
        }
        validRouteFound = true
      })

      if (validRouteFound) {
        ctx.stroke()
      }
    }

    // Draw stations
    if (Array.isArray(stations)) {
      stations.forEach((station) => {
        const coords = stationCoordinates[station]
        if (!coords) return // Skip stations without coordinates

        const isHighlighted = Array.isArray(highlightedRoute) && highlightedRoute.includes(station)
        const isEndpoint = station === highlightedRoute[0] || station === highlightedRoute[highlightedRoute.length - 1]

        // Station circle
        ctx.beginPath()
        ctx.fillStyle = isEndpoint
          ? station === highlightedRoute[0]
            ? "#10b981"
            : "#ef4444"
          : isHighlighted
            ? "#10b981"
            : isDark
              ? "#333333"
              : "#ffffff"
        ctx.strokeStyle = isDark ? "#ffffff" : "#000000"
        ctx.lineWidth = 1.5
        ctx.arc(coords.x, coords.y, isHighlighted ? 8 : 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Station label with background for better readability
        const label = station
        ctx.font = isHighlighted ? "bold 12px Arial" : "12px Arial"
        const textWidth = ctx.measureText(label).width

        // Label background
        ctx.fillStyle = isDark ? "rgba(26, 26, 26, 0.8)" : "rgba(255, 255, 255, 0.8)"
        ctx.fillRect(coords.x - textWidth / 2 - 2, coords.y + 10, textWidth + 4, 16)

        // Label text
        ctx.fillStyle = isHighlighted ? "#10b981" : isDark ? "#ffffff" : "#000000"
        ctx.textAlign = "center"
        ctx.fillText(label, coords.x, coords.y + 22)
      })
    }

    // Draw legend
    if (Array.isArray(lines) && lines.length > 0) {
      drawLegend(ctx, lines, Array.isArray(highlightedRoute) && highlightedRoute.length > 1, isDark)
    }
  }

  const drawLegend = (ctx, lines, showRoute, isDark) => {
    const startX = 650
    const startY = 50
    const boxHeight = 25 * (lines.length + (showRoute ? 1 : 0)) + 30

    // Legend background
    ctx.fillStyle = isDark ? "rgba(26, 26, 26, 0.9)" : "rgba(255, 255, 255, 0.9)"
    ctx.strokeStyle = isDark ? "#444444" : "#e2e8f0"
    ctx.lineWidth = 1
    ctx.fillRect(startX - 10, startY - 30, 150, boxHeight)
    ctx.strokeRect(startX - 10, startY - 30, 150, boxHeight)

    // Legend title
    ctx.fillStyle = isDark ? "#ffffff" : "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Metro Lines:", startX, startY - 10)

    // Draw line entries
    lines.forEach((line, index) => {
      if (!line || !line.name || !line.color) return

      const y = startY + index * 25

      // Line color
      ctx.beginPath()
      ctx.strokeStyle = line.color
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + 30, y)
      ctx.stroke()

      // Line name
      ctx.fillStyle = isDark ? "#ffffff" : "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(line.name, startX + 40, y + 4)
    })

    // Add selected route to legend if available
    if (showRoute) {
      const y = startY + lines.length * 25

      // Route line
      ctx.beginPath()
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + 30, y)
      ctx.stroke()

      // Route label
      ctx.fillStyle = isDark ? "#ffffff" : "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Selected Route", startX + 40, y + 4)
    }
  }

  return (
    <div className="card map-card">
      <div className="card-header">
        <h2 className="card-title">{city} Metro Map</h2>
      </div>
      <div className="card-content">
        <div className="map-container">
          <canvas ref={canvasRef} className="metro-map" />
        </div>
      </div>
    </div>
  )
}

export default MetroMap

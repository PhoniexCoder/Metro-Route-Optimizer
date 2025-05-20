"use client"

import { useEffect, useRef, useContext, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { metroData } from "../data/metroData"
import { FiX } from "react-icons/fi"

const CityMetroMap = ({
  city,
  onStationSelect,
  route,
  sourceStation: externalSource,
  destinationStation: externalDestination,
  onAddIntermediateStation,
}) => {
  const canvasRef = useRef(null)
  const { theme } = useContext(ThemeContext)
  const [sourceStation, setSourceStation] = useState(null)
  const [destinationStation, setDestinationStation] = useState(null)
  const [hoveredStation, setHoveredStation] = useState(null)
  const [stationPositions, setStationPositions] = useState({})
  const [intermediateStations, setIntermediateStations] = useState([])

  // Reset selections when city changes
  useEffect(() => {
    setSourceStation(null)
    setDestinationStation(null)
    setHoveredStation(null)
    setIntermediateStations([])
  }, [city])

  // Sync with external source and destination props
  useEffect(() => {
    if (externalSource !== undefined) {
      setSourceStation(externalSource || null)
    }
  }, [externalSource])

  useEffect(() => {
    if (externalDestination !== undefined) {
      setDestinationStation(externalDestination || null)
    }
  }, [externalDestination])

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
    drawMetroMap(
      ctx,
      cityData,
      sourceStation,
      destinationStation,
      theme,
      hoveredStation,
      route?.path,
      intermediateStations,
    )

    // Store station positions for click detection
    const positions = {}
    cityData.stations.forEach((station) => {
      const coords = cityData.stationCoordinates[station]
      if (coords) {
        positions[station] = { x: coords.x, y: coords.y }
      }
    })
    setStationPositions(positions)

    // Add click event listener
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width / scale)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height / scale)

      // Check if click is on a station
      let clickedStation = null
      for (const station in positions) {
        const pos = positions[station]
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        if (distance <= 15) {
          // Increased click area for better UX
          clickedStation = station
          break
        }
      }

      if (clickedStation) {
        // If both source and destination are already set, add as intermediate station
        if (sourceStation && destinationStation) {
          // Don't add if it's already the source or destination
          if (clickedStation !== sourceStation && clickedStation !== destinationStation) {
            // Don't add if it's already an intermediate station
            if (!intermediateStations.includes(clickedStation)) {
              const newIntermediateStations = [...intermediateStations, clickedStation]
              setIntermediateStations(newIntermediateStations)

              // Notify parent component about the intermediate station
              if (onAddIntermediateStation) {
                onAddIntermediateStation(clickedStation, sourceStation, destinationStation, newIntermediateStations)
              }
            }
          }
        } else if (!sourceStation) {
          // Set as source if no source is selected
          setSourceStation(clickedStation)
          if (onStationSelect) {
            onStationSelect(clickedStation, null)
          }
        } else if (!destinationStation && clickedStation !== sourceStation) {
          // Set as destination if source is selected but no destination
          setDestinationStation(clickedStation)
          if (onStationSelect) {
            onStationSelect(sourceStation, clickedStation)
          }
        }
      }
    }

    // Add mousemove event listener for hover effects
    const handleCanvasMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width / scale)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height / scale)

      // Check if mouse is over a station
      let station = null
      for (const stationName in positions) {
        const pos = positions[stationName]
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        if (distance <= 12) {
          station = stationName
          break
        }
      }

      if (station !== hoveredStation) {
        setHoveredStation(station)
      }
    }

    // Add mouseout event listener to reset hover state
    const handleCanvasMouseOut = () => {
      setHoveredStation(null)
    }

    canvas.addEventListener("click", handleCanvasClick)
    canvas.addEventListener("mousemove", handleCanvasMouseMove)
    canvas.addEventListener("mouseout", handleCanvasMouseOut)

    return () => {
      canvas.removeEventListener("click", handleCanvasClick)
      canvas.removeEventListener("mousemove", handleCanvasMouseMove)
      canvas.removeEventListener("mouseout", handleCanvasMouseOut)
    }
  }, [
    city,
    theme,
    sourceStation,
    destinationStation,
    hoveredStation,
    onStationSelect,
    route,
    intermediateStations,
    onAddIntermediateStation,
  ])

  // Redraw the map when any of these values change
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cityData = metroData[city]
    if (!cityData) return

    drawMetroMap(
      ctx,
      cityData,
      sourceStation,
      destinationStation,
      theme,
      hoveredStation,
      route?.path,
      intermediateStations,
    )
  }, [city, sourceStation, destinationStation, hoveredStation, theme, route, intermediateStations])

  const drawMetroMap = (
    ctx,
    cityData,
    source,
    destination,
    currentTheme,
    hoverStation = null,
    routePath = null,
    intermediateStations = [],
  ) => {
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
    if (Array.isArray(routePath) && routePath.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#10b981" // Emerald color
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      let validRouteFound = false

      routePath.forEach((station, index) => {
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

        const isSource = station === source
        const isDestination = station === destination
        const isHovered = station === hoverStation
        const isOnRoute = Array.isArray(routePath) && routePath.includes(station)
        const isIntermediate = intermediateStations.includes(station)
        const isSelected = isSource || isDestination || isIntermediate

        // Draw hover effect for interactive feedback
        if (isHovered && !isSelected) {
          ctx.beginPath()
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
          ctx.arc(coords.x, coords.y, 15, 0, Math.PI * 2)
          ctx.fill()
        }

        // Station circle
        ctx.beginPath()
        ctx.fillStyle = isSource
          ? "#6366f1" // Primary color for source
          : isDestination
            ? "#f43f5e" // Accent color for destination
            : isIntermediate
              ? "#f59e0b" // Warning color for intermediate
              : isOnRoute
                ? "#10b981" // Emerald for route
                : isDark
                  ? "#333333"
                  : "#ffffff"
        ctx.strokeStyle = isDark ? "#ffffff" : "#000000"
        ctx.lineWidth = isSelected || isHovered ? 2.5 : 1.5
        ctx.arc(coords.x, coords.y, isSelected ? 10 : isHovered ? 8 : isOnRoute ? 8 : 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Station label with background for better readability
        const label = station
        ctx.font = isSelected || isHovered || isOnRoute ? "bold 12px Arial" : "12px Arial"
        const textWidth = ctx.measureText(label).width

        // Label background
        ctx.fillStyle = isDark ? "rgba(26, 26, 26, 0.8)" : "rgba(255, 255, 255, 0.8)"
        ctx.fillRect(coords.x - textWidth / 2 - 2, coords.y + 12, textWidth + 4, 16)

        // Label text
        ctx.fillStyle = isSource
          ? "#6366f1" // Primary color for source
          : isDestination
            ? "#f43f5e" // Accent color for destination
            : isIntermediate
              ? "#f59e0b" // Warning color for intermediate
              : isOnRoute
                ? "#10b981" // Emerald for route
                : isDark
                  ? "#ffffff"
                  : "#000000"
        ctx.textAlign = "center"
        ctx.fillText(label, coords.x, coords.y + 24)
      })
    }

    // Draw legend
    if (Array.isArray(lines) && lines.length > 0) {
      drawLegend(ctx, lines, routePath && routePath.length > 1, isDark, intermediateStations.length > 0)
    }

    // Draw selection instructions
    drawSelectionInstructions(ctx, isDark, source, destination, intermediateStations)
  }

  const drawLegend = (ctx, lines, hasRoute, isDark, hasIntermediates) => {
    const startX = 650
    const startY = 50
    const extraEntries = (hasRoute ? 1 : 0) + (hasIntermediates ? 1 : 0)
    const boxHeight = 25 * (lines.length + extraEntries) + 30

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

    let extraY = startY + lines.length * 25

    // Add route indicator to the legend
    if (hasRoute) {
      ctx.beginPath()
      ctx.strokeStyle = "#10b981" // Emerald color
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.moveTo(startX, extraY)
      ctx.lineTo(startX + 30, extraY)
      ctx.stroke()

      ctx.fillStyle = isDark ? "#ffffff" : "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Suggested Route", startX + 40, extraY + 4)

      extraY += 25
    }

    // Add intermediate stations indicator to the legend
    if (hasIntermediates) {
      ctx.beginPath()
      ctx.strokeStyle = "#f59e0b" // Warning color
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.moveTo(startX, extraY)
      ctx.lineTo(startX + 30, extraY)
      ctx.stroke()

      ctx.fillStyle = isDark ? "#ffffff" : "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Via Stations", startX + 40, extraY + 4)
    }
  }

  const drawSelectionInstructions = (ctx, isDark, source, destination, intermediateStations = []) => {
    const startX = 20
    const startY = 30

    // Calculate height based on content
    let boxHeight = 70 // Default height

    if (source && !destination) {
      boxHeight = 70
    } else if (source && destination) {
      boxHeight = intermediateStations.length > 0 ? 120 : 100
    } else {
      boxHeight = 70
    }

    // Instructions background
    ctx.fillStyle = isDark ? "rgba(26, 26, 26, 0.9)" : "rgba(255, 255, 255, 0.9)"
    ctx.strokeStyle = isDark ? "#444444" : "#e2e8f0"
    ctx.lineWidth = 1
    ctx.fillRect(startX - 10, startY - 25, 300, boxHeight)
    ctx.strokeRect(startX - 10, startY - 25, 300, boxHeight)

    // Instructions title
    ctx.fillStyle = isDark ? "#ffffff" : "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Interactive Map:", startX, startY - 5)

    // Instructions text
    ctx.fillStyle = isDark ? "#cbd5e1" : "#475569"
    ctx.font = "12px Arial"

    if (!source) {
      ctx.fillText("• Click on a station to select source", startX, startY + 20)
    } else if (!destination) {
      ctx.fillText("• Source: " + source, startX, startY + 20)
      ctx.fillText("• Click on another station to select destination", startX, startY + 40)
    } else {
      ctx.fillText("• Source: " + source, startX, startY + 20)
      ctx.fillText("• Destination: " + destination, startX, startY + 40)

      if (intermediateStations.length > 0) {
        ctx.fillText("• Via: " + intermediateStations.join(", "), startX, startY + 60)
        ctx.fillText("• Click any station to add it as a via point", startX, startY + 80)
      } else {
        ctx.fillText("• Click any station to add it as a via point", startX, startY + 60)
      }
    }
  }

  const handleReset = () => {
    setSourceStation(null)
    setDestinationStation(null)
    setIntermediateStations([])
    if (onStationSelect) {
      onStationSelect(null, null)
    }
  }

  return (
    <div className="card map-card">
      <div className="card-header">
        <div className="map-header-content">
          <h2 className="card-title">{city} Metro Network</h2>
          {(sourceStation || destinationStation) && (
            <button className="map-reset-btn" onClick={handleReset} aria-label="Reset selection">
              <FiX /> Reset Selection
            </button>
          )}
        </div>
      </div>
      <div className="card-content">
        <div className="map-container">
          <canvas ref={canvasRef} className="metro-map" />
        </div>
      </div>
    </div>
  )
}

export default CityMetroMap

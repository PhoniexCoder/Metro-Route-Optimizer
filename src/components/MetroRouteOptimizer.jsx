"use client"

import { useState } from "react"
import RouteForm from "./RouteForm"
import RouteResults from "./RouteResults"
import CityMetroMap from "./CityMetroMap"
import { metroData } from "../data/metroData"
import { findRouteWithIntermediates } from "../utils/routeFinder"
import { FiAlertCircle, FiClock } from "react-icons/fi"

const MetroRouteOptimizer = () => {
  const [selectedCity, setSelectedCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [routeResults, setRouteResults] = useState(null)
  const [selectedRouteType, setSelectedRouteType] = useState("fastest")
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [sourceStation, setSourceStation] = useState("")
  const [destinationStation, setDestinationStation] = useState("")
  const [intermediateStations, setIntermediateStations] = useState([])

  // Add a handleCityChange function
  const handleCityChange = (city) => {
    try {
      // Validate that the city exists in our data
      if (!metroData[city]) {
        console.error(`City data not found for: ${city}`)
        setError(`Data for ${city} is not available`)
        return
      }

      // Validate that the city data has the required structure
      const cityData = metroData[city]
      if (!cityData.stations || !cityData.lines || !cityData.stationCoordinates || !cityData.graph) {
        console.error(`Invalid data structure for city: ${city}`)
        setError(`Data for ${city} is incomplete`)
        return
      }

      // If all checks pass, update the state
      setSelectedCity(city)
      setRouteResults(null)
      setError(null)
      setSourceStation("")
      setDestinationStation("")
      setIntermediateStations([])
    } catch (err) {
      console.error("Error changing city:", err)
      setError("An error occurred while loading city data")
    }
  }

  const handleFindRoute = (city, source, destination, viaStations = []) => {
    setSelectedCity(city)
    setIsLoading(true)
    setError(null)

    // Use the via stations if provided, otherwise use the current intermediateStations
    const stationsToUse = viaStations.length > 0 ? viaStations : intermediateStations

    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const cityData = metroData[city]
        if (!cityData || !cityData.graph) {
          throw new Error("City data not found")
        }

        // Only fastest route is available now
        const fastestRoute = findRouteWithIntermediates(cityData.graph, source, destination, stationsToUse, "fastest")

        const results = {
          fastest: fastestRoute,
        }

        if (!results || Object.keys(results).length === 0) {
          throw new Error("No valid routes found between these stations")
        }

        // Set default selected route type to fastest
        setSelectedRouteType("fastest")
        setRouteResults(results)

        // Add to recent searches
        setRecentSearches((prev) => {
          const newSearch = {
            city,
            source,
            destination,
            intermediates: stationsToUse,
            time: new Date().getTime(),
          }
          // Keep only the last 5 searches
          const updatedSearches = [newSearch, ...prev.slice(0, 4)]
          return updatedSearches
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setRouteResults(null)
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  // Handle station selection from the map
  const handleStationSelect = (source, destination) => {
    // Update the source and destination in state
    setSourceStation(source || "")
    setDestinationStation(destination || "")

    // Reset intermediate stations when source or destination changes
    setIntermediateStations([])

    // If both source and destination are selected, find the route
    if (source && destination) {
      handleFindRoute(selectedCity, source, destination, [])
    }
  }

  // Handle adding an intermediate station
  const handleAddIntermediateStation = (station, source, destination, allIntermediates) => {
    setIntermediateStations(allIntermediates)

    // Find a new route that includes the intermediate station
    if (source && destination) {
      handleFindRoute(selectedCity, source, destination, allIntermediates)
    }
  }

  // Handle changing the selected route type
  const handleRouteTypeChange = (type) => {
    setSelectedRouteType(type)
  }

  // Get the currently selected route based on type
  const getSelectedRoute = () => {
    if (!routeResults) return null
    return routeResults[selectedRouteType] || routeResults.fastest
  }

  return (
    <div className="metro-optimizer">
      <RouteForm
        onFindRoute={handleFindRoute}
        onCityChange={handleCityChange}
        isLoading={isLoading}
        sourceStation={sourceStation}
        destinationStation={destinationStation}
        onSourceChange={setSourceStation}
        onDestinationChange={setDestinationStation}
        intermediateStations={intermediateStations}
      />

      {error && (
        <div className="alert alert-error fade-in">
          <FiAlertCircle className="alert-icon" />
          <p className="alert-text">{error}</p>
        </div>
      )}

      {routeResults && (
        <RouteResults
          routeOptions={routeResults}
          selectedType={selectedRouteType}
          onRouteTypeChange={handleRouteTypeChange}
          city={selectedCity}
          intermediateStations={intermediateStations}
        />
      )}

      {selectedCity && (
        <CityMetroMap
          city={selectedCity}
          onStationSelect={handleStationSelect}
          route={getSelectedRoute()}
          sourceStation={sourceStation}
          destinationStation={destinationStation}
          onAddIntermediateStation={handleAddIntermediateStation}
        />
      )}

      {recentSearches.length > 0 && (
        <div className="recent-searches fade-in">
          <h3 className="recent-title">Recent Searches</h3>
          <div className="searches-grid">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="search-item"
                onClick={() => {
                  setSourceStation(search.source)
                  setDestinationStation(search.destination)
                  setIntermediateStations(search.intermediates || [])
                  handleFindRoute(search.city, search.source, search.destination, search.intermediates || [])
                }}
              >
                <div className="search-content">
                  <div className="search-text">
                    <span className="search-city">{search.city}:</span> {search.source} → {search.destination}
                    {search.intermediates && search.intermediates.length > 0 && (
                      <span className="search-via"> via {search.intermediates.join(", ")}</span>
                    )}
                  </div>
                  <div className="search-time">
                    <FiClock className="search-time-icon" />
                    {new Date(search.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MetroRouteOptimizer
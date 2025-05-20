"use client"

import { useState } from "react"
import { FiAlertCircle, FiLoader, FiNavigation } from "react-icons/fi"
import { metroData } from "../data/metroData"
import SearchableSelect from "./SearchableSelect"

const RouteForm = ({
  onFindRoute,
  onCityChange,
  isLoading,
  sourceStation,
  destinationStation,
  onSourceChange,
  onDestinationChange,
  intermediateStations = [],
}) => {
  const [selectedCity, setSelectedCity] = useState("")
  const [error, setError] = useState(null)

  const handleCityChange = (e) => {
    const value = e.target.value
    setSelectedCity(value)

    if (onCityChange) {
      onCityChange(value)
    }
  }

  const handleSourceChange = (value) => {
    // If destination is the same as the new source, clear destination
    if (destinationStation === value) {
      onDestinationChange("")
    }
    onSourceChange(value)
  }

  const handleDestinationChange = (value) => {
    onDestinationChange(value)
  }

  const handleFindRoute = () => {
    // Validate inputs
    if (!selectedCity) {
      setError("Please select a city")
      return
    }

    if (!sourceStation) {
      setError("Please select a source station")
      return
    }

    if (!destinationStation) {
      setError("Please select a destination station")
      return
    }

    if (sourceStation === destinationStation) {
      setError("Source and destination stations cannot be the same")
      return
    }

    setError(null)
    onFindRoute(selectedCity, sourceStation, destinationStation, intermediateStations)
  }

  const availableStations = selectedCity ? metroData[selectedCity]?.stations || [] : []

  return (
    <div className="card route-form">
      <div className="card-header">
        <h2 className="card-title">Plan Your Journey</h2>
      </div>
      <div className="card-content">
        {error && (
          <div className="alert alert-error">
            <FiAlertCircle className="alert-icon" />
            <p className="alert-text">{error}</p>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Select City</label>
            <select className="form-select" value={selectedCity} onChange={handleCityChange}>
              <option value="">Select a city</option>
              {Object.keys(metroData).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <SearchableSelect
              options={availableStations}
              value={sourceStation}
              onChange={handleSourceChange}
              placeholder="Select source"
              disabled={!selectedCity}
              label="Source Station"
            />
          </div>

          <div className="form-group">
            <SearchableSelect
              options={availableStations}
              value={destinationStation}
              onChange={handleDestinationChange}
              placeholder="Select destination"
              disabled={!selectedCity}
              excludeOption={sourceStation} // Exclude the source station
              label="Destination Station"
            />
          </div>

          <div className="form-group form-button-container">
            <button
              className="btn btn-primary"
              onClick={handleFindRoute}
              disabled={!selectedCity || !sourceStation || !destinationStation || isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="btn-icon spin" />
                  Finding Route...
                </>
              ) : (
                <>
                  <FiNavigation className="btn-icon" />
                  Find Route
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteForm

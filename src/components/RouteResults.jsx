"use client"

import { FiClock, FiArrowRight, FiDollarSign, FiMap } from "react-icons/fi"
import { MdDirectionsSubway } from "react-icons/md"

const RouteResults = ({ routeOptions, selectedType, onRouteTypeChange, city, intermediateStations = [] }) => {
  // Only fastest route is available now
  const selectedRoute = routeOptions.fastest
  const { path, time, distance, cost, stops, algorithm } = selectedRoute

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">Your Optimal Route</h2>
      </div>
      <div className="card-content">
        <div className="results-grid">
          <div className="result-item">
            <div className="result-label">Travel Time</div>
            <div className="result-value">
              <FiClock className="result-icon" />
              <span className="result-number">{time}</span>
              <span className="result-unit">min</span>
            </div>
          </div>

          <div className="result-item">
            <div className="result-label">Cost</div>
            <div className="result-value">
              <FiDollarSign className="result-icon" />
              <span className="result-number">{cost}</span>
              <span className="result-unit">₹</span>
            </div>
          </div>

          <div className="result-item">
            <div className="result-label">Distance</div>
            <div className="result-value">
              <FiMap className="result-icon" />
              <span className="result-number">{distance}</span>
              <span className="result-unit">km</span>
            </div>
          </div>

          <div className="result-item">
            <div className="result-label">Stops</div>
            <div className="result-value">
              <MdDirectionsSubway className="result-icon" />
              <span className="result-number">{stops}</span>
              <span className="result-unit">stations</span>
            </div>
          </div>

          <div className="result-item result-path">
            <div className="result-label">Journey Path</div>
            <div className="path-container">
              {path.map((station, index) => {
                const isSource = index === 0
                const isDestination = index === path.length - 1
                const isIntermediate = intermediateStations.includes(station)

                return (
                  <div key={station + index} className="path-item">
                    <span
                      className={`station-badge ${isSource ? "source" : isDestination ? "destination" : isIntermediate ? "intermediate" : ""}`}
                    >
                      {station}
                    </span>
                    {index < path.length - 1 && <FiArrowRight className="path-arrow" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteResults
"use client"

import { useState, useRef, useEffect } from "react"
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi"

const SearchableSelect = ({ options, value, onChange, placeholder, disabled, excludeOption = null, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Filter options based on search term and excluded option
  const filteredOptions = options
    .filter((option) => option !== excludeOption)
    .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation()
    onChange("")
    setSearchTerm("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true)
    }
  }

  return (
    <div className="searchable-select-container" ref={dropdownRef}>
      <label className="form-label">{label}</label>
      <div
        className={`searchable-select ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
        onClick={toggleDropdown}
      >
        <FiSearch
          className="searchable-select-search-icon"
          style={{ marginRight: "8px", color: "var(--text-tertiary)" }}
        />
        <input
          ref={inputRef}
          type="text"
          className="searchable-select-input"
          placeholder={placeholder}
          value={searchTerm || value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={isOpen ? false : true}
        />
        <div className="searchable-select-actions">
          {value && (
            <button
              type="button"
              className="searchable-select-clear"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <FiX />
            </button>
          )}
          <div className="searchable-select-arrow">
            <FiChevronDown />
          </div>
        </div>
      </div>
      {isOpen && !disabled && (
        <div className="searchable-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className={`searchable-select-option ${option === value ? "selected" : ""}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="searchable-select-no-results">No stations found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableSelect

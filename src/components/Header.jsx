import ThemeToggle from "./ThemeToggle"
import { MdDirectionsSubway } from "react-icons/md"

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-content">
          <div className="logo-container">
            <MdDirectionsSubway className="logo-icon" />
            <h1 className="logo-text">MetroGo</h1>
          </div>
          <p className="tagline">
            Navigate urban transit networks with precision and ease. Find your optimal route in seconds.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header

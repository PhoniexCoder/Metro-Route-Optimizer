import { FiGithub, FiHeart } from "react-icons/fi"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-text">&copy; {new Date().getFullYear()} MetroGo | Optimizing urban journeys</div>
        <div className="footer-links">
          <a
            href="https://github.com/PhoniexCoder/Metro-Route-Optimizer"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="GitHub Repository"
          >
            <FiGithub className="footer-icon" />
          </a>
          <span className="footer-credit">
            Created with <FiHeart style={{ color: "var(--accent-color)" }} /> by UNITE
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

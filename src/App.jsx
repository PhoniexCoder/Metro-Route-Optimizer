import Header from "./components/Header"
import Footer from "./components/Footer"
import MetroRouteOptimizer from "./components/MetroRouteOptimizer"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <MetroRouteOptimizer />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App

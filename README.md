# MetroGo - Metro Route Optimizer

MetroGo is a modern web application that helps users find the fastest metro routes between stations in major Indian cities. It features an interactive metro map, route planning with via stations, and a beautiful, responsive UI with dark mode support.

## Features

- 🚇 **Multi-city Support:** Delhi, Mumbai, and Bangalore metro networks included.
- 🗺️ **Interactive Metro Map:** Click stations to select source, destination, and via points.
- ⚡ **Fastest Route Calculation:** Uses Dijkstra's algorithm for optimal travel time.
- 🛤️ **Via Stations:** Add intermediate stations to customize your journey.
- 🌙 **Dark/Light Theme:** Toggle between dark and light modes.
- 🕑 **Recent Searches:** Quickly access your last 5 route searches.
- 📱 **Responsive Design:** Works great on desktop and mobile.

## Demo

> https://metro-route-optimizer.vercel.app

## Screenshots

> _Add screenshots of the app UI here_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/PhoniexCoder/Metro-Route-Optimizer.git
   cd metro-route-optimizer
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

To build the app for production:

```sh
npm run build
```

The optimized output will be in the `dist/` folder.

To preview the production build locally:

```sh
npm run preview
```

## Project Structure

```
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── train.svg
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── CityMetroMap.jsx
    │   ├── Footer.jsx
    │   ├── Header.jsx
    │   ├── MetroMap.jsx
    │   ├── MetroRouteOptimizer.jsx
    │   ├── RouteForm.jsx
    │   ├── RouteResults.jsx
    │   ├── SearchableSelect.jsx
    │   └── ThemeToggle.jsx
    ├── context/
    │   └── ThemeContext.jsx
    ├── data/
    │   └── metroData.js
    └── utils/
        └── routeFinder.js
```

## How It Works

- **Route Calculation:**  
  The app uses Dijkstra's algorithm to find the fastest route between stations, considering travel time as the main metric. You can also add via stations to customize your journey.

- **Interactive Map:**  
  Click on stations to select source, destination, and via points. The map visually highlights your route.

- **Recent Searches:**  
  Your last 5 searches are saved for quick access.

## Customization

- **Add More Cities:**  
  Update [`src/data/metroData.js`](src/data/metroData.js) with new city data, including stations, lines, coordinates, and graph.

- **Change Theme Colors:**  
  Edit [`src/index.css`](src/index.css) to adjust color variables.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

MIT License

## Credits

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Metro icons from [react-icons](https://react-icons.github.io/react-icons/)
- Created by TEAM UNITE (Prins Kanyal , Adit Rawat , Gaurav Singh Rawat , Anshul Panwar)

---

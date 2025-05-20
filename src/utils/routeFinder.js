// Implementation of different algorithms for finding optimal routes
export function findRoutes(graph, start, end) {
  const routes = {
    fastest: dijkstraAlgorithm(graph, start, end, "time"),
  }

  return routes
}

// Dijkstra's algorithm for finding the fastest route
export function dijkstraAlgorithm(graph, start, end, costMetric = "time") {
  // Initialize distances with infinity for all nodes except the start node
  const distances = {}
  const previous = {}
  const nodes = new Set()

  // Initialize all nodes
  for (const node in graph) {
    if (node === start) {
      distances[node] = 0
    } else {
      distances[node] = Number.POSITIVE_INFINITY
    }
    previous[node] = null
    nodes.add(node)
  }

  // Main algorithm
  while (nodes.size > 0) {
    // Find the node with the minimum distance
    let minDistance = Number.POSITIVE_INFINITY
    let minNode = null

    for (const node of nodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node]
        minNode = node
      }
    }

    // If we can't find a node with a minimum distance, break
    if (minNode === null || distances[minNode] === Number.POSITIVE_INFINITY) {
      break
    }

    // If we've reached the end node, we're done
    if (minNode === end) {
      break
    }

    // Remove the current node from the unvisited set
    nodes.delete(minNode)

    // Check all neighbors of the current node
    for (const neighbor in graph[minNode]) {
      const cost = graph[minNode][neighbor][costMetric]
      const alt = distances[minNode] + cost

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt
        previous[neighbor] = minNode
      }
    }
  }

  // Reconstruct the path
  const path = []
  let current = end

  while (current !== null) {
    path.unshift(current)
    current = previous[current]
  }

  // Calculate total time, distance, and cost
  let totalTime = 0
  let totalDistance = 0
  let totalCost = 0
  const totalStops = path.length - 1

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i]
    const next = path[i + 1]
    totalTime += graph[current][next]?.time || graph[next][current]?.time || 0
    totalDistance += graph[current][next]?.distance || graph[next][current]?.distance || 0
    totalCost += graph[current][next]?.cost || graph[next][current]?.cost || 0
  }

  return {
    path,
    time: totalTime,
    distance: Number.parseFloat(totalDistance.toFixed(1)),
    cost: totalCost,
    stops: totalStops,
    type: "fastest",
    algorithm: "Dijkstra",
  }
}

// Find route with intermediate stations
export function findRouteWithIntermediates(graph, source, destination, intermediates = [], routeType = "fastest") {
  if (!source || !destination) return null

  try {
    // If no intermediates, find direct route
    if (intermediates.length === 0) {
      return dijkstraAlgorithm(graph, source, destination, "time")
    }

    // With intermediates, find route segments and combine
    let combinedPath = []
    let totalTime = 0
    let totalDistance = 0
    let totalCost = 0

    // Create an array of points to visit in order
    const pointsInOrder = [source, ...intermediates, destination]

    // Find routes between consecutive points
    for (let i = 0; i < pointsInOrder.length - 1; i++) {
      const segmentResult = dijkstraAlgorithm(graph, pointsInOrder[i], pointsInOrder[i + 1], "time")

      if (segmentResult.path.length <= 1) {
        throw new Error(`No valid route found between ${pointsInOrder[i]} and ${pointsInOrder[i + 1]}`)
      }

      // Add segment to combined path (avoiding duplicates)
      if (i === 0) {
        combinedPath = [...segmentResult.path]
      } else {
        // Skip the first station of subsequent segments as it's already in the path
        combinedPath = [...combinedPath, ...segmentResult.path.slice(1)]
      }

      totalTime += segmentResult.time
      totalDistance += segmentResult.distance
      totalCost += segmentResult.cost
    }

    return {
      path: combinedPath,
      time: totalTime,
      distance: Number.parseFloat(totalDistance.toFixed(1)),
      cost: totalCost,
      stops: combinedPath.length - 1,
      type: "fastest",
      algorithm: "Dijkstra",
    }
  } catch (err) {
    console.error("Error finding route:", err)
    throw err
  }
}
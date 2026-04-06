import type { Maze } from '../maze/generator'

interface Node {
  x: number
  y: number
}

interface Edge {
  from: Node
  to: Node
  weight: number
}

function buildGraph(maze: Maze): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  for (let y = 0; y < maze.size; y++) {
    for (let x = 0; x < maze.size; x++) {
      nodes.push({ x, y })
      const cell = maze.grid[y][x]
      if (!cell.walls.right && x + 1 < maze.size) {
        edges.push({ from: { x, y }, to: { x: x + 1, y }, weight: 1 })
      }
      if (!cell.walls.bottom && y + 1 < maze.size) {
        edges.push({ from: { x, y }, to: { x, y: y + 1 }, weight: 1 })
      }
    }
  }

  return { nodes, edges }
}

function quantumPhaseEstimate(edges: Edge[], start: Node, end: Node, size: number): number[] {
  // Simulates quantum interference — assigns phase amplitudes to edges
  // based on their distance from start and proximity to end
  const phases = edges.map((edge) => {
    const distFromStart = Math.abs(edge.from.x - start.x) + Math.abs(edge.from.y - start.y)
    const distToEnd = Math.abs(edge.to.x - end.x) + Math.abs(edge.to.y - end.y)
    const totalDist = size * 2

    // Constructive interference for edges closer to optimal path
    const phase = Math.cos((distFromStart / totalDist) * Math.PI) *
                  Math.cos((distToEnd / totalDist) * Math.PI)
    return Math.max(0, phase)
  })

  // Normalize
  const total = phases.reduce((a, b) => a + b, 0)
  return phases.map(p => total > 0 ? p / total : 0)
}

function dijkstra(maze: Maze, start: Node, end: Node, edgeWeights: Map<string, number>): Node[] {
  const dist: Map<string, number> = new Map()
  const prev: Map<string, Node | null> = new Map()
  const unvisited: Set<string> = new Set()

  for (let y = 0; y < maze.size; y++) {
    for (let x = 0; x < maze.size; x++) {
      const key = `${x},${y}`
      dist.set(key, Infinity)
      prev.set(key, null)
      unvisited.add(key)
    }
  }

  dist.set(`${start.x},${start.y}`, 0)

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let u = ''
    let minDist = Infinity
    for (const key of unvisited) {
      const d = dist.get(key)!
      if (d < minDist) { minDist = d; u = key }
    }

    if (!u || minDist === Infinity) break
    unvisited.delete(u)

    const [ux, uy] = u.split(',').map(Number)
    if (ux === end.x && uy === end.y) break

    const cell = maze.grid[uy][ux]
    const neighbors: Node[] = []
    if (!cell.walls.top) neighbors.push({ x: ux, y: uy - 1 })
    if (!cell.walls.right) neighbors.push({ x: ux + 1, y: uy })
    if (!cell.walls.bottom) neighbors.push({ x: ux, y: uy + 1 })
    if (!cell.walls.left) neighbors.push({ x: ux - 1, y: uy })

    for (const neighbor of neighbors) {
      const vKey = `${neighbor.x},${neighbor.y}`
      if (!unvisited.has(vKey)) continue
      const edgeKey = `${ux},${uy}-${neighbor.x},${neighbor.y}`
      const weight = edgeWeights.get(edgeKey) ?? 1
      const alt = dist.get(u)! + weight
      if (alt < dist.get(vKey)!) {
        dist.set(vKey, alt)
        prev.set(vKey, { x: ux, y: uy })
      }
    }
  }

  // Reconstruct path
  const path: Node[] = []
  let current: Node | null = end
  while (current) {
    path.unshift(current)
    current = prev.get(`${current.x},${current.y}`) ?? null
  }

  return path
}

export function runQuantumBot(maze: Maze): { x: number; y: number }[] {
  const { edges } = buildGraph(maze)
  const start = maze.start
  const end = maze.end

  // Step 1: Quantum phase estimation gives amplitude weights to edges
  const phases = quantumPhaseEstimate(edges, start, end, maze.size)

  // Step 2: Use phase amplitudes as edge weights (lower amplitude = higher cost)
  // This simulates QAOA-style optimization biasing toward the optimal path
  const edgeWeights = new Map<string, number>()
  edges.forEach((edge, i) => {
    const weight = 1 / (phases[i] + 0.01) // constructive interference = lower weight
    const key = `${edge.from.x},${edge.from.y}-${edge.to.x},${edge.to.y}`
    const reverseKey = `${edge.to.x},${edge.to.y}-${edge.from.x},${edge.from.y}`
    edgeWeights.set(key, weight)
    edgeWeights.set(reverseKey, weight)
  })

  // Step 3: Dijkstra finds shortest path guided by quantum weights
  return dijkstra(maze, start, end, edgeWeights)
}
import type { Maze } from '../maze/generator'

export interface QTable {
  [state: string]: number[]
}

export interface RLConfig {
  learningRate: number
  discount: number
  epsilon: number
  epsilonDecay: number
  minEpsilon: number
  episodes: number
}

export const defaultRLConfig: RLConfig = {
  learningRate: 0.15,
  discount: 0.99,
  epsilon: 1.0,
  epsilonDecay: 0.998,
  minEpsilon: 0.01,
  episodes: 2000,
}

export interface TrainingMetrics {
  episode: number
  totalEpisodes: number
  epsilon: number
  reward: number
  steps: number
  learningRate: number
}

function stateKey(x: number, y: number): string {
  return `${x},${y}`
}

function getActions(maze: Maze, x: number, y: number): number[] {
  const cell = maze.grid[y][x]
  const actions: number[] = []
  if (!cell.walls.top) actions.push(0)    // up
  if (!cell.walls.right) actions.push(1)  // right
  if (!cell.walls.bottom) actions.push(2) // down
  if (!cell.walls.left) actions.push(3)   // left
  return actions
}

function applyAction(x: number, y: number, action: number): { x: number; y: number } {
  if (action === 0) return { x, y: y - 1 }
  if (action === 1) return { x: x + 1, y }
  if (action === 2) return { x, y: y + 1 }
  return { x: x - 1, y }
}

export function trainRL(
  maze: Maze,
  config: RLConfig,
  onProgress: (metrics: TrainingMetrics) => void
): Promise<QTable> {
  return new Promise((resolve) => {
    const qTable: QTable = {}
    let epsilon = config.epsilon
    let episode = 0

    function getQ(x: number, y: number): number[] {
      const key = stateKey(x, y)
      if (!qTable[key]) qTable[key] = [0, 0, 0, 0]
      return qTable[key]
    }

    function runEpisode() {
      if (episode >= config.episodes) {
        resolve(qTable)
        return
      }

      let x = maze.start.x
      let y = maze.start.y
      let totalReward = 0
      let steps = 0
      const maxSteps = maze.size * maze.size * 6

      while (steps < maxSteps) {
        const actions = getActions(maze, x, y)
        let action: number

        if (Math.random() < epsilon) {
          action = actions[Math.floor(Math.random() * actions.length)]
        } else {
          const q = getQ(x, y)
          action = actions.reduce((a, b) => q[a] > q[b] ? a : b)
        }

        const next = applyAction(x, y, action)
        const isEnd = next.x === maze.end.x && next.y === maze.end.y
        const prevDist = Math.abs(x - maze.end.x) + Math.abs(y - maze.end.y)
        const nextDist = Math.abs(next.x - maze.end.x) + Math.abs(next.y - maze.end.y)
        const shaping = prevDist - nextDist
        const reward = isEnd ? 100 : -0.1 + shaping

        const currentQ = getQ(x, y)
        const nextQ = getQ(next.x, next.y)
        const maxNextQ = Math.max(...nextQ)

        currentQ[action] = currentQ[action] + config.learningRate * (
          reward + config.discount * maxNextQ - currentQ[action]
        )

        totalReward += reward
        x = next.x
        y = next.y
        steps++

        if (isEnd) break
      }

      epsilon = Math.max(config.minEpsilon, epsilon * config.epsilonDecay)
      episode++

      onProgress({
        episode,
        totalEpisodes: config.episodes,
        epsilon: parseFloat(epsilon.toFixed(4)),
        reward: totalReward,
        steps,
        learningRate: config.learningRate,
      })

      setTimeout(runEpisode, 0)
    }

    runEpisode()
  })
}

export function getLearnedPath(maze: Maze, qTable: QTable): { x: number; y: number }[] {
  let x = maze.start.x
  let y = maze.start.y
  const path: { x: number; y: number }[] = [{ x, y }]
  const visited = new Set<string>()
  const maxSteps = maze.size * maze.size * 2

  while (!(x === maze.end.x && y === maze.end.y) && path.length < maxSteps) {
    const key = stateKey(x, y)
    if (visited.has(key)) break
    visited.add(key)

    const actions = getActions(maze, x, y)
    const q = qTable[key] ?? [0, 0, 0, 0]
    const action = actions.reduce((a, b) => q[a] > q[b] ? a : b)
    const next = applyAction(x, y, action)

    x = next.x
    y = next.y
    path.push({ x, y })
  }

  return path
}
export interface Cell {
  x: number
  y: number
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  visited: boolean
}

export interface Maze {
  grid: Cell[][]
  size: number
  start: { x: number; y: number }
  end: { x: number; y: number }
}

export function generateMaze(size: number): Maze {
  const grid: Cell[][] = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  )

  const stack: Cell[] = []
  const start = grid[0][0]
  start.visited = true
  stack.push(start)

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getUnvisitedNeighbors(current, grid, size)

    if (neighbors.length === 0) {
      stack.pop()
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      removeWall(current, next)
      next.visited = true
      stack.push(next)
    }
  }

  return {
    grid,
    size,
    start: { x: 0, y: 0 },
    end: { x: size - 1, y: size - 1 },
  }
}

function getUnvisitedNeighbors(cell: Cell, grid: Cell[][], size: number): Cell[] {
  const { x, y } = cell
  const neighbors: Cell[] = []
  if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x])
  if (x < size - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1])
  if (y < size - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x])
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1])
  return neighbors
}

function removeWall(a: Cell, b: Cell) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (dx === 1) { a.walls.right = false; b.walls.left = false }
  if (dx === -1) { a.walls.left = false; b.walls.right = false }
  if (dy === 1) { a.walls.bottom = false; b.walls.top = false }
  if (dy === -1) { a.walls.top = false; b.walls.bottom = false }
}
import type { Maze } from './generator'

export interface RenderOptions {
  canvas: HTMLCanvasElement
  maze: Maze
  playerPos?: { x: number; y: number }
  botPath?: { x: number; y: number }[]
  botPos?: { x: number; y: number }
}

export function renderMaze({ canvas, maze, playerPos, botPath, botPos }: RenderOptions) {
  const ctx = canvas.getContext('2d')!
  const cellSize = canvas.width / maze.size

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw bot path trail
  if (botPath) {
    for (const pos of botPath) {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'
      ctx.fillRect(pos.x * cellSize + 1, pos.y * cellSize + 1, cellSize - 2, cellSize - 2)
    }
  }

  // Draw start and end
  ctx.fillStyle = '#22c55e'
  ctx.fillRect(maze.start.x * cellSize + 2, maze.start.y * cellSize + 2, cellSize - 4, cellSize - 4)
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(maze.end.x * cellSize + 2, maze.end.y * cellSize + 2, cellSize - 4, cellSize - 4)

  // Draw walls
  ctx.strokeStyle = '#1d4ed8'
  ctx.lineWidth = 1.5

  for (let y = 0; y < maze.size; y++) {
    for (let x = 0; x < maze.size; x++) {
      const cell = maze.grid[y][x]
      const px = x * cellSize
      const py = y * cellSize

      if (cell.walls.top) {
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); ctx.stroke()
      }
      if (cell.walls.right) {
        ctx.beginPath(); ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke()
      }
      if (cell.walls.bottom) {
        ctx.beginPath(); ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke()
      }
      if (cell.walls.left) {
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); ctx.stroke()
      }
    }
  }

  // Draw bot position
  if (botPos) {
    ctx.fillStyle = '#818cf8'
    ctx.beginPath()
    ctx.arc(
      botPos.x * cellSize + cellSize / 2,
      botPos.y * cellSize + cellSize / 2,
      cellSize / 2 - 2, 0, Math.PI * 2
    )
    ctx.fill()
  }

  // Draw player
  if (playerPos) {
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(
      playerPos.x * cellSize + cellSize / 2,
      playerPos.y * cellSize + cellSize / 2,
      cellSize / 2 - 2, 0, Math.PI * 2
    )
    ctx.fill()
  }
}
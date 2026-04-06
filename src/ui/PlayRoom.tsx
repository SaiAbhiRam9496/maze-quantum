import { useEffect, useRef, useState, useCallback } from 'react'
import type { Maze } from '../maze/generator'
import { renderMaze } from '../maze/renderer'

interface Props {
  maze: Maze
  quantumPath: { x: number; y: number }[] | null
}

type Mode = 'human' | 'quantum' | null

export default function PlayRoom({ maze, quantumPath }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerPos, setPlayerPos] = useState(maze.start)
  const [botPos, setBotPos] = useState<{ x: number; y: number } | null>(null)
  const [botPath, setBotPath] = useState<{ x: number; y: number }[]>([])
  const [mode, setMode] = useState<Mode>(null)
  const [steps, setSteps] = useState(0)
  const [won, setWon] = useState(false)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const CANVAS_SIZE = 500

  function reset() {
    if (animRef.current) clearTimeout(animRef.current)
    setPlayerPos(maze.start)
    setBotPos(null)
    setBotPath([])
    setMode(null)
    setSteps(0)
    setWon(false)
  }

  function animatePath(path: { x: number; y: number }[], index = 0) {
    if (index >= path.length) return
    const pos = path[index]
    setBotPos(pos)
    setBotPath(path.slice(0, index + 1))
    setSteps(index + 1)
    if (pos.x === maze.end.x && pos.y === maze.end.y) setWon(true)
    animRef.current = setTimeout(() => animatePath(path, index + 1), 30)
  }

  function playQuantum() {
    if (!quantumPath) return
    reset()
    setMode('quantum')
    setTimeout(() => animatePath(quantumPath), 100)
  }

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (mode === 'quantum') return
    setMode('human')

    const { x, y } = playerPos
    const cell = maze.grid[y][x]
    let nx = x, ny = y

    if (e.key === 'ArrowUp' && !cell.walls.top) ny -= 1
    else if (e.key === 'ArrowDown' && !cell.walls.bottom) ny += 1
    else if (e.key === 'ArrowLeft' && !cell.walls.left) nx -= 1
    else if (e.key === 'ArrowRight' && !cell.walls.right) nx += 1
    else return

    e.preventDefault()
    setPlayerPos({ x: nx, y: ny })
    setSteps(s => s + 1)
    if (nx === maze.end.x && ny === maze.end.y) setWon(true)
  }, [playerPos, mode, maze])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    renderMaze({
      canvas,
      maze,
      playerPos: mode === 'human' ? playerPos : undefined,
      botPos: botPos ?? undefined,
      botPath,
    })
  }, [maze, playerPos, botPos, botPath, mode])

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">Play Room</h2>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => { reset(); setMode('human') }}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded-lg transition"
        >
          Play Manually
        </button>
        <button
          onClick={playQuantum}
          disabled={!quantumPath}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition"
        >
          Quantum Bot Plays
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="bg-gray-800 rounded px-3 py-2">
          <span className="text-gray-400">Mode: </span>
          <span className="text-white font-mono capitalize">{mode ?? 'none'}</span>
        </div>
        <div className="bg-gray-800 rounded px-3 py-2">
          <span className="text-gray-400">Steps: </span>
          <span className="text-white font-mono">{steps}</span>
        </div>
      </div>

      {won && (
        <div className="bg-green-800 text-green-200 rounded-lg px-4 py-3 font-semibold">
          Maze Solved in {steps} steps!
        </div>
      )}

      {!quantumPath && (
        <p className="text-yellow-400 text-sm">⚠ Run Quantum Bot in Training Room first</p>
      )}

      {mode === 'human' && !won && (
        <p className="text-gray-400 text-sm">Use arrow keys to navigate</p>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-lg border border-gray-700"
      />
    </div>
  )
}
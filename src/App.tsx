import { useState } from 'react'
import type { Maze } from './maze/generator'
import { generateMaze } from './maze/generator'
import TrainingRoom from './ui/TrainingRoom'
import PlayRoom from './ui/PlayRoom'

const MAZE_SIZE = 25

export default function App() {
  const [maze, setMaze] = useState<Maze>(() => generateMaze(MAZE_SIZE))
  const [quantumPath, setQuantumPath] = useState<{ x: number; y: number }[] | null>(null)

  function newMaze() {
    setMaze(generateMaze(MAZE_SIZE))
    setQuantumPath(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Maze AI</h1>
            <p className="text-gray-400 text-sm mt-1">Quantum pathfinding — {MAZE_SIZE}x{MAZE_SIZE} maze</p>
          </div>
          <button
            onClick={newMaze}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            New Maze
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TrainingRoom
            maze={maze}
            onQuantumReady={(path) => setQuantumPath(path)}
          />
          <PlayRoom
            maze={maze}
            quantumPath={quantumPath}
          />
        </div>
      </div>
    </div>
  )
}
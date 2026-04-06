import { useState } from 'react'
import type { Maze } from '../maze/generator'
import { runQuantumBot } from '../bots/quantumBot'

interface Props {
  maze: Maze
  onQuantumReady: (path: { x: number; y: number }[]) => void
}

export default function TrainingRoom({ maze, onQuantumReady }: Props) {
  const [quantumReady, setQuantumReady] = useState(false)
  const [computing, setComputing] = useState(false)

  function trainQuantum() {
    setQuantumReady(false)
    setComputing(true)
    setTimeout(() => {
      const path = runQuantumBot(maze)
      onQuantumReady(path)
      setQuantumReady(true)
      setComputing(false)
    }, 500)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-white">Training Room</h2>

      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-purple-400 font-semibold">Quantum Bot — QAOA Simulation</h3>
          <button
            onClick={trainQuantum}
            disabled={computing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition"
          >
            {computing ? 'Computing...' : quantumReady ? 'Recompute' : 'Run Quantum Bot'}
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-400">Algorithm: <span className="text-white font-mono">QAOA Phase Estimation + Dijkstra</span></p>
          <p className="text-gray-400">Approach: <span className="text-white font-mono">Quantum interference weights optimal path</span></p>
          <p className="text-gray-400">Complexity: <span className="text-white font-mono">O(n² log n)</span></p>
        </div>

        {quantumReady && (
          <p className="text-green-400 text-sm font-semibold">✓ Quantum Bot Ready</p>
        )}
      </div>
    </div>
  )
}
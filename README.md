# Maze Quantum AI

An interactive browser-based maze game that demonstrates quantum-inspired pathfinding. Built with React, TypeScript, and Tailwind CSS.

## Live Demo

[maze-quantum.vercel.app](https://maze-quantum-8rtempbts-saiabhiram9496s-projects.vercel.app/)

## What is this?

Maze Quantum AI is a 25x25 randomly generated maze game with two modes:

- **Play Manually** — navigate the maze using arrow keys
- **Quantum Bot** — a QAOA-inspired algorithm solves the maze and animates the path in real time

Every time you click "New Maze" a completely new maze is generated using a recursive backtracking algorithm, and the quantum bot recomputes the optimal path from scratch.

## How the Quantum Algorithm Works

The bot runs in three steps:

**Step 1 — Graph Construction**
The maze is converted into a graph. Every open cell is a node, every open wall between two cells is an edge.

**Step 2 — Quantum Phase Estimation**
Each edge is assigned a phase amplitude score. Edges closer to the direct path from start to end receive higher constructive interference scores. Edges far from the optimal direction receive lower scores — simulating destructive interference. This is inspired by how QAOA (Quantum Approximate Optimization Algorithm) works on real quantum hardware for pathfinding and logistics problems.

**Step 3 — Quantum-Weighted Pathfinding**
Dijkstra's algorithm runs on the graph using the quantum phase scores as edge weights. Edges with high constructive interference become cheaper to traverse — naturally guiding the algorithm toward the optimal path.

The result is a path that mimics what a real quantum optimizer would produce on a QPU, simulated entirely in the browser.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite 6

## Getting Started
```bash
git clone https://github.com/SaiAbhiRam9496/maze-quantum.git
cd maze-quantum
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.


## Why This Matters

Quantum optimization algorithms like QAOA are actively used in:

- Drone delivery pathfinding
- Logistics and supply chain routing
- Network traffic optimization
- Game AI research

This project demonstrates the core concept of quantum-weighted graph traversal running entirely client-side — no QPU, no backend, no server.

## Author

**Sai AbhiRam** — [github.com/SaiAbhiRam9496](https://github.com/SaiAbhiRam9496)
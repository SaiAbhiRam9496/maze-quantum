import type { Maze } from '../maze/generator'
import type { RLConfig, QTable, TrainingMetrics } from '../bots/rlBot'
import { trainRL, defaultRLConfig } from '../bots/rlBot'
export interface TrainerState {
  isTraining: boolean
  isReady: boolean
  metrics: TrainingMetrics | null
  rewardHistory: number[]
  qTable: QTable | null
}

export const initialTrainerState: TrainerState = {
  isTraining: false,
  isReady: false,
  metrics: null,
  rewardHistory: [],
  qTable: null,
}

export async function startRLTraining(
  maze: Maze,
  config: RLConfig = defaultRLConfig,
  onProgress: (state: TrainerState) => void
): Promise<QTable> {
  const rewardHistory: number[] = []

  const qTable = await trainRL(maze, config, (metrics) => {
    rewardHistory.push(metrics.reward)
    onProgress({
      isTraining: true,
      isReady: false,
      metrics,
      rewardHistory: [...rewardHistory],
      qTable: null,
    })
  })

  onProgress({
    isTraining: false,
    isReady: true,
    metrics: null,
    rewardHistory: [...rewardHistory],
    qTable,
  })

  return qTable
}
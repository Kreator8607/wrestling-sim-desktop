import { useCallback } from 'react';
import { useIpc } from './useIpc';

export function useSimulation() {
  const { invoke } = useIpc();

  return {
    simulateMatch: useCallback((worker1Id, worker2Id, matchType = 'singles') =>
      invoke('simulation:simulateMatch', worker1Id, worker2Id, matchType),
      [invoke]
    ),
    saveMatchResult: useCallback((matchData) =>
      invoke('simulation:saveMatchResult', matchData),
      [invoke]
    ),
    autoSimulate: useCallback((config) =>
      invoke('simulation:autoSimulate', config),
      [invoke]
    ),
    getStats: useCallback(() =>
      invoke('simulation:getStats'),
      [invoke]
    ),
  };
}

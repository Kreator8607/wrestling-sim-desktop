import { useCallback } from 'react';

export function useIpc() {
  const invoke = useCallback(async (channel, ...args) => {
    if (!window.electronAPI) {
      console.warn('Electron API not available');
      return null;
    }
    
    try {
      return await window.electronAPI.invoke(channel, ...args);
    } catch (error) {
      console.error(`IPC Error (${channel}):`, error);
      throw error;
    }
  }, []);

  return { invoke };
}

// Hooks específicos para cada entidade
export function usePromotions() {
  const { invoke } = useIpc();

  return {
    list: useCallback(() => invoke('db:promotions:list'), [invoke]),
    getById: useCallback((id) => invoke('db:promotions:getById', id), [invoke]),
  };
}

export function useWorkers() {
  const { invoke } = useIpc();

  return {
    list: useCallback(() => invoke('db:workers:list'), [invoke]),
    listByPromotion: useCallback((promotionId) => invoke('db:workers:listByPromotion', promotionId), [invoke]),
    getById: useCallback((id) => invoke('db:workers:getById', id), [invoke]),
    update: useCallback((worker) => invoke('db:workers:update', worker), [invoke]),
  };
}

export function useTitles() {
  const { invoke } = useIpc();

  return {
    list: useCallback(() => invoke('db:titles:list'), [invoke]),
    listByPromotion: useCallback((promotionId) => invoke('db:titles:listByPromotion', promotionId), [invoke]),
    getById: useCallback((id) => invoke('db:titles:getById', id), [invoke]),
  };
}

export function useEvents() {
  const { invoke } = useIpc();

  return {
    create: useCallback((eventData) => invoke('db:events:create', eventData), [invoke]),
    list: useCallback(() => invoke('db:events:list'), [invoke]),
    listByPromotion: useCallback((promotionId) => invoke('db:events:listByPromotion', promotionId), [invoke]),
    getById: useCallback((id) => invoke('db:events:getById', id), [invoke]),
  };
}

export function useMatchResults() {
  const { invoke } = useIpc();

  return {
    create: useCallback((matchData) => invoke('db:matchResults:create', matchData), [invoke]),
    listByEvent: useCallback((eventId) => invoke('db:matchResults:listByEvent', eventId), [invoke]),
  };
}

export function useInjuries() {
  const { invoke } = useIpc();

  return {
    create: useCallback((injuryData) => invoke('db:injuries:create', injuryData), [invoke]),
    list: useCallback(() => invoke('db:injuries:list'), [invoke]),
    delete: useCallback((id) => invoke('db:injuries:delete', id), [invoke]),
  };
}

export function useRankings() {
  const { invoke } = useIpc();

  return {
    get: useCallback(() => invoke('db:rankings:get'), [invoke]),
    getByPromotion: useCallback((promotionId) => invoke('db:rankings:getByPromotion', promotionId), [invoke]),
  };
}

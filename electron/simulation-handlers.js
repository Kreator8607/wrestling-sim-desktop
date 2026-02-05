import { ipcMain } from 'electron';
import { getDatabase } from './database.js';
import { simulateMatch, updateWorkerStats, updateEventRating, updateTitleChampion, processAutoSimulation } from './simulation.js';

export function setupSimulationHandlers() {
  // Simular um match
  ipcMain.handle('simulation:simulateMatch', async (event, worker1Id, worker2Id, matchType = 'singles') => {
    try {
      const db = getDatabase();
      const worker1 = db.prepare('SELECT * FROM workers WHERE id = ?').get(worker1Id);
      const worker2 = db.prepare('SELECT * FROM workers WHERE id = ?').get(worker2Id);

      if (!worker1 || !worker2) {
        throw new Error('Lutador não encontrado');
      }

      const result = simulateMatch(worker1, worker2, matchType);
      return result;
    } catch (error) {
      console.error('Error simulating match:', error);
      throw error;
    }
  });

  // Salvar resultado de match
  ipcMain.handle('simulation:saveMatchResult', async (event, matchData) => {
    try {
      const db = getDatabase();

      // Salvar resultado
      const result = db.prepare(`
        INSERT INTO match_results (
          event_id, worker1_id, worker2_id, worker3_id, worker4_id,
          winner_id, match_type, title_id, match_quality, segment_rating,
          crowd_reaction, finish_type, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        matchData.eventId,
        matchData.worker1Id,
        matchData.worker2Id || null,
        matchData.worker3Id || null,
        matchData.worker4Id || null,
        matchData.winnerId,
        matchData.matchType,
        matchData.titleId || null,
        matchData.matchQuality,
        matchData.segmentRating,
        matchData.crowdReaction,
        matchData.finishType,
        matchData.description
      );

      // Atualizar estatísticas dos lutadores
      updateWorkerStats(db, matchData.worker1Id, matchData.worker1Id === matchData.winnerId);
      if (matchData.worker2Id) {
        updateWorkerStats(db, matchData.worker2Id, matchData.worker2Id === matchData.winnerId);
      }
      if (matchData.worker3Id) {
        updateWorkerStats(db, matchData.worker3Id, matchData.worker3Id === matchData.winnerId);
      }
      if (matchData.worker4Id) {
        updateWorkerStats(db, matchData.worker4Id, matchData.worker4Id === matchData.winnerId);
      }

      // Atualizar rating do evento
      updateEventRating(db, matchData.eventId);

      // Se for match de título, atualizar campeão
      if (matchData.titleId) {
        updateTitleChampion(db, matchData.titleId, matchData.winnerId, matchData.eventId);
      }

      return { id: result.lastInsertRowid, success: true };
    } catch (error) {
      console.error('Error saving match result:', error);
      throw error;
    }
  });

  // Auto simulação
  ipcMain.handle('simulation:autoSimulate', async (event, config) => {
    try {
      const db = getDatabase();
      const results = processAutoSimulation(db, config);
      return results;
    } catch (error) {
      console.error('Error in auto simulation:', error);
      throw error;
    }
  });

  // Obter estatísticas gerais
  ipcMain.handle('simulation:getStats', async () => {
    try {
      const db = getDatabase();

      const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
      const totalMatches = db.prepare('SELECT COUNT(*) as count FROM match_results').get().count;
      const totalWorkers = db.prepare('SELECT COUNT(*) as count FROM workers').get().count;
      const totalTitles = db.prepare('SELECT COUNT(*) as count FROM titles').get().count;

      return {
        totalEvents,
        totalMatches,
        totalWorkers,
        totalTitles,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  });
}

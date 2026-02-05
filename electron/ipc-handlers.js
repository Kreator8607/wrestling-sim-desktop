import { ipcMain } from 'electron';
import { getDatabase } from './database.js';

export function setupIpcHandlers() {
  // Promotions
  ipcMain.handle('db:promotions:list', async () => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM promotions ORDER BY prestige DESC').all();
    } catch (error) {
      console.error('Error listing promotions:', error);
      throw error;
    }
  });

  ipcMain.handle('db:promotions:getById', async (event, id) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting promotion:', error);
      throw error;
    }
  });

  // Workers
  ipcMain.handle('db:workers:list', async () => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM workers ORDER BY star_power DESC').all();
    } catch (error) {
      console.error('Error listing workers:', error);
      throw error;
    }
  });

  ipcMain.handle('db:workers:listByPromotion', async (event, promotionId) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM workers WHERE promotion_id = ? ORDER BY star_power DESC').all(promotionId);
    } catch (error) {
      console.error('Error listing workers by promotion:', error);
      throw error;
    }
  });

  ipcMain.handle('db:workers:getById', async (event, id) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM workers WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting worker:', error);
      throw error;
    }
  });

  ipcMain.handle('db:workers:update', async (event, worker) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        UPDATE workers SET 
          wrestling_skill = ?,
          entertainment = ?,
          star_power = ?,
          intimidation = ?,
          sex_appeal = ?,
          psychology = ?,
          safety = ?,
          stamina = ?,
          total_matches = ?,
          total_wins = ?,
          total_losses = ?
        WHERE id = ?
      `);
      
      stmt.run(
        worker.wrestling_skill,
        worker.entertainment,
        worker.star_power,
        worker.intimidation,
        worker.sex_appeal,
        worker.psychology,
        worker.safety,
        worker.stamina,
        worker.total_matches,
        worker.total_wins,
        worker.total_losses,
        worker.id
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error updating worker:', error);
      throw error;
    }
  });

  // Titles
  ipcMain.handle('db:titles:list', async () => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM titles ORDER BY prestige DESC').all();
    } catch (error) {
      console.error('Error listing titles:', error);
      throw error;
    }
  });

  ipcMain.handle('db:titles:listByPromotion', async (event, promotionId) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM titles WHERE promotion_id = ? ORDER BY prestige DESC').all(promotionId);
    } catch (error) {
      console.error('Error listing titles by promotion:', error);
      throw error;
    }
  });

  ipcMain.handle('db:titles:getById', async (event, id) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM titles WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting title:', error);
      throw error;
    }
  });

  // Events
  ipcMain.handle('db:events:create', async (event, eventData) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO events (promotion_id, name, date, venue, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        eventData.promotionId,
        eventData.name,
        eventData.date,
        eventData.venue || null,
        'scheduled'
      );
      
      return { id: result.lastInsertRowid, success: true };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  });

  ipcMain.handle('db:events:list', async () => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM events ORDER BY date DESC').all();
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  });

  ipcMain.handle('db:events:listByPromotion', async (event, promotionId) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM events WHERE promotion_id = ? ORDER BY date DESC').all(promotionId);
    } catch (error) {
      console.error('Error listing events by promotion:', error);
      throw error;
    }
  });

  ipcMain.handle('db:events:getById', async (event, id) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting event:', error);
      throw error;
    }
  });

  // Match Results
  ipcMain.handle('db:matchResults:create', async (event, matchData) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO match_results (
          event_id, worker1_id, worker2_id, worker3_id, worker4_id,
          winner_id, match_type, title_id, match_quality, segment_rating,
          crowd_reaction, finish_type, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
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
      
      return { id: result.lastInsertRowid, success: true };
    } catch (error) {
      console.error('Error creating match result:', error);
      throw error;
    }
  });

  ipcMain.handle('db:matchResults:listByEvent', async (event, eventId) => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM match_results WHERE event_id = ? ORDER BY id').all(eventId);
    } catch (error) {
      console.error('Error listing match results:', error);
      throw error;
    }
  });

  // Injuries
  ipcMain.handle('db:injuries:create', async (event, injuryData) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO injuries (worker_id, injury_type, severity, recovery_weeks, weeks_remaining, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        injuryData.workerId,
        injuryData.injuryType,
        injuryData.severity,
        injuryData.recoveryWeeks,
        injuryData.recoveryWeeks,
        'active'
      );
      
      return { id: result.lastInsertRowid, success: true };
    } catch (error) {
      console.error('Error creating injury:', error);
      throw error;
    }
  });

  ipcMain.handle('db:injuries:list', async () => {
    try {
      const db = getDatabase();
      return db.prepare('SELECT * FROM injuries WHERE status = "active" ORDER BY severity DESC').all();
    } catch (error) {
      console.error('Error listing injuries:', error);
      throw error;
    }
  });

  ipcMain.handle('db:injuries:delete', async (event, id) => {
    try {
      const db = getDatabase();
      db.prepare('DELETE FROM injuries WHERE id = ?').run(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting injury:', error);
      throw error;
    }
  });

  // Rankings
  ipcMain.handle('db:rankings:get', async () => {
    try {
      const db = getDatabase();
      return db.prepare(`
        SELECT 
          w.*,
          (SELECT COUNT(*) FROM match_results WHERE winner_id = w.id) as wins,
          (SELECT COUNT(*) FROM match_results WHERE (worker1_id = w.id OR worker2_id = w.id) AND winner_id != w.id) as losses
        FROM workers w
        ORDER BY wins DESC, star_power DESC
      `).all();
    } catch (error) {
      console.error('Error getting rankings:', error);
      throw error;
    }
  });

  ipcMain.handle('db:rankings:getByPromotion', async (event, promotionId) => {
    try {
      const db = getDatabase();
      return db.prepare(`
        SELECT 
          w.*,
          (SELECT COUNT(*) FROM match_results WHERE winner_id = w.id) as wins,
          (SELECT COUNT(*) FROM match_results WHERE (worker1_id = w.id OR worker2_id = w.id) AND winner_id != w.id) as losses
        FROM workers w
        WHERE w.promotion_id = ?
        ORDER BY wins DESC, star_power DESC
      `).all(promotionId);
    } catch (error) {
      console.error('Error getting rankings by promotion:', error);
      throw error;
    }
  });
}

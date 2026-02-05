import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  const dbPath = path.join(app.getPath('userData'), 'wrestling_sim.db');
  
  db = new Database(dbPath);
  
  // Habilitar foreign keys
  db.pragma('foreign_keys = ON');
  
  // Criar tabelas
  createTables();
  
  return db;
}

function createTables() {
  // Tabela de Promoções
  db.exec(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      acronym TEXT,
      country TEXT,
      prestige REAL DEFAULT 50,
      money INTEGER DEFAULT 1000000,
      status TEXT DEFAULT 'active',
      popularity_na REAL DEFAULT 50,
      popularity_sa REAL DEFAULT 30,
      popularity_asia REAL DEFAULT 30,
      popularity_oceania REAL DEFAULT 20,
      popularity_africa REAL DEFAULT 20,
      popularity_europe REAL DEFAULT 40,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela de Lutadores (Workers)
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      promotion_id INTEGER NOT NULL,
      wrestling_skill INTEGER DEFAULT 50,
      entertainment INTEGER DEFAULT 50,
      star_power INTEGER DEFAULT 50,
      intimidation INTEGER DEFAULT 50,
      sex_appeal INTEGER DEFAULT 50,
      psychology INTEGER DEFAULT 50,
      safety INTEGER DEFAULT 50,
      stamina INTEGER DEFAULT 50,
      neck_condition INTEGER DEFAULT 100,
      back_condition INTEGER DEFAULT 100,
      head_condition INTEGER DEFAULT 100,
      arm_condition INTEGER DEFAULT 100,
      body_condition INTEGER DEFAULT 100,
      leg_condition INTEGER DEFAULT 100,
      popularity_na REAL DEFAULT 50,
      popularity_sa REAL DEFAULT 30,
      popularity_asia REAL DEFAULT 30,
      popularity_oceania REAL DEFAULT 20,
      popularity_africa REAL DEFAULT 20,
      popularity_europe REAL DEFAULT 40,
      total_matches INTEGER DEFAULT 0,
      total_wins INTEGER DEFAULT 0,
      total_losses INTEGER DEFAULT 0,
      current_title_id INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (promotion_id) REFERENCES promotions(id)
    );
  `);

  // Tabela de Títulos
  db.exec(`
    CREATE TABLE IF NOT EXISTS titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      promotion_id INTEGER NOT NULL,
      prestige REAL DEFAULT 50,
      type TEXT DEFAULT 'singles',
      current_champion_id INTEGER,
      defenses INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (promotion_id) REFERENCES promotions(id),
      FOREIGN KEY (current_champion_id) REFERENCES workers(id)
    );
  `);

  // Tabela de Eventos
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      promotion_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      date DATETIME NOT NULL,
      venue TEXT,
      status TEXT DEFAULT 'scheduled',
      average_rating REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (promotion_id) REFERENCES promotions(id)
    );
  `);

  // Tabela de Resultados de Matches
  db.exec(`
    CREATE TABLE IF NOT EXISTS match_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      worker1_id INTEGER NOT NULL,
      worker2_id INTEGER,
      worker3_id INTEGER,
      worker4_id INTEGER,
      winner_id INTEGER NOT NULL,
      match_type TEXT DEFAULT 'singles',
      title_id INTEGER,
      match_quality REAL,
      segment_rating REAL,
      crowd_reaction TEXT,
      finish_type TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (worker1_id) REFERENCES workers(id),
      FOREIGN KEY (worker2_id) REFERENCES workers(id),
      FOREIGN KEY (worker3_id) REFERENCES workers(id),
      FOREIGN KEY (worker4_id) REFERENCES workers(id),
      FOREIGN KEY (winner_id) REFERENCES workers(id),
      FOREIGN KEY (title_id) REFERENCES titles(id)
    );
  `);

  // Tabela de Lesões
  db.exec(`
    CREATE TABLE IF NOT EXISTS injuries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER NOT NULL,
      injury_type TEXT NOT NULL,
      severity INTEGER DEFAULT 50,
      recovery_weeks INTEGER DEFAULT 4,
      weeks_remaining INTEGER DEFAULT 4,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (worker_id) REFERENCES workers(id)
    );
  `);

  // Tabela de Histórico de Títulos
  db.exec(`
    CREATE TABLE IF NOT EXISTS title_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_id INTEGER NOT NULL,
      champion_id INTEGER NOT NULL,
      reign_start DATETIME NOT NULL,
      reign_end DATETIME,
      defenses INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (title_id) REFERENCES titles(id),
      FOREIGN KEY (champion_id) REFERENCES workers(id)
    );
  `);

  // Tabela de Estatísticas de Lutadores
  db.exec(`
    CREATE TABLE IF NOT EXISTS worker_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER NOT NULL UNIQUE,
      total_matches INTEGER DEFAULT 0,
      total_wins INTEGER DEFAULT 0,
      total_losses INTEGER DEFAULT 0,
      average_match_quality REAL DEFAULT 0,
      average_segment_rating REAL DEFAULT 0,
      title_reigns INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (worker_id) REFERENCES workers(id)
    );
  `);
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

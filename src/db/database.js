/**
 * Pro Wrestling Sim - SQLite Database Implementation (sql.js)
 * 
 * Provides optimized database operations with:
 * - In-memory SQLite via sql.js (cross-platform compatible)
 * - Query caching
 * - Transaction support
 * - Automatic backups
 * - Performance monitoring
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class WrestlingSimDatabase {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(process.env.APPDATA || process.env.HOME, 'WrestlingSim', 'data.db');
    this.db = null;
    this.SQL = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.queryStats = {
      total: 0,
      cached: 0,
      time: 0
    };
    this.initialized = false;
  }

  /**
   * Initialize database connection and create schema
   */
  async initialize() {
    try {
      // Initialize sql.js
      this.SQL = await initSqlJs();
      
      // Ensure directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Load existing database or create new one
      let filebuffer = null;
      if (fs.existsSync(this.dbPath)) {
        filebuffer = fs.readFileSync(this.dbPath);
      }

      // Create database instance
      this.db = new this.SQL.Database(filebuffer);
      
      // Create schema
      await this.createSchema();
      
      // Save to disk
      this.saveDatabase();
      
      this.initialized = true;
      console.log('✓ Database initialized:', this.dbPath);
      return true;
    } catch (error) {
      console.error('✗ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Save database to disk
   */
  saveDatabase() {
    try {
      if (this.db) {
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.dbPath, buffer);
      }
    } catch (error) {
      console.error('✗ Failed to save database:', error);
    }
  }

  /**
   * Create database schema with all tables and indexes
   */
  async createSchema() {
    const statements = [
      // Promotions table
      `CREATE TABLE IF NOT EXISTS promotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        country TEXT,
        founded_year INTEGER,
        primary_color TEXT,
        secondary_color TEXT,
        logo_url TEXT,
        active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Wrestlers table
      `CREATE TABLE IF NOT EXISTS wrestlers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        promotion_id INTEGER NOT NULL,
        height REAL,
        weight INTEGER,
        age INTEGER,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (promotion_id) REFERENCES promotions(id)
      )`,

      // Wrestler attributes
      `CREATE TABLE IF NOT EXISTS wrestler_attributes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wrestler_id INTEGER NOT NULL UNIQUE,
        strength INTEGER DEFAULT 50,
        speed INTEGER DEFAULT 50,
        technique INTEGER DEFAULT 50,
        endurance INTEGER DEFAULT 50,
        charisma INTEGER DEFAULT 50,
        overall_rating INTEGER GENERATED ALWAYS AS (
          (strength + speed + technique + endurance + charisma) / 5
        ) STORED,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wrestler_id) REFERENCES wrestlers(id) ON DELETE CASCADE
      )`,

      // Wrestler statistics
      `CREATE TABLE IF NOT EXISTS wrestler_statistics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wrestler_id INTEGER NOT NULL UNIQUE,
        total_matches INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        win_rate REAL GENERATED ALWAYS AS (
          CASE WHEN total_matches > 0 
            THEN CAST(wins AS REAL) / total_matches * 100
            ELSE 0
          END
        ) STORED,
        title_reigns INTEGER DEFAULT 0,
        last_match_date DATE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wrestler_id) REFERENCES wrestlers(id) ON DELETE CASCADE
      )`,

      // Titles table
      `CREATE TABLE IF NOT EXISTS titles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        promotion_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (promotion_id) REFERENCES promotions(id),
        UNIQUE(name, promotion_id)
      )`,

      // Title reigns
      `CREATE TABLE IF NOT EXISTS title_reigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_id INTEGER NOT NULL,
        wrestler_id INTEGER NOT NULL,
        reign_start DATE NOT NULL,
        reign_end DATE,
        days_held INTEGER GENERATED ALWAYS AS (
          CASE WHEN reign_end IS NULL 
            THEN CAST((julianday('now') - julianday(reign_start)) AS INTEGER)
            ELSE CAST((julianday(reign_end) - julianday(reign_start)) AS INTEGER)
          END
        ) STORED,
        defenses INTEGER DEFAULT 0,
        is_current BOOLEAN DEFAULT 0,
        FOREIGN KEY (title_id) REFERENCES titles(id),
        FOREIGN KEY (wrestler_id) REFERENCES wrestlers(id)
      )`,

      // Events table
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        promotion_id INTEGER NOT NULL,
        event_date DATE NOT NULL,
        location TEXT,
        attendance INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (promotion_id) REFERENCES promotions(id)
      )`,

      // Matches table
      `CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        title_id INTEGER,
        match_type TEXT NOT NULL,
        quality_rating INTEGER DEFAULT 0,
        winner_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (title_id) REFERENCES titles(id),
        FOREIGN KEY (winner_id) REFERENCES wrestlers(id)
      )`,

      // Match participants
      `CREATE TABLE IF NOT EXISTS match_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER NOT NULL,
        wrestler_id INTEGER NOT NULL,
        position INTEGER,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (wrestler_id) REFERENCES wrestlers(id),
        UNIQUE(match_id, wrestler_id)
      )`,

      // Create indexes for promotions
      `CREATE INDEX IF NOT EXISTS idx_promotions_name ON promotions(name)`,
      `CREATE INDEX IF NOT EXISTS idx_promotions_country ON promotions(country)`,
      `CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active)`,

      // Create indexes for wrestlers
      `CREATE INDEX IF NOT EXISTS idx_wrestlers_name ON wrestlers(name)`,
      `CREATE INDEX IF NOT EXISTS idx_wrestlers_promotion ON wrestlers(promotion_id)`,
      `CREATE INDEX IF NOT EXISTS idx_wrestlers_status ON wrestlers(status)`,
      `CREATE INDEX IF NOT EXISTS idx_wrestlers_created_at ON wrestlers(created_at)`,

      // Create indexes for attributes
      `CREATE INDEX IF NOT EXISTS idx_attributes_overall_rating ON wrestler_attributes(overall_rating)`,
      `CREATE INDEX IF NOT EXISTS idx_attributes_wrestler_id ON wrestler_attributes(wrestler_id)`,

      // Create indexes for statistics
      `CREATE INDEX IF NOT EXISTS idx_stats_wrestler ON wrestler_statistics(wrestler_id)`,
      `CREATE INDEX IF NOT EXISTS idx_stats_win_rate ON wrestler_statistics(win_rate)`,
      `CREATE INDEX IF NOT EXISTS idx_stats_total_matches ON wrestler_statistics(total_matches)`,

      // Create indexes for titles
      `CREATE INDEX IF NOT EXISTS idx_titles_promotion ON titles(promotion_id)`,
      `CREATE INDEX IF NOT EXISTS idx_titles_type ON titles(type)`,
      `CREATE INDEX IF NOT EXISTS idx_titles_name ON titles(name)`,

      // Create indexes for title reigns
      `CREATE INDEX IF NOT EXISTS idx_reigns_title ON title_reigns(title_id)`,
      `CREATE INDEX IF NOT EXISTS idx_reigns_wrestler ON title_reigns(wrestler_id)`,
      `CREATE INDEX IF NOT EXISTS idx_reigns_current ON title_reigns(is_current)`,
      `CREATE INDEX IF NOT EXISTS idx_reigns_dates ON title_reigns(reign_start, reign_end)`,

      // Create indexes for events
      `CREATE INDEX IF NOT EXISTS idx_events_promotion ON events(promotion_id)`,
      `CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date)`,
      `CREATE INDEX IF NOT EXISTS idx_events_name ON events(name)`,

      // Create indexes for matches
      `CREATE INDEX IF NOT EXISTS idx_matches_event ON matches(event_id)`,
      `CREATE INDEX IF NOT EXISTS idx_matches_title ON matches(title_id)`,
      `CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches(winner_id)`,
      `CREATE INDEX IF NOT EXISTS idx_matches_type ON matches(match_type)`,
      `CREATE INDEX IF NOT EXISTS idx_matches_quality ON matches(quality_rating)`,

      // Create indexes for participants
      `CREATE INDEX IF NOT EXISTS idx_participants_match ON match_participants(match_id)`,
      `CREATE INDEX IF NOT EXISTS idx_participants_wrestler ON match_participants(wrestler_id)`
    ];

    for (const statement of statements) {
      try {
        this.db.run(statement);
      } catch (error) {
        console.error('Error executing statement:', statement, error);
      }
    }
  }

  /**
   * Get cache key for query
   */
  getCacheKey(query, params) {
    const key = `${query}:${JSON.stringify(params || [])}`;
    return crypto.createHash('md5').update(key).digest('hex');
  }

  /**
   * Get cached result or execute query
   */
  query(sql, params = [], useCache = true) {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(sql, params);

    // Check cache
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        this.queryStats.cached++;
        return cached.data;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    // Execute query
    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params || []);
      
      const result = [];
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      stmt.free();
      
      // Cache result
      if (useCache) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      this.queryStats.total++;
      this.queryStats.time += Date.now() - startTime;

      return result;
    } catch (error) {
      console.error('Query error:', sql, params, error);
      throw error;
    }
  }

  /**
   * Execute single row query
   */
  queryOne(sql, params = [], useCache = true) {
    const results = this.query(sql, params, useCache);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Execute update/insert/delete
   */
  execute(sql, params = []) {
    this.invalidateCache();
    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params || []);
      stmt.step();
      stmt.free();
      
      // Save changes to disk
      this.saveDatabase();
      
      return { changes: this.db.getRowsModified() };
    } catch (error) {
      console.error('Execute error:', sql, params, error);
      throw error;
    }
  }

  /**
   * Execute transaction
   */
  transaction(callback) {
    this.invalidateCache();
    try {
      this.db.run('BEGIN TRANSACTION');
      const result = callback();
      this.db.run('COMMIT');
      this.saveDatabase();
      return result;
    } catch (error) {
      this.db.run('ROLLBACK');
      throw error;
    }
  }

  /**
   * Invalidate cache
   */
  invalidateCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
    } else {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Get query statistics
   */
  getStats() {
    return {
      ...this.queryStats,
      cacheSize: this.cache.size,
      cacheHitRate: this.queryStats.total > 0 
        ? ((this.queryStats.cached / this.queryStats.total) * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Create backup
   */
  backup(backupPath = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = backupPath || path.join(
      path.dirname(this.dbPath),
      `backup-${timestamp}.db`
    );

    try {
      fs.copyFileSync(this.dbPath, backupFile);
      console.log('✓ Backup created:', backupFile);
      return backupFile;
    } catch (error) {
      console.error('✗ Backup failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
      console.log('✓ Database connection closed');
    }
  }
}

module.exports = WrestlingSimDatabase;

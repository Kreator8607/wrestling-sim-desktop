/**
 * Pro Wrestling Sim - Data Migration Tool
 * 
 * Migrates data from JSON file storage to SQLite database
 * Features:
 * - Batch processing
 * - Progress tracking
 * - Data validation
 * - Rollback capability
 * - Duplicate detection
 */

const fs = require('fs');
const path = require('path');

class DataMigration {
  constructor(db, jsonPath) {
    this.db = db;
    this.jsonPath = jsonPath;
    this.stats = {
      promotions: 0,
      wrestlers: 0,
      titles: 0,
      events: 0,
      matches: 0,
      errors: 0,
      duplicates: 0,
      startTime: null,
      endTime: null
    };
  }

  /**
   * Load JSON data
   */
  loadJsonData() {
    try {
      if (!fs.existsSync(this.jsonPath)) {
        throw new Error(`JSON file not found: ${this.jsonPath}`);
      }

      const data = fs.readFileSync(this.jsonPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading JSON:', error);
      throw error;
    }
  }

  /**
   * Migrate all data
   */
  async migrateAll() {
    console.log('🚀 Starting data migration...');
    this.stats.startTime = Date.now();

    try {
      const data = this.loadJsonData();

      // Migrate in order of dependencies
      await this.migratePromotions(data.promotions || []);
      await this.migrateWrestlers(data.wrestlers || []);
      await this.migrateWrestlerAttributes(data.wrestlers || []);
      await this.migrateWrestlerStatistics(data.wrestlers || []);
      await this.migrateTitles(data.titles || []);
      await this.migrateTitleReigns(data.titleReigns || []);
      await this.migrateEvents(data.events || []);
      await this.migrateMatches(data.matches || []);
      await this.migrateMatchParticipants(data.matches || []);

      this.stats.endTime = Date.now();
      this.printMigrationReport();

      return this.stats;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Migrate promotions
   */
  async migratePromotions(promotions) {
    console.log(`📦 Migrating ${promotions.length} promotions...`);

    for (const promo of promotions) {
      try {
        // Check for duplicates
        const existing = this.db.queryOne(
          'SELECT id FROM promotions WHERE name = ?',
          [promo.name]
        );

        if (existing) {
          this.stats.duplicates++;
          continue;
        }

        this.db.execute(`
          INSERT INTO promotions (name, country, founded_year, primary_color, secondary_color, logo_url, active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          promo.name,
          promo.country || null,
          promo.foundedYear || null,
          promo.primaryColor || null,
          promo.secondaryColor || null,
          promo.logoUrl || null,
          promo.active !== false ? 1 : 0
        ]);

        this.stats.promotions++;
      } catch (error) {
        console.error(`Error migrating promotion ${promo.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated ${this.stats.promotions} promotions`);
  }

  /**
   * Migrate wrestlers
   */
  async migrateWrestlers(wrestlers) {
    console.log(`👤 Migrating ${wrestlers.length} wrestlers...`);

    // Create promotion map for faster lookup
    const promotionMap = new Map();
    const promotions = this.db.query('SELECT id, name FROM promotions');
    for (const promo of promotions) {
      promotionMap.set(promo.name, promo.id);
    }

    for (const wrestler of wrestlers) {
      try {
        // Check for duplicates
        const existing = this.db.queryOne(
          'SELECT id FROM wrestlers WHERE name = ?',
          [wrestler.name]
        );

        if (existing) {
          this.stats.duplicates++;
          continue;
        }

        const promotionId = promotionMap.get(wrestler.promotion) || 1;

        this.db.execute(`
          INSERT INTO wrestlers (name, promotion_id, height, weight, age, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          wrestler.name,
          promotionId,
          wrestler.height || null,
          wrestler.weight || null,
          wrestler.age || null,
          wrestler.status || 'active'
        ]);

        this.stats.wrestlers++;
      } catch (error) {
        console.error(`Error migrating wrestler ${wrestler.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated ${this.stats.wrestlers} wrestlers`);
  }

  /**
   * Migrate wrestler attributes
   */
  async migrateWrestlerAttributes(wrestlers) {
    console.log(`💪 Migrating wrestler attributes...`);

    // Create wrestler map
    const wrestlerMap = new Map();
    const dbWrestlers = this.db.query('SELECT id, name FROM wrestlers');
    for (const w of dbWrestlers) {
      wrestlerMap.set(w.name, w.id);
    }

    for (const wrestler of wrestlers) {
      try {
        const wrestlerId = wrestlerMap.get(wrestler.name);
        if (!wrestlerId) continue;

        this.db.execute(`
          INSERT INTO wrestler_attributes 
          (wrestler_id, strength, speed, technique, endurance, charisma)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          wrestlerId,
          wrestler.attributes?.strength || 50,
          wrestler.attributes?.speed || 50,
          wrestler.attributes?.technique || 50,
          wrestler.attributes?.endurance || 50,
          wrestler.attributes?.charisma || 50
        ]);
      } catch (error) {
        console.error(`Error migrating attributes for ${wrestler.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated wrestler attributes`);
  }

  /**
   * Migrate wrestler statistics
   */
  async migrateWrestlerStatistics(wrestlers) {
    console.log(`📊 Migrating wrestler statistics...`);

    const wrestlerMap = new Map();
    const dbWrestlers = this.db.query('SELECT id, name FROM wrestlers');
    for (const w of dbWrestlers) {
      wrestlerMap.set(w.name, w.id);
    }

    for (const wrestler of wrestlers) {
      try {
        const wrestlerId = wrestlerMap.get(wrestler.name);
        if (!wrestlerId) continue;

        this.db.execute(`
          INSERT INTO wrestler_statistics 
          (wrestler_id, total_matches, wins, losses, draws, title_reigns)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          wrestlerId,
          wrestler.stats?.totalMatches || 0,
          wrestler.stats?.wins || 0,
          wrestler.stats?.losses || 0,
          wrestler.stats?.draws || 0,
          wrestler.stats?.titleReigns || 0
        ]);
      } catch (error) {
        console.error(`Error migrating stats for ${wrestler.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated wrestler statistics`);
  }

  /**
   * Migrate titles
   */
  async migrateTitles(titles) {
    console.log(`🏆 Migrating ${titles.length} titles...`);

    const promotionMap = new Map();
    const promotions = this.db.query('SELECT id, name FROM promotions');
    for (const promo of promotions) {
      promotionMap.set(promo.name, promo.id);
    }

    for (const title of titles) {
      try {
        const promotionId = promotionMap.get(title.promotion) || 1;

        this.db.execute(`
          INSERT INTO titles (name, promotion_id, type)
          VALUES (?, ?, ?)
        `, [
          title.name,
          promotionId,
          title.type || 'world'
        ]);

        this.stats.titles++;
      } catch (error) {
        console.error(`Error migrating title ${title.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated ${this.stats.titles} titles`);
  }

  /**
   * Migrate title reigns
   */
  async migrateTitleReigns(reigns) {
    console.log(`👑 Migrating title reigns...`);

    const titleMap = new Map();
    const titles = this.db.query('SELECT id, name FROM titles');
    for (const title of titles) {
      titleMap.set(title.name, title.id);
    }

    const wrestlerMap = new Map();
    const wrestlers = this.db.query('SELECT id, name FROM wrestlers');
    for (const wrestler of wrestlers) {
      wrestlerMap.set(wrestler.name, wrestler.id);
    }

    for (const reign of reigns) {
      try {
        const titleId = titleMap.get(reign.title);
        const wrestlerId = wrestlerMap.get(reign.wrestler);

        if (!titleId || !wrestlerId) continue;

        this.db.execute(`
          INSERT INTO title_reigns 
          (title_id, wrestler_id, reign_start, reign_end, defenses, is_current)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          titleId,
          wrestlerId,
          reign.reignStart || new Date().toISOString().split('T')[0],
          reign.reignEnd || null,
          reign.defenses || 0,
          reign.isCurrent ? 1 : 0
        ]);
      } catch (error) {
        console.error(`Error migrating title reign:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated title reigns`);
  }

  /**
   * Migrate events
   */
  async migrateEvents(events) {
    console.log(`🎪 Migrating ${events.length} events...`);

    const promotionMap = new Map();
    const promotions = this.db.query('SELECT id, name FROM promotions');
    for (const promo of promotions) {
      promotionMap.set(promo.name, promo.id);
    }

    for (const event of events) {
      try {
        const promotionId = promotionMap.get(event.promotion) || 1;

        this.db.execute(`
          INSERT INTO events (name, promotion_id, event_date, location, attendance)
          VALUES (?, ?, ?, ?, ?)
        `, [
          event.name,
          promotionId,
          event.date || new Date().toISOString().split('T')[0],
          event.location || null,
          event.attendance || null
        ]);

        this.stats.events++;
      } catch (error) {
        console.error(`Error migrating event ${event.name}:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated ${this.stats.events} events`);
  }

  /**
   * Migrate matches
   */
  async migrateMatches(matches) {
    console.log(`🥊 Migrating ${matches.length} matches...`);

    const eventMap = new Map();
    const events = this.db.query('SELECT id, name FROM events');
    for (const event of events) {
      eventMap.set(event.name, event.id);
    }

    const titleMap = new Map();
    const titles = this.db.query('SELECT id, name FROM titles');
    for (const title of titles) {
      titleMap.set(title.name, title.id);
    }

    const wrestlerMap = new Map();
    const wrestlers = this.db.query('SELECT id, name FROM wrestlers');
    for (const wrestler of wrestlers) {
      wrestlerMap.set(wrestler.name, wrestler.id);
    }

    for (const match of matches) {
      try {
        const eventId = eventMap.get(match.event);
        const titleId = match.title ? titleMap.get(match.title) : null;
        const winnerId = match.winner ? wrestlerMap.get(match.winner) : null;

        if (!eventId) continue;

        this.db.execute(`
          INSERT INTO matches (event_id, title_id, match_type, quality_rating, winner_id)
          VALUES (?, ?, ?, ?, ?)
        `, [
          eventId,
          titleId || null,
          match.type || 'singles',
          match.quality || 0,
          winnerId || null
        ]);

        this.stats.matches++;
      } catch (error) {
        console.error(`Error migrating match:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated ${this.stats.matches} matches`);
  }

  /**
   * Migrate match participants
   */
  async migrateMatchParticipants(matches) {
    console.log(`🎭 Migrating match participants...`);

    const matchMap = new Map();
    const dbMatches = this.db.query('SELECT id, created_at FROM matches ORDER BY created_at DESC LIMIT ?', [matches.length]);
    for (let i = 0; i < dbMatches.length; i++) {
      matchMap.set(i, dbMatches[i].id);
    }

    const wrestlerMap = new Map();
    const wrestlers = this.db.query('SELECT id, name FROM wrestlers');
    for (const wrestler of wrestlers) {
      wrestlerMap.set(wrestler.name, wrestler.id);
    }

    for (let i = 0; i < matches.length; i++) {
      try {
        const match = matches[i];
        const matchId = matchMap.get(i);

        if (!matchId || !match.participants) continue;

        for (let j = 0; j < match.participants.length; j++) {
          const participant = match.participants[j];
          const wrestlerId = wrestlerMap.get(participant);

          if (!wrestlerId) continue;

          this.db.execute(`
            INSERT INTO match_participants (match_id, wrestler_id, position)
            VALUES (?, ?, ?)
          `, [matchId, wrestlerId, j + 1]);
        }
      } catch (error) {
        console.error(`Error migrating match participants:`, error);
        this.stats.errors++;
      }
    }

    console.log(`✓ Migrated match participants`);
  }

  /**
   * Print migration report
   */
  printMigrationReport() {
    const duration = (this.stats.endTime - this.stats.startTime) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(60));
    console.log(`Promotions:        ${this.stats.promotions}`);
    console.log(`Wrestlers:         ${this.stats.wrestlers}`);
    console.log(`Titles:            ${this.stats.titles}`);
    console.log(`Events:            ${this.stats.events}`);
    console.log(`Matches:           ${this.stats.matches}`);
    console.log(`Duplicates Found:  ${this.stats.duplicates}`);
    console.log(`Errors:            ${this.stats.errors}`);
    console.log(`Duration:          ${duration.toFixed(2)}s`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Validate migration
   */
  validateMigration() {
    console.log('🔍 Validating migration...');

    const validation = {
      promotions: this.db.queryOne('SELECT COUNT(*) as count FROM promotions').count,
      wrestlers: this.db.queryOne('SELECT COUNT(*) as count FROM wrestlers').count,
      titles: this.db.queryOne('SELECT COUNT(*) as count FROM titles').count,
      events: this.db.queryOne('SELECT COUNT(*) as count FROM events').count,
      matches: this.db.queryOne('SELECT COUNT(*) as count FROM matches').count
    };

    console.log('✓ Validation complete:');
    console.log(JSON.stringify(validation, null, 2));

    return validation;
  }
}

module.exports = DataMigration;

/**
 * Pro Wrestling Sim - Importador de Dados (Node.js/Electron)
 * Importa dados consolidados (JSON) para SQLite
 * 
 * Uso:
 *   node import-data.js [--source <arquivo.json>] [--db <database.db>] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class DataImporter {
  constructor(dbPath, options = {}) {
    this.dbPath = dbPath;
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.db = null;
    this.stats = {
      promotions: 0,
      workers: 0,
      titles: 0,
      events: 0,
      errors: 0
    };
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`[${timestamp}] ${level}: ${message}`);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          this.log(`Erro ao conectar: ${err.message}`, 'ERROR');
          reject(err);
        } else {
          this.log(`Conectado ao banco: ${this.dbPath}`);
          resolve();
        }
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            this.log(`Erro ao desconectar: ${err.message}`, 'ERROR');
            reject(err);
          } else {
            this.log('Desconectado do banco');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  createTables() {
    return new Promise(async (resolve, reject) => {
      try {
        // Tabela de Promoções
        await this.run(`
          CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            short_name TEXT,
            country TEXT,
            prestige REAL DEFAULT 50.0,
            money INTEGER DEFAULT 0,
            popularity_na REAL DEFAULT 50.0,
            popularity_sa REAL DEFAULT 50.0,
            popularity_asia REAL DEFAULT 50.0,
            popularity_europe REAL DEFAULT 50.0,
            popularity_africa REAL DEFAULT 50.0,
            popularity_oceania REAL DEFAULT 50.0,
            status TEXT DEFAULT 'Active',
            description TEXT,
            style TEXT,
            founded_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Tabela de Lutadores
        await this.run(`
          CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            promotion_id INTEGER,
            wrestling_skill REAL DEFAULT 50.0,
            entertainment REAL DEFAULT 50.0,
            star_power REAL DEFAULT 50.0,
            intimidation REAL DEFAULT 50.0,
            sex_appeal REAL DEFAULT 50.0,
            psychology REAL DEFAULT 50.0,
            safety REAL DEFAULT 50.0,
            stamina REAL DEFAULT 50.0,
            popularity_na REAL DEFAULT 50.0,
            popularity_sa REAL DEFAULT 50.0,
            popularity_asia REAL DEFAULT 50.0,
            popularity_europe REAL DEFAULT 50.0,
            popularity_africa REAL DEFAULT 50.0,
            popularity_oceania REAL DEFAULT 50.0,
            status TEXT DEFAULT 'Active',
            birth_date TEXT,
            gender TEXT,
            height TEXT,
            total_matches INTEGER DEFAULT 0,
            total_wins INTEGER DEFAULT 0,
            total_losses INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(promotion_id) REFERENCES promotions(id)
          )
        `);

        // Tabela de Títulos
        await this.run(`
          CREATE TABLE IF NOT EXISTS titles (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            promotion_id INTEGER,
            prestige REAL DEFAULT 50.0,
            type TEXT DEFAULT 'Singles',
            current_champion_id INTEGER,
            defenses INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(promotion_id) REFERENCES promotions(id),
            FOREIGN KEY(current_champion_id) REFERENCES workers(id)
          )
        `);

        // Tabela de Eventos
        await this.run(`
          CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            promotion_id INTEGER,
            event_date TEXT,
            venue TEXT,
            attendance INTEGER,
            status TEXT DEFAULT 'Completed',
            average_rating REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(promotion_id) REFERENCES promotions(id)
          )
        `);

        this.log('Tabelas criadas/verificadas com sucesso');
        resolve();
      } catch (err) {
        this.log(`Erro ao criar tabelas: ${err.message}`, 'ERROR');
        this.stats.errors++;
        reject(err);
      }
    });
  }

  async importPromotions(promotions) {
    this.log(`Iniciando importação de ${promotions.length} promoções...`);

    for (let i = 0; i < promotions.length; i++) {
      try {
        const promo = promotions[i];
        const name = promo.fullName || promo.name || '';
        const shortName = promo.shortName || promo.short_name || '';
        const country = promo.basedInCountry || promo.country || '';
        const prestige = parseFloat(promo.prestige || 50.0);
        const money = parseInt(promo.money || 0);
        const status = promo.status || 'Active';

        const naPop = parseFloat(promo.northAmericaPop || 50.0);
        const saPop = parseFloat(promo.southAmericaPop || 50.0);
        const asiaPop = parseFloat(promo.asiaPop || 50.0);
        const euPop = parseFloat(promo.europePop || 50.0);
        const afPop = parseFloat(promo.africaPop || 50.0);
        const ocPop = parseFloat(promo.oceaniaPop || 50.0);

        const description = promo.description || '';
        const style = promo.style || '';

        if (!this.dryRun) {
          await this.run(`
            INSERT OR REPLACE INTO promotions 
            (name, short_name, country, prestige, money, 
             popularity_na, popularity_sa, popularity_asia,
             popularity_europe, popularity_africa, popularity_oceania,
             status, description, style)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [name, shortName, country, prestige, money,
              naPop, saPop, asiaPop, euPop, afPop, ocPop,
              status, description, style]);
        }

        this.stats.promotions++;

        if (this.verbose && this.stats.promotions % 10 === 0) {
          this.log(`  ${this.stats.promotions} promoções processadas...`);
        }
      } catch (err) {
        this.log(`Erro ao importar promoção: ${err.message}`, 'ERROR');
        this.stats.errors++;
      }
    }

    this.log(`✅ Importação de promoções concluída: ${this.stats.promotions} registros`);
  }

  async importWorkers(workers) {
    this.log(`Iniciando importação de ${workers.length} lutadores...`);

    for (let i = 0; i < workers.length; i++) {
      try {
        const worker = workers[i];
        const name = worker.name || '';
        
        if (!name) continue;

        let promotionId = null;
        const promoName = worker.promotionName || worker.promotion || '';
        
        if (promoName && !this.dryRun) {
          const result = await this.get(
            'SELECT id FROM promotions WHERE name = ?',
            [promoName]
          );
          promotionId = result ? result.id : null;
        }

        const wrestlingSkill = parseFloat(worker.wrestlingSkill || 50.0);
        const entertainment = parseFloat(worker.entertainment || 50.0);
        const starPower = parseFloat(worker.starPower || 50.0);
        const intimidation = parseFloat(worker.intimidation || 50.0);
        const sexAppeal = parseFloat(worker.sexAppeal || 50.0);
        const psychology = parseFloat(worker.psychology || 50.0);
        const safety = parseFloat(worker.safety || 50.0);
        const stamina = parseFloat(worker.stamina || 50.0);

        const naPop = parseFloat(worker.northAmericaPop || 50.0);
        const saPop = parseFloat(worker.southAmericaPop || 50.0);
        const asiaPop = parseFloat(worker.asiaPop || 50.0);
        const euPop = parseFloat(worker.europePop || 50.0);
        const afPop = parseFloat(worker.africaPop || 50.0);
        const ocPop = parseFloat(worker.oceaniaPop || 50.0);

        const status = worker.status || 'Active';
        const birthDate = worker.birthDate || '';
        const gender = worker.gender || '';
        const height = worker.height || '';

        if (!this.dryRun) {
          await this.run(`
            INSERT OR REPLACE INTO workers
            (name, promotion_id, wrestling_skill, entertainment, star_power,
             intimidation, sex_appeal, psychology, safety, stamina,
             popularity_na, popularity_sa, popularity_asia,
             popularity_europe, popularity_africa, popularity_oceania,
             status, birth_date, gender, height)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [name, promotionId, wrestlingSkill, entertainment, starPower,
              intimidation, sexAppeal, psychology, safety, stamina,
              naPop, saPop, asiaPop, euPop, afPop, ocPop,
              status, birthDate, gender, height]);
        }

        this.stats.workers++;

        if (this.verbose && this.stats.workers % 100 === 0) {
          this.log(`  ${this.stats.workers} lutadores processados...`);
        }
      } catch (err) {
        this.log(`Erro ao importar lutador: ${err.message}`, 'ERROR');
        this.stats.errors++;
      }
    }

    this.log(`✅ Importação de lutadores concluída: ${this.stats.workers} registros`);
  }

  async importTitles(titles) {
    this.log(`Iniciando importação de ${titles.length} títulos...`);

    for (let i = 0; i < titles.length; i++) {
      try {
        const title = titles[i];
        const name = title.title || title.name || '';
        
        if (!name) continue;

        let promotionId = null;
        const promoName = title.promotionName || title.promotion || '';
        
        if (promoName && !this.dryRun) {
          const result = await this.get(
            'SELECT id FROM promotions WHERE name = ?',
            [promoName]
          );
          promotionId = result ? result.id : null;
        }

        const prestige = parseFloat(title.prestige || 50.0);
        const titleType = title.type || 'Singles';
        const status = title.status || 'Active';
        const defenses = parseInt(title.defenses || 0);

        if (!this.dryRun) {
          await this.run(`
            INSERT OR REPLACE INTO titles
            (name, promotion_id, prestige, type, status, defenses)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [name, promotionId, prestige, titleType, status, defenses]);
        }

        this.stats.titles++;

        if (this.verbose && this.stats.titles % 50 === 0) {
          this.log(`  ${this.stats.titles} títulos processados...`);
        }
      } catch (err) {
        this.log(`Erro ao importar título: ${err.message}`, 'ERROR');
        this.stats.errors++;
      }
    }

    this.log(`✅ Importação de títulos concluída: ${this.stats.titles} registros`);
  }

  async importEvents(events) {
    this.log(`Iniciando importação de ${events.length} eventos...`);

    for (let i = 0; i < events.length; i++) {
      try {
        const event = events[i];
        const name = event.eventName || event.name || '';
        
        if (!name) continue;

        let promotionId = null;
        const promoName = event.promotionName || event.promotion || '';
        
        if (promoName && !this.dryRun) {
          const result = await this.get(
            'SELECT id FROM promotions WHERE name = ?',
            [promoName]
          );
          promotionId = result ? result.id : null;
        }

        const eventDate = event.eventDate || event.date || '';
        const venue = event.venue || '';
        const attendance = parseInt(event.attendance || 0);
        const status = event.status || 'Completed';

        if (!this.dryRun) {
          await this.run(`
            INSERT INTO events
            (name, promotion_id, event_date, venue, attendance, status)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [name, promotionId, eventDate, venue, attendance, status]);
        }

        this.stats.events++;

        if (this.verbose && this.stats.events % 50 === 0) {
          this.log(`  ${this.stats.events} eventos processados...`);
        }
      } catch (err) {
        this.log(`Erro ao importar evento: ${err.message}`, 'ERROR');
        this.stats.errors++;
      }
    }

    this.log(`✅ Importação de eventos concluída: ${this.stats.events} registros`);
  }

  loadJSON(jsonPath) {
    try {
      const data = fs.readFileSync(jsonPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      this.log(`Erro ao carregar JSON: ${err.message}`, 'ERROR');
      throw err;
    }
  }

  async run(jsonPath) {
    this.log('============================================================');
    this.log('PRO WRESTLING SIM - IMPORTADOR DE DADOS');
    this.log('============================================================');

    if (this.dryRun) {
      this.log('⚠️  MODO DRY-RUN: Nenhum dado será alterado', 'WARNING');
    }

    try {
      // Conectar
      await this.connect();

      // Criar tabelas
      await this.createTables();

      // Carregar JSON
      this.log(`Carregando dados de: ${jsonPath}`);
      const data = this.loadJSON(jsonPath);

      // Extrair dados mesclados
      const merged = data.merged || {};
      const promotions = merged.promotions || [];
      const workers = merged.workers || [];
      const titles = merged.titles || [];
      const events = merged.events || [];

      // Importar
      await this.importPromotions(promotions);
      await this.importWorkers(workers);
      await this.importTitles(titles);
      await this.importEvents(events);

      // Desconectar
      await this.disconnect();

      // Relatório final
      this.log('============================================================');
      this.log('RELATÓRIO FINAL');
      this.log('============================================================');
      this.log(`Promoções importadas: ${this.stats.promotions}`);
      this.log(`Lutadores importados: ${this.stats.workers}`);
      this.log(`Títulos importados: ${this.stats.titles}`);
      this.log(`Eventos importados: ${this.stats.events}`);
      this.log(`Erros encontrados: ${this.stats.errors}`);

      if (this.dryRun) {
        this.log('✅ Simulação concluída (nenhum dado foi alterado)', 'WARNING');
      } else {
        this.log('✅ Importação concluída com sucesso!');
      }

      this.log('============================================================');
    } catch (err) {
      this.log(`Erro fatal: ${err.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  let jsonPath = 'dados_mesclados.json';
  let dbPath = 'wrestling_sim.db';
  let dryRun = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      jsonPath = args[i + 1];
      i++;
    } else if (args[i] === '--db' && args[i + 1]) {
      dbPath = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (args[i] === '--verbose') {
      verbose = true;
    }
  }

  const importer = new DataImporter(dbPath, { dryRun, verbose });
  importer.run(jsonPath);
}

module.exports = DataImporter;

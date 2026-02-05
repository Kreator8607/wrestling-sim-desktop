import { getDatabase } from './database.js';

export function simulateMatch(worker1, worker2, matchType = 'singles') {
  // Calcular score de cada lutador baseado em atributos
  const score1 = calculateWorkerScore(worker1);
  const score2 = calculateWorkerScore(worker2);

  // Determinar vencedor com base em probabilidade
  const totalScore = score1 + score2;
  const probability1 = score1 / totalScore;
  const random = Math.random();

  const winner = random < probability1 ? worker1 : worker2;
  const loser = winner.id === worker1.id ? worker2 : worker1;

  // Calcular qualidade do match
  const matchQuality = calculateMatchQuality(worker1, worker2);
  const segmentRating = calculateSegmentRating(matchQuality);
  const crowdReaction = getCrowdReaction(matchQuality);
  const finishType = getRandomFinishType();

  return {
    winnerId: winner.id,
    matchQuality,
    segmentRating,
    crowdReaction,
    finishType,
    description: `${winner.name} venceu contra ${loser.name}`,
  };
}

function calculateWorkerScore(worker) {
  // Peso dos atributos
  const weights = {
    wrestling_skill: 0.25,
    entertainment: 0.15,
    star_power: 0.20,
    intimidation: 0.15,
    psychology: 0.15,
    stamina: 0.10,
  };

  let score = 0;
  score += worker.wrestling_skill * weights.wrestling_skill;
  score += worker.entertainment * weights.entertainment;
  score += worker.star_power * weights.star_power;
  score += worker.intimidation * weights.intimidation;
  score += worker.psychology * weights.psychology;
  score += worker.stamina * weights.stamina;

  // Adicionar variação aleatória (±10%)
  const variance = (Math.random() - 0.5) * 0.2 * score;
  return Math.max(0, score + variance);
}

function calculateMatchQuality(worker1, worker2) {
  // Qualidade baseada em wrestling skill e psychology
  const avgSkill = (worker1.wrestling_skill + worker2.wrestling_skill) / 2;
  const avgPsychology = (worker1.psychology + worker2.psychology) / 2;

  const baseQuality = (avgSkill * 0.6 + avgPsychology * 0.4) / 100 * 10;
  const variance = (Math.random() - 0.5) * 2;

  return Math.max(1, Math.min(10, baseQuality + variance));
}

function calculateSegmentRating(matchQuality) {
  // Rating baseado na qualidade do match
  const baseRating = matchQuality * 0.8;
  const variance = (Math.random() - 0.5) * 1;

  return Math.max(1, Math.min(10, baseRating + variance));
}

function getCrowdReaction(matchQuality) {
  if (matchQuality >= 8.5) return 'Incrível!';
  if (matchQuality >= 8) return 'Excelente!';
  if (matchQuality >= 7) return 'Muito Bom';
  if (matchQuality >= 6) return 'Bom';
  return 'Aceitável';
}

function getRandomFinishType() {
  const finishes = ['Pinfall', 'Submission', 'Finisher', 'Rollup', 'Contagem', 'Desqualificação'];
  return finishes[Math.floor(Math.random() * finishes.length)];
}

export function updateWorkerStats(db, workerId, isWinner) {
  const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(workerId);
  
  if (!worker) return;

  const totalMatches = worker.total_matches + 1;
  const totalWins = isWinner ? worker.total_wins + 1 : worker.total_wins;
  const totalLosses = !isWinner ? worker.total_losses + 1 : worker.total_losses;

  // Atualizar popularidade baseado em vitória/derrota
  const popularityChange = isWinner ? 15 : -5;

  db.prepare(`
    UPDATE workers SET
      total_matches = ?,
      total_wins = ?,
      total_losses = ?,
      popularity_na = MAX(0, MIN(100, popularity_na + ?)),
      popularity_sa = MAX(0, MIN(100, popularity_sa + ?)),
      popularity_asia = MAX(0, MIN(100, popularity_asia + ?)),
      popularity_oceania = MAX(0, MIN(100, popularity_oceania + ?)),
      popularity_africa = MAX(0, MIN(100, popularity_africa + ?)),
      popularity_europe = MAX(0, MIN(100, popularity_europe + ?))
    WHERE id = ?
  `).run(
    totalMatches,
    totalWins,
    totalLosses,
    popularityChange,
    popularityChange,
    popularityChange,
    popularityChange,
    popularityChange,
    popularityChange,
    workerId
  );
}

export function updateEventRating(db, eventId) {
  const matches = db.prepare('SELECT segment_rating FROM match_results WHERE event_id = ?').all(eventId);
  
  if (matches.length === 0) return;

  const avgRating = matches.reduce((sum, m) => sum + m.segment_rating, 0) / matches.length;

  db.prepare('UPDATE events SET average_rating = ? WHERE id = ?').run(avgRating, eventId);
}

export function updateTitleChampion(db, titleId, newChampionId, eventId) {
  const title = db.prepare('SELECT * FROM titles WHERE id = ?').get(titleId);
  
  if (!title) return;

  // Registrar novo reinado no histórico
  if (title.current_champion_id) {
    db.prepare(`
      INSERT INTO title_history (title_id, champion_id, reign_start, reign_end, defenses)
      SELECT id, current_champion_id, 
        (SELECT MIN(created_at) FROM match_results WHERE winner_id = current_champion_id AND title_id = ?),
        CURRENT_TIMESTAMP,
        defenses
      FROM titles WHERE id = ?
    `).run(titleId, titleId);
  }

  // Atualizar campeão atual
  db.prepare(`
    UPDATE titles SET
      current_champion_id = ?,
      defenses = 1
    WHERE id = ?
  `).run(newChampionId, titleId);

  // Iniciar novo reinado no histórico
  db.prepare(`
    INSERT INTO title_history (title_id, champion_id, reign_start, defenses)
    VALUES (?, ?, CURRENT_TIMESTAMP, 0)
  `).run(titleId, newChampionId);
}

export function processAutoSimulation(db, config) {
  const promotionId = config.promotionId;
  const numberOfEvents = config.numberOfEvents;
  const matchesPerEvent = config.matchesPerEvent;

  // Obter lutadores da promoção
  const workers = db.prepare('SELECT * FROM workers WHERE promotion_id = ? LIMIT 200').all(promotionId);

  if (workers.length < 2) {
    throw new Error('Promoção não tem lutadores suficientes');
  }

  const results = {
    eventsCreated: 0,
    matchesSimulated: 0,
    errors: [],
  };

  // Criar eventos
  for (let eventNum = 1; eventNum <= numberOfEvents; eventNum++) {
    try {
      // Criar evento
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + eventNum - 1);

      const eventResult = db.prepare(`
        INSERT INTO events (promotion_id, name, date, venue, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        promotionId,
        `${config.eventNamePrefix} #${eventNum}`,
        eventDate.toISOString(),
        `Arena ${eventNum}`,
        'scheduled'
      );

      const eventId = eventResult.lastInsertRowid;

      // Simular matches
      for (let matchNum = 1; matchNum <= matchesPerEvent; matchNum++) {
        try {
          // Selecionar dois lutadores aleatórios
          const worker1 = workers[Math.floor(Math.random() * workers.length)];
          let worker2 = workers[Math.floor(Math.random() * workers.length)];

          // Garantir que são lutadores diferentes
          while (worker2.id === worker1.id) {
            worker2 = workers[Math.floor(Math.random() * workers.length)];
          }

          // Simular match
          const matchResult = simulateMatch(worker1, worker2, 'singles');

          // Salvar resultado
          db.prepare(`
            INSERT INTO match_results (
              event_id, worker1_id, worker2_id, winner_id,
              match_type, match_quality, segment_rating,
              crowd_reaction, finish_type, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            eventId,
            worker1.id,
            worker2.id,
            matchResult.winnerId,
            'singles',
            matchResult.matchQuality,
            matchResult.segmentRating,
            matchResult.crowdReaction,
            matchResult.finishType,
            matchResult.description
          );

          // Atualizar estatísticas dos lutadores
          updateWorkerStats(db, worker1.id, worker1.id === matchResult.winnerId);
          updateWorkerStats(db, worker2.id, worker2.id === matchResult.winnerId);

          results.matchesSimulated++;
        } catch (error) {
          results.errors.push(`Erro no match ${matchNum}: ${error.message}`);
        }
      }

      // Atualizar rating do evento
      updateEventRating(db, eventId);

      results.eventsCreated++;
    } catch (error) {
      results.errors.push(`Erro no evento ${eventNum}: ${error.message}`);
    }
  }

  return results;
}

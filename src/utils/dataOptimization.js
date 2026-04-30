/**
 * Data Optimization Utilities
 * Implements caching, memoization, and efficient data structures
 */

// Simple LRU Cache implementation
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Global caches
const wrestlerCache = new LRUCache(200);
const matchCache = new LRUCache(100);
const statsCache = new LRUCache(50);

/**
 * Compute wrestler overall rating efficiently
 */
export function computeWrestlerRating(wrestler) {
  const cacheKey = `rating_${wrestler.id}`;
  const cached = statsCache.get(cacheKey);
  
  if (cached !== null) return cached;

  const rating = Math.round(
    (wrestler.wrestlingSkill +
      wrestler.entertainment +
      wrestler.starPower +
      wrestler.intimidation +
      wrestler.sexAppeal) /
      5
  );

  statsCache.set(cacheKey, rating);
  return rating;
}

/**
 * Compute match prediction efficiently
 */
export function predictMatchOutcome(wrestler1, wrestler2) {
  const cacheKey = `match_${Math.min(wrestler1.id, wrestler2.id)}_${Math.max(wrestler1.id, wrestler2.id)}`;
  const cached = matchCache.get(cacheKey);
  
  if (cached !== null) return cached;

  const rating1 = computeWrestlerRating(wrestler1);
  const rating2 = computeWrestlerRating(wrestler2);
  const total = rating1 + rating2;

  const prediction = {
    wrestler1Odds: Math.round((rating1 / total) * 100),
    wrestler2Odds: Math.round((rating2 / total) * 100),
    expectedQuality: Math.round((rating1 + rating2) / 2),
  };

  matchCache.set(cacheKey, prediction);
  return prediction;
}

/**
 * Batch compute wrestler ratings
 */
export function batchComputeRatings(wrestlers) {
  return wrestlers.map((w) => ({
    ...w,
    rating: computeWrestlerRating(w),
  }));
}

/**
 * Filter wrestlers efficiently with caching
 */
export function filterWrestlers(wrestlers, criteria) {
  const cacheKey = `filter_${JSON.stringify(criteria)}`;
  const cached = wrestlerCache.get(cacheKey);
  
  if (cached !== null) return cached;

  let filtered = wrestlers;

  if (criteria.minRating) {
    filtered = filtered.filter(
      (w) => computeWrestlerRating(w) >= criteria.minRating
    );
  }

  if (criteria.promotion) {
    filtered = filtered.filter((w) => w.promotion === criteria.promotion);
  }

  if (criteria.minWins) {
    filtered = filtered.filter((w) => (w.wins || 0) >= criteria.minWins);
  }

  if (criteria.search) {
    const searchLower = criteria.search.toLowerCase();
    filtered = filtered.filter((w) =>
      w.name.toLowerCase().includes(searchLower)
    );
  }

  wrestlerCache.set(cacheKey, filtered);
  return filtered;
}

/**
 * Sort wrestlers efficiently
 */
export function sortWrestlers(wrestlers, sortBy = 'rating', order = 'desc') {
  const sorted = [...wrestlers].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'rating':
        valueA = computeWrestlerRating(a);
        valueB = computeWrestlerRating(b);
        break;
      case 'wins':
        valueA = a.wins || 0;
        valueB = b.wins || 0;
        break;
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (order === 'asc') {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });

  return sorted;
}

/**
 * Compute match statistics efficiently
 */
export function computeMatchStats(matches) {
  const cacheKey = `stats_${matches.length}`;
  const cached = statsCache.get(cacheKey);
  
  if (cached !== null) return cached;

  const stats = {
    totalMatches: matches.length,
    averageQuality: Math.round(
      matches.reduce((sum, m) => sum + (m.quality || 0), 0) / matches.length
    ),
    totalAttendance: matches.reduce((sum, m) => sum + (m.attendance || 0), 0),
    matchTypes: {},
    promotionStats: {},
  };

  matches.forEach((match) => {
    // Count match types
    stats.matchTypes[match.type] = (stats.matchTypes[match.type] || 0) + 1;

    // Count promotion stats
    if (!stats.promotionStats[match.promotion]) {
      stats.promotionStats[match.promotion] = {
        count: 0,
        avgQuality: 0,
        totalQuality: 0,
      };
    }
    stats.promotionStats[match.promotion].count++;
    stats.promotionStats[match.promotion].totalQuality += match.quality || 0;
  });

  // Calculate average quality per promotion
  Object.keys(stats.promotionStats).forEach((promo) => {
    const data = stats.promotionStats[promo];
    data.avgQuality = Math.round(data.totalQuality / data.count);
  });

  statsCache.set(cacheKey, stats);
  return stats;
}

/**
 * Debounce function for expensive operations
 */
export function debounce(func, delay) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle(func, limit) {
  let inThrottle;
  return function throttled(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results
 */
export function memoize(func) {
  const cache = new Map();
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Batch operations for better performance
 */
export class BatchProcessor {
  constructor(batchSize = 50, processFn) {
    this.batchSize = batchSize;
    this.processFn = processFn;
    this.queue = [];
  }

  add(item) {
    this.queue.push(item);
    if (this.queue.length >= this.batchSize) {
      this.process();
    }
  }

  process() {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0, this.batchSize);
    this.processFn(batch);
  }

  flush() {
    this.process();
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  wrestlerCache.clear();
  matchCache.clear();
  statsCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    wrestlerCache: wrestlerCache.cache.size,
    matchCache: matchCache.cache.size,
    statsCache: statsCache.cache.size,
  };
}

export default {
  computeWrestlerRating,
  predictMatchOutcome,
  batchComputeRatings,
  filterWrestlers,
  sortWrestlers,
  computeMatchStats,
  debounce,
  throttle,
  memoize,
  BatchProcessor,
  clearAllCaches,
  getCacheStats,
};

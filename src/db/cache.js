/**
 * Pro Wrestling Sim - Advanced Caching System
 * 
 * Multi-layer caching architecture:
 * - Level 1: Memory cache (5 minute TTL)
 * - Level 2: IndexedDB cache (persistent)
 * - Level 3: Query result cache
 */

class CacheManager {
  constructor(options = {}) {
    this.memoryCache = new Map();
    this.queryCache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    
    this.options = {
      memoryTTL: options.memoryTTL || 5 * 60 * 1000, // 5 minutes
      queryTTL: options.queryTTL || 10 * 60 * 1000, // 10 minutes
      maxMemoryItems: options.maxMemoryItems || 1000,
      maxQueryItems: options.maxQueryItems || 500
    };
  }

  /**
   * Get cache key hash
   */
  getKey(namespace, id) {
    return `${namespace}:${id}`;
  }

  /**
   * Get value from cache
   */
  get(namespace, id) {
    const key = this.getKey(namespace, id);
    const cached = this.memoryCache.get(key);

    if (!cached) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - cached.timestamp > this.options.memoryTTL) {
      this.memoryCache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return cached.value;
  }

  /**
   * Set value in cache
   */
  set(namespace, id, value) {
    const key = this.getKey(namespace, id);

    // Evict oldest if at capacity
    if (this.memoryCache.size >= this.options.maxMemoryItems) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, {
      value,
      timestamp: Date.now()
    });

    this.stats.sets++;
  }

  /**
   * Cache query result
   */
  cacheQuery(query, params, result) {
    const key = this.getQueryKey(query, params);

    if (this.queryCache.size >= this.options.maxQueryItems) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }

    this.queryCache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached query result
   */
  getCachedQuery(query, params) {
    const key = this.getQueryKey(query, params);
    const cached = this.queryCache.get(key);

    if (!cached) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - cached.timestamp > this.options.queryTTL) {
      this.queryCache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return cached.result;
  }

  /**
   * Get query cache key
   */
  getQueryKey(query, params) {
    const crypto = require('crypto');
    const key = `${query}:${JSON.stringify(params || [])}`;
    return crypto.createHash('md5').update(key).digest('hex');
  }

  /**
   * Invalidate cache by namespace
   */
  invalidate(namespace) {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(namespace)) {
        this.memoryCache.delete(key);
        this.stats.deletes++;
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.memoryCache.size + this.queryCache.size;
    this.memoryCache.clear();
    this.queryCache.clear();
    this.stats.deletes += size;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%',
      memoryItems: this.memoryCache.size,
      queryItems: this.queryCache.size,
      totalItems: this.memoryCache.size + this.queryCache.size
    };
  }

  /**
   * Warm cache with common queries
   */
  warmCache(db, queries) {
    console.log('🔥 Warming cache with common queries...');
    
    for (const query of queries) {
      try {
        const result = db.query(query.sql, query.params || []);
        this.cacheQuery(query.sql, query.params || [], result);
      } catch (error) {
        console.error('Error warming cache:', error);
      }
    }

    console.log('✓ Cache warmed');
  }
}

/**
 * Query result cache with LRU eviction
 */
class LRUCache {
  constructor(maxSize = 350) {
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

  size() {
    return this.cache.size;
  }
}

/**
 * Debounce function for cache invalidation
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for cache updates
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Cache invalidation patterns
 */
const CachePatterns = {
  WRESTLER: 'wrestler',
  PROMOTION: 'promotion',
  TITLE: 'title',
  MATCH: 'match',
  EVENT: 'event',
  LEADERBOARD: 'leaderboard',
  STATISTICS: 'statistics'
};

/**
 * Common warm cache queries
 */
const WarmCacheQueries = [
  {
    name: 'All Promotions',
    sql: 'SELECT * FROM promotions WHERE active = 1'
  },
  {
    name: 'Top 100 Wrestlers',
    sql: `SELECT w.*, wa.overall_rating 
           FROM wrestlers w 
           JOIN wrestler_attributes wa ON w.id = wa.wrestler_id 
           ORDER BY wa.overall_rating DESC 
           LIMIT 100`
  },
  {
    name: 'Recent Matches',
    sql: `SELECT * FROM matches 
           ORDER BY created_at DESC 
           LIMIT 50`
  },
  {
    name: 'Current Title Holders',
    sql: `SELECT t.*, w.name as champion 
           FROM titles t 
           LEFT JOIN title_reigns tr ON t.id = tr.title_id AND tr.is_current = 1
           LEFT JOIN wrestlers w ON tr.wrestler_id = w.id`
  }
];

module.exports = {
  CacheManager,
  LRUCache,
  debounce,
  throttle,
  CachePatterns,
  WarmCacheQueries
};

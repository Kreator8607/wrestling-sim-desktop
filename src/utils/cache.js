/**
 * Cache Management System
 * Handles in-memory and localStorage caching with TTL support
 */

const memoryCache = new Map();

export const CacheManager = {
  /**
   * Set a value in cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (0 = no expiry)
   */
  set(key, value, ttl = 0) {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    memoryCache.set(key, entry);

    // Also save to localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if expired/not found
   */
  get(key) {
    let entry = memoryCache.get(key);

    // Try localStorage if not in memory
    if (!entry) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          memoryCache.set(key, entry);
        }
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
      }
    }

    if (!entry) return null;

    // Check if expired
    if (entry.ttl > 0) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        this.delete(key);
        return null;
      }
    }

    return entry.value;
  },

  /**
   * Delete a cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },

  /**
   * Clear all cache
   */
  clear() {
    memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  },

  /**
   * Get cache size in bytes
   */
  getSize() {
    let size = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          size += localStorage.getItem(key).length;
        }
      });
    } catch (e) {
      console.warn('Failed to calculate cache size:', e);
    }
    return size;
  },

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    // Clean memory cache
    for (const [key, entry] of memoryCache.entries()) {
      if (entry.ttl > 0 && now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  },
};

/**
 * Memoization decorator for functions
 * @param {function} fn - Function to memoize
 * @param {number} ttl - Time to live in milliseconds
 */
export function memoize(fn, ttl = 60000) {
  return function (...args) {
    const key = `${fn.name}_${JSON.stringify(args)}`;
    const cached = CacheManager.get(key);

    if (cached !== null) {
      return cached;
    }

    const result = fn.apply(this, args);
    CacheManager.set(key, result, ttl);
    return result;
  };
}

/**
 * Debounce function execution
 * @param {function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function execution
 * @param {function} fn - Function to throttle
 * @param {number} limit - Limit in milliseconds
 */
export function throttle(fn, limit = 300) {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      fn.apply(this, args);
      lastRun = now;
    }
  };
}

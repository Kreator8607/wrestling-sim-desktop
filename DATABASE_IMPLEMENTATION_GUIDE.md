# Pro Wrestling Sim - Database Optimization Implementation Guide

**Version**: 1.0  
**Created**: April 30, 2024  
**Target**: v4.0.0  
**Status**: Ready for Implementation

---

## 📋 Quick Start

### Installation

```bash
# Install required dependencies
npm install better-sqlite3

# Or with yarn
yarn add better-sqlite3
```

### Basic Usage

```javascript
const WrestlingSimDatabase = require('./src/db/database');
const WrestlingSimQueries = require('./src/db/queries');
const { CacheManager } = require('./src/db/cache');
const DataMigration = require('./src/db/migrate');
const PerformanceBenchmark = require('./src/db/benchmark');

// Initialize database
const db = new WrestlingSimDatabase();
await db.initialize();

// Create query layer
const queries = new WrestlingSimQueries(db);

// Create cache manager
const cache = new CacheManager();

// Get wrestler
const wrestler = queries.getWrestlerById(1);
console.log(wrestler);
```

---

## 🏗️ Architecture Overview

### File Structure

```
src/db/
├── database.js          # Core database implementation
├── queries.js           # Pre-optimized query layer
├── cache.js             # Multi-layer caching system
├── migrate.js           # JSON to SQLite migration
└── benchmark.js         # Performance monitoring
```

### Component Responsibilities

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **database.js** | Core DB operations | Connection pooling, schema creation, transactions |
| **queries.js** | Pre-optimized queries | Leaderboards, searches, analytics |
| **cache.js** | Multi-layer caching | Memory cache, query cache, LRU eviction |
| **migrate.js** | Data migration | Batch processing, validation, error handling |
| **benchmark.js** | Performance testing | Benchmarking, comparison, reporting |

---

## 🚀 Implementation Steps

### Phase 1: Setup (Day 1)

#### Step 1: Install Dependencies
```bash
npm install better-sqlite3
```

#### Step 2: Create Database Files
```bash
# Copy database files to project
cp src/db/database.js src/db/database.js
cp src/db/queries.js src/db/queries.js
cp src/db/cache.js src/db/cache.js
```

#### Step 3: Initialize Database
```javascript
const db = new WrestlingSimDatabase();
await db.initialize();
console.log('✓ Database initialized');
```

### Phase 2: Migration (Day 2-3)

#### Step 1: Prepare Data
```javascript
// Ensure JSON data is available
const jsonPath = './data/wrestlers.json';
```

#### Step 2: Run Migration
```javascript
const migration = new DataMigration(db, jsonPath);
const stats = await migration.migrateAll();
console.log('✓ Migration complete:', stats);
```

#### Step 3: Validate
```javascript
const validation = migration.validateMigration();
console.log('✓ Validation passed:', validation);
```

### Phase 3: Integration (Day 4-5)

#### Step 1: Replace JSON Queries
```javascript
// OLD (JSON)
const wrestlers = require('./data/wrestlers.json');
const wrestler = wrestlers.find(w => w.id === 1);

// NEW (SQLite)
const queries = new WrestlingSimQueries(db);
const wrestler = queries.getWrestlerById(1);
```

#### Step 2: Add Caching
```javascript
const cache = new CacheManager();

// Cache wrestler data
cache.set('wrestler', 1, wrestler);

// Get from cache
const cached = cache.get('wrestler', 1);
```

#### Step 3: Test Performance
```javascript
const benchmark = new PerformanceBenchmark(db, cache);
await benchmark.runAll();
benchmark.compareWithJSON();
```

---

## 📊 Query Examples

### Get Wrestler with Full Details
```javascript
const queries = new WrestlingSimQueries(db);
const wrestler = queries.getWrestlerById(1);

// Returns:
// {
//   id: 1,
//   name: 'John Cena',
//   promotion_name: 'WWE',
//   overall_rating: 85,
//   total_matches: 150,
//   win_rate: 72.5,
//   ...
// }
```

### Get Leaderboard
```javascript
const leaderboard = queries.getLeaderboard(1, 100, 0);

// Returns array of top 100 wrestlers by rating
// [
//   { id: 1, name: 'John Cena', overall_rating: 95, win_rate: 85.2 },
//   { id: 2, name: 'The Rock', overall_rating: 92, win_rate: 88.1 },
//   ...
// ]
```

### Search Wrestlers
```javascript
const results = queries.searchWrestlers('John', 50);

// Returns wrestlers matching 'John'
// Fast search using indexed name column
```

### Get Title History
```javascript
const history = queries.getTitleHistory(1, 50);

// Returns:
// [
//   { name: 'John Cena', reign_start: '2024-01-01', days_held: 365, defenses: 12 },
//   ...
// ]
```

### Get Match Statistics
```javascript
const stats = queries.getMatchStatistics(1);

// Returns:
// {
//   name: 'John Cena',
//   total_matches: 150,
//   wins: 108,
//   losses: 42,
//   win_rate: 72.0,
//   avg_quality: 87.5
// }
```

---

## 💾 Caching Strategy

### Memory Cache (5-minute TTL)
```javascript
const cache = new CacheManager();

// Set value
cache.set('wrestler', 1, wrestlerData);

// Get value
const data = cache.get('wrestler', 1);

// Invalidate by namespace
cache.invalidate('wrestler');

// Get stats
const stats = cache.getStats();
// { hits: 150, misses: 50, hitRate: '75%', ... }
```

### Query Result Cache
```javascript
// Cache query results
cache.cacheQuery(sql, params, result);

// Get cached result
const cached = cache.getCachedQuery(sql, params);
```

### LRU Cache
```javascript
const lru = new LRUCache(350); // Max 350 items

lru.set('key', value);
const value = lru.get('key');
```

---

## 🔄 Migration Guide

### Step-by-Step Migration

#### 1. Backup JSON Data
```bash
cp data/wrestlers.json data/wrestlers.json.backup
```

#### 2. Run Migration
```javascript
const migration = new DataMigration(db, './data/wrestlers.json');
const stats = await migration.migrateAll();
```

#### 3. Validate Data
```javascript
const validation = migration.validateMigration();

// Check counts match
assert(validation.wrestlers > 0);
assert(validation.promotions > 0);
assert(validation.matches > 0);
```

#### 4. Run Benchmarks
```javascript
const benchmark = new PerformanceBenchmark(db, cache);
await benchmark.runAll();
```

#### 5. Deploy
```bash
# Commit changes
git add .
git commit -m "feat: Migrate to SQLite database"

# Push to production
git push origin main
```

---

## 📈 Performance Metrics

### Expected Improvements

| Operation | JSON | SQLite | Improvement |
|-----------|------|--------|-------------|
| Get Wrestler | 200ms | 20ms | **10x faster** |
| Search | 400ms | 30ms | **13x faster** |
| Leaderboard | 800ms | 100ms | **8x faster** |
| Title History | 300ms | 30ms | **10x faster** |
| Match Stats | 1000ms | 150ms | **6.7x faster** |
| **Average** | **540ms** | **66ms** | **8.2x faster** |

### With Caching

| Operation | Time | Improvement |
|-----------|------|------------|
| Cached Query | 5ms | **120x faster** |
| Cache Hit Rate | 85% | - |
| Average Response | 30ms | **20x faster** |

---

## 🔐 Backup & Recovery

### Automatic Backups
```javascript
// Create backup
const backupPath = db.backup();
console.log('✓ Backup created:', backupPath);

// Backups are created in: 
// %APPDATA%/WrestlingSim/backup-TIMESTAMP.db
```

### Manual Backup
```javascript
const fs = require('fs');
fs.copyFileSync('data.db', 'data.backup.db');
```

### Restore from Backup
```javascript
const fs = require('fs');
fs.copyFileSync('data.backup.db', 'data.db');
db.close();
db = new WrestlingSimDatabase();
await db.initialize();
```

---

## 🛠️ Troubleshooting

### Issue: "Database is locked"
**Solution**: Close other connections
```javascript
db.close();
db = new WrestlingSimDatabase();
await db.initialize();
```

### Issue: "Table already exists"
**Solution**: This is normal on subsequent runs
```javascript
// Schema creation uses CREATE TABLE IF NOT EXISTS
// Safe to run multiple times
```

### Issue: "Foreign key constraint failed"
**Solution**: Ensure data integrity
```javascript
// Check for orphaned records
const orphans = db.query(`
  SELECT * FROM wrestlers 
  WHERE promotion_id NOT IN (SELECT id FROM promotions)
`);
```

### Issue: "Out of memory"
**Solution**: Increase cache settings or reduce batch size
```javascript
const cache = new CacheManager({
  maxMemoryItems: 500,  // Reduce from 1000
  memoryTTL: 3 * 60 * 1000  // Reduce from 5 minutes
});
```

---

## 📝 Best Practices

### 1. Always Use Transactions for Bulk Operations
```javascript
db.transaction(() => {
  for (let i = 0; i < 1000; i++) {
    db.execute('INSERT INTO wrestlers ...', [...]);
  }
});
```

### 2. Use Prepared Statements
```javascript
// Good: Prepared statement with parameters
db.query('SELECT * FROM wrestlers WHERE id = ?', [1]);

// Bad: String concatenation
db.query(`SELECT * FROM wrestlers WHERE id = ${id}`);
```

### 3. Leverage Indexes
```javascript
// Queries use these indexes automatically:
// - idx_wrestlers_name (for searches)
// - idx_wrestlers_promotion (for filtering)
// - idx_attributes_overall_rating (for leaderboards)
```

### 4. Cache Frequently Accessed Data
```javascript
// Cache top wrestlers
const topWrestlers = queries.getTopWrestlers(100);
cache.set('wrestlers', 'top100', topWrestlers);
```

### 5. Monitor Performance
```javascript
// Get database stats
const stats = db.getStats();
console.log('Cache hit rate:', stats.cacheHitRate);

// Get cache stats
const cacheStats = cache.getStats();
console.log('Cache size:', cacheStats.totalItems);
```

---

## 🚀 Deployment Checklist

- [ ] Install better-sqlite3 dependency
- [ ] Copy database files to project
- [ ] Initialize database schema
- [ ] Backup existing JSON data
- [ ] Run data migration
- [ ] Validate migrated data
- [ ] Run performance benchmarks
- [ ] Update application code to use SQLite
- [ ] Test all features
- [ ] Monitor performance in production
- [ ] Archive old JSON files

---

## 📞 Support & Resources

### Documentation
- **Database Schema**: See `DATABASE_OPTIMIZATION_STRATEGY.md`
- **Query Reference**: See `queries.js` for all available queries
- **Cache Configuration**: See `cache.js` for cache options

### Common Tasks

**Add new wrestler**:
```javascript
queries.createWrestler({
  name: 'New Wrestler',
  promotionId: 1,
  height: 185,
  weight: 120,
  age: 30
});
```

**Update wrestler attributes**:
```javascript
queries.updateWrestlerAttributes(1, {
  strength: 85,
  speed: 80,
  technique: 90,
  endurance: 85,
  charisma: 88
});
```

**Get promotion statistics**:
```javascript
const stats = queries.getPromotionStatistics(1);
console.log(stats);
```

---

## 📊 Success Metrics

After implementation, verify:

- [ ] Query times reduced by 50-70%
- [ ] Database size optimized
- [ ] Cache hit rate > 80%
- [ ] Zero data loss during migration
- [ ] All features working correctly
- [ ] Performance benchmarks passed

---

## 🎯 Next Steps

1. **Review** this guide and database schema
2. **Install** better-sqlite3 dependency
3. **Test** with sample data
4. **Migrate** production data
5. **Benchmark** performance improvements
6. **Deploy** to production
7. **Monitor** and optimize

---

**Status**: ✅ Ready for Implementation  
**Estimated Effort**: 2 sprints  
**Expected ROI**: 8.3x performance improvement  
**Target Release**: v4.0.0

---

For questions or issues, refer to the troubleshooting section or consult the database optimization strategy document.

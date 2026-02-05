import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export function useDatabase() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicializar banco de dados via IPC
    const initDb = async () => {
      try {
        setLoading(true);
        // Aqui você pode fazer uma chamada IPC para inicializar o DB
        setDb(true); // Placeholder
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initDb();
  }, []);

  const query = useCallback(async (sql, params = []) => {
    if (!db) throw new Error('Database not initialized');
    // Implementar query via IPC
    return [];
  }, [db]);

  const execute = useCallback(async (sql, params = []) => {
    if (!db) throw new Error('Database not initialized');
    // Implementar execute via IPC
    return { changes: 0 };
  }, [db]);

  return { db, loading, error, query, execute };
}

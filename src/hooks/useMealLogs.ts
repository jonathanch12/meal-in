import { useState, useEffect } from "react";
import type { MealLog } from "../types/meal.types.ts";

const STORAGE_KEY = "mealLogs";

export const useMealLogs = () => {
  const [logs, setLogs] = useState<MealLog[]>([]);

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        const hydratedLogs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(hydratedLogs);
      } catch (e) {
        console.error("Failed to load local storage", e);
      }
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: MealLog) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  const deleteLog = (id: number) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  };

  const clearAllLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    addLog,
    deleteLog,
    clearAllLogs,
  };
};

import { useState, useEffect } from "react";
import type { MealLog } from "../types/meal.types";

const STORAGE_KEY = "mealLogs";

export const useMealLogs = () => {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);

      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);

        const hydratedLogs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));

        setLogs(hydratedLogs);
        console.log("Loaded logs from localStorage:", hydratedLogs);
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      console.log("Saved logs to localStorage:", logs);
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [logs, isLoaded]);

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

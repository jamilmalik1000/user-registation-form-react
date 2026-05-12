import { useState } from "react";
import type { UserData } from "./types";

const STORAGE_KEY = "registrations";

export function useRegistrations() {
  const [records, setRecords] = useState<UserData[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addRecord = (data: UserData) => {
    const updated = [...records, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecords(updated);
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecords(updated);
  };

  return { records, addRecord, deleteRecord };
}

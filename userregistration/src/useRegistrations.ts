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

  const save = (updated: UserData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecords(updated);
  };

  const addRecord = (data: UserData) => save([...records, data]);

  const updateRecord = (data: UserData) =>
    save(records.map((r) => (r.id === data.id ? data : r)));

  const deleteRecord = (id: string) =>
    save(records.filter((r) => r.id !== id));

  return { records, addRecord, updateRecord, deleteRecord };
}

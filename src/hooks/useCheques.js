import { useState } from "react";
import useStorage from "./useStorage";

const CHEQUES_KEY = "chequemate_cheques";

const runCleanup = (cheques) => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return cheques.filter((c) => {
    if (c.status === "cleared" && c.clearedAt) {
      return new Date(c.clearedAt) > ninetyDaysAgo;
    }
    return true;
  });
};

const useCheques = () => {
  const { get, set } = useStorage();

  const [cheques, setCheques] = useState(() => {
    const stored = get(CHEQUES_KEY) || [];
    return runCleanup(stored);
  });

  const save = (updated) => {
    setCheques(updated);
    set(CHEQUES_KEY, updated);
  };

  const addCheque = ({
    bankId,
    recipient,
    amount,
    chequeNumber,
    issueDate,
    cashInDate,
    note,
  }) => {
    const newCheque = {
      id: crypto.randomUUID(),
      bankId,
      recipient,
      amount: parseFloat(amount) || 0,
      chequeNumber: chequeNumber || "",
      issueDate,
      cashInDate,
      note: note || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [...cheques, newCheque];
    save(updated);
    return newCheque;
  };

  const clearCheque = (chequeId) => {
    const updated = cheques.map((c) =>
      c.id === chequeId
        ? { ...c, status: "cleared", clearedAt: new Date().toISOString() }
        : c,
    );
    save(updated);
  };

  const bounceCheque = (chequeId) => {
    const updated = cheques.map((c) =>
      c.id === chequeId ? { ...c, status: "bounced" } : c,
    );
    save(updated);
  };

  const deleteCheque = (chequeId) => {
    save(cheques.filter((c) => c.id !== chequeId));
  };

  const getChequeById = (chequeId) =>
    cheques.find((c) => c.id === chequeId) || null;

  const getPendingCheques = () => cheques.filter((c) => c.status === "pending");

  const getUpcomingCheques = (days = 7) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const limit = new Date();
    limit.setDate(limit.getDate() + days);
    limit.setHours(23, 59, 59, 999);
    return cheques
      .filter((c) => {
        if (c.status !== "pending") return false;
        const due = new Date(c.cashInDate);
        due.setHours(0, 0, 0, 0);
        return due >= now && due <= limit;
      })
      .sort((a, b) => new Date(a.cashInDate) - new Date(b.cashInDate));
  };

  const getRecentCheques = (limit = 10) => {
    return [...cheques]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const getChequesByBank = (bankId) =>
    cheques.filter((c) => c.bankId === bankId);

  return {
    cheques,
    addCheque,
    clearCheque,
    bounceCheque,
    deleteCheque,
    getChequeById,
    getPendingCheques,
    getUpcomingCheques,
    getRecentCheques,
    getChequesByBank,
  };
};

export default useCheques;

import { useState } from "react";
import useStorage from "./useStorage";

const BANKS_KEY = "chequemate_banks";

const useBanks = () => {
  const { get, set } = useStorage();

  const [banks, setBanks] = useState(() => get(BANKS_KEY) || []);

  const save = (updated) => {
    setBanks(updated);
    set(BANKS_KEY, updated);
  };

  const addBank = (name, accountNumber, balance) => {
    const newBank = {
      id: crypto.randomUUID(),
      name,
      accountNumber,
      balance: parseFloat(balance) || 0,
      createdAt: new Date().toISOString(),
    };
    save([...banks, newBank]);
  };

  const updateBalance = (bankId, newBalance) => {
    const updated = banks.map((b) =>
      b.id === bankId ? { ...b, balance: parseFloat(newBalance) || 0 } : b,
    );
    save(updated);
  };

  const deductBalance = (bankId, amount) => {
    const updated = banks.map((b) =>
      b.id === bankId ? { ...b, balance: b.balance - parseFloat(amount) } : b,
    );
    save(updated);
  };

  const refundBalance = (bankId, amount) => {
    const updated = banks.map((b) =>
      b.id === bankId ? { ...b, balance: b.balance + parseFloat(amount) } : b,
    );
    save(updated);
  };

  const deleteBank = (bankId) => {
    save(banks.filter((b) => b.id !== bankId));
  };

  const getBankById = (bankId) => banks.find((b) => b.id === bankId) || null;

  return {
    banks,
    addBank,
    updateBalance,
    deductBalance,
    refundBalance,
    deleteBank,
    getBankById,
  };
};

export default useBanks;

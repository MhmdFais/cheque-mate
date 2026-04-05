import { useState } from "react";

const Banks = ({ banks, addBank, updateBalance, deleteBank }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    balance: "",
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!form.name.trim()) return setError("Bank name is required");
    if (!form.balance || isNaN(form.balance))
      return setError("Enter a valid balance");
    addBank(form.name.trim(), form.accountNumber.trim(), form.balance);
    setForm({ name: "", accountNumber: "", balance: "" });
    setError("");
    setShowForm(false);
  };

  const handleUpdateBalance = (bankId) => {
    if (!newBalance || isNaN(newBalance)) return;
    updateBalance(bankId, newBalance);
    setEditingBalance(null);
    setNewBalance("");
  };

  const handleDelete = (bankId) => {
    deleteBank(bankId);
    setConfirmDelete(null);
  };

  const formatBalance = (amount) =>
    "LKR " +
    Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2 });

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const bankColors = [
    "#eff6ff|#2563eb",
    "#f0fdf4|#16a34a",
    "#fef3c7|#d97706",
    "#fdf2f8|#9333ea",
    "#fff1f2|#e11d48",
    "#f0fdfa|#0d9488",
  ];

  const getColor = (index) => {
    const [bg, text] = bankColors[index % bankColors.length].split("|");
    return { bg, text };
  };

  return (
    <div style={s.screen}>
      <div style={s.header}>
        <span style={s.title}>Banks</span>
        <button
          style={s.addBtn}
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
        >
          + Add bank
        </button>
      </div>

      {/* Add Bank Form */}
      {showForm && (
        <div style={s.formCard}>
          <p style={s.formTitle}>New bank account</p>

          <label style={s.label}>Bank name *</label>
          <input
            style={s.input}
            placeholder="e.g. Commercial Bank"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label style={s.label}>Account number</label>
          <input
            style={s.input}
            placeholder="e.g. 1234567890"
            value={form.accountNumber}
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
          />

          <label style={s.label}>Current balance (LKR) *</label>
          <input
            style={s.input}
            placeholder="e.g. 250000"
            type="number"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: e.target.value })}
          />

          {error && <p style={s.error}>{error}</p>}

          <div style={s.formRow}>
            <button
              style={s.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setError("");
                setForm({ name: "", accountNumber: "", balance: "" });
              }}
            >
              Cancel
            </button>
            <button style={s.saveBtn} onClick={handleAdd}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {banks.length === 0 && !showForm && (
        <div style={s.empty}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1.2"
            style={{ marginBottom: "12px" }}
          >
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M8 6V5a2 2 0 014 0v1" />
            <line x1="12" y1="11" x2="12" y2="15" />
          </svg>
          <p style={s.emptyText}>No bank accounts yet</p>
          <p style={s.emptySubText}>Tap "+ Add bank" to get started</p>
        </div>
      )}

      {/* Bank cards */}
      <div style={s.list}>
        {banks.map((bank, index) => {
          const { bg, text } = getColor(index);
          const isEditingThis = editingBalance === bank.id;
          const isDeletingThis = confirmDelete === bank.id;

          return (
            <div key={bank.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={{ ...s.avatar, background: bg, color: text }}>
                  {getInitials(bank.name)}
                </div>
                <div style={s.cardInfo}>
                  <p style={s.bankName}>{bank.name}</p>
                  {bank.accountNumber && (
                    <p style={s.accountNum}>
                      •••• {bank.accountNumber.slice(-4)}
                    </p>
                  )}
                </div>
                <div style={s.balanceBlock}>
                  <p style={s.balanceLabel}>Balance</p>
                  <p
                    style={{
                      ...s.balanceAmount,
                      color: bank.balance < 0 ? "#dc2626" : "#111",
                    }}
                  >
                    {formatBalance(bank.balance)}
                  </p>
                </div>
              </div>

              {/* Edit balance */}
              {isEditingThis && (
                <div style={s.editRow}>
                  <input
                    style={{ ...s.input, margin: 0, flex: 1 }}
                    type="number"
                    placeholder="New balance"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    autoFocus
                  />
                  <button
                    style={s.saveBtn}
                    onClick={() => handleUpdateBalance(bank.id)}
                  >
                    Update
                  </button>
                  <button
                    style={s.cancelBtn}
                    onClick={() => {
                      setEditingBalance(null);
                      setNewBalance("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Confirm delete */}
              {isDeletingThis && (
                <div style={s.confirmRow}>
                  <p style={s.confirmText}>Delete this bank account?</p>
                  <div style={s.formRow}>
                    <button
                      style={s.cancelBtn}
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      style={s.deleteBtn}
                      onClick={() => handleDelete(bank.id)}
                    >
                      Yes, delete
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isEditingThis && !isDeletingThis && (
                <div style={s.cardActions}>
                  <button
                    style={s.actionBtn}
                    onClick={() => {
                      setEditingBalance(bank.id);
                      setNewBalance(bank.balance);
                      setConfirmDelete(null);
                    }}
                  >
                    Update balance
                  </button>
                  <button
                    style={{ ...s.actionBtn, ...s.actionBtnDanger }}
                    onClick={() => {
                      setConfirmDelete(bank.id);
                      setEditingBalance(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const s = {
  screen: {
    padding: "0 0 24px",
    minHeight: "100%",
    background: "#f5f5f0",
  },
  header: {
    background: "#fff",
    padding: "16px 20px",
    borderBottom: "0.5px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  title: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#111",
  },
  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    cursor: "pointer",
  },
  formCard: {
    background: "#fff",
    margin: "16px",
    borderRadius: "14px",
    padding: "16px",
    border: "0.5px solid #e5e5e5",
  },
  formTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111",
    marginBottom: "14px",
  },
  label: {
    fontSize: "12px",
    color: "#666",
    display: "block",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "0.5px solid #e5e5e5",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111",
    background: "#fafafa",
    marginBottom: "12px",
    outline: "none",
  },
  error: {
    fontSize: "12px",
    color: "#dc2626",
    marginBottom: "10px",
  },
  formRow: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "none",
    border: "0.5px solid #e5e5e5",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    color: "#666",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
  },
  list: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    overflow: "hidden",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "500",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  bankName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111",
  },
  accountNum: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "2px",
  },
  balanceBlock: {
    textAlign: "right",
    flexShrink: 0,
  },
  balanceLabel: {
    fontSize: "10px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  balanceAmount: {
    fontSize: "15px",
    fontWeight: "500",
    marginTop: "2px",
    fontVariantNumeric: "tabular-nums",
  },
  editRow: {
    display: "flex",
    gap: "8px",
    padding: "0 14px 14px",
    alignItems: "center",
  },
  confirmRow: {
    padding: "0 14px 14px",
  },
  confirmText: {
    fontSize: "13px",
    color: "#444",
    marginBottom: "10px",
  },
  cardActions: {
    borderTop: "0.5px solid #f0f0f0",
    display: "flex",
  },
  actionBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "none",
    fontSize: "12px",
    color: "#2563eb",
    cursor: "pointer",
  },
  actionBtnDanger: {
    color: "#dc2626",
    borderLeft: "0.5px solid #f0f0f0",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    color: "#aaa",
  },
  emptyText: {
    fontSize: "15px",
    color: "#666",
    fontWeight: "500",
  },
  emptySubText: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "4px",
  },
};

export default Banks;

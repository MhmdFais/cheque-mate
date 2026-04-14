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
        <div>
          <p style={s.pageTitle}>Banks</p>
          <p style={s.pageSubtitle}>
            {banks.length} account{banks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          style={s.headerAddBtn}
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
        >
          + Add bank
        </button>
      </div>

      <div style={s.body}>
        {/* Add form */}
        {showForm && (
          <div style={s.formCard}>
            <p style={s.formTitle}>New bank account</p>
            <div style={s.formGrid}>
              <div style={s.field}>
                <label style={s.label}>Bank name *</label>
                <input
                  style={s.input}
                  placeholder="e.g. Commercial Bank"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Account number</label>
                <input
                  style={s.input}
                  placeholder="e.g. 1234567890"
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm({ ...form, accountNumber: e.target.value })
                  }
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Current balance (LKR) *</label>
                <input
                  style={s.input}
                  placeholder="e.g. 250000"
                  type="number"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({ ...form, balance: e.target.value })
                  }
                />
              </div>
            </div>
            {error && <p style={s.error}>{error}</p>}
            <div style={s.formBtns}>
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
                Save bank
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {banks.length === 0 && !showForm && (
          <div style={s.emptyBox}>
            <svg
              width="40"
              height="40"
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
            <p style={s.emptySubText}>Click "+ Add bank" to get started</p>
          </div>
        )}

        {/* Bank grid */}
        <div style={s.grid}>
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
                </div>

                <div style={s.balanceBlock}>
                  <p style={s.balanceLabel}>Current balance</p>
                  <p
                    style={{
                      ...s.balanceAmount,
                      color: bank.balance < 0 ? "#dc2626" : "#111",
                    }}
                  >
                    {formatBalance(bank.balance)}
                  </p>
                </div>

                {isEditingThis && (
                  <div style={s.editRow}>
                    <input
                      style={{ ...s.input, flex: 1, margin: 0 }}
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

                {isDeletingThis && (
                  <div style={s.confirmBox}>
                    <p style={s.confirmText}>Delete this bank account?</p>
                    <div style={s.confirmBtns}>
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

                {!isEditingThis && !isDeletingThis && (
                  <div style={s.cardActions}>
                    <button
                      style={s.actionUpdate}
                      onClick={() => {
                        setEditingBalance(bank.id);
                        setNewBalance(bank.balance);
                        setConfirmDelete(null);
                      }}
                    >
                      Update balance
                    </button>
                    <button
                      style={s.actionDelete}
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
    </div>
  );
};

const s = {
  screen: {
    minHeight: "100%",
    background: "#f5f5f0",
  },
  header: {
    background: "#fff",
    padding: "20px 28px",
    borderBottom: "0.5px solid #e5e5e5",
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#111",
    letterSpacing: "-0.3px",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "3px",
  },
  headerAddBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 22px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  body: {
    padding: "28px 28px 40px",
  },
  formCard: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    padding: "20px",
    marginBottom: "20px",
  },
  formTitle: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111",
    marginBottom: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "0.5px solid #e5e5e5",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#111",
    background: "#fafafa",
    outline: "none",
  },
  error: {
    fontSize: "12px",
    color: "#dc2626",
    marginBottom: "10px",
  },
  formBtns: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    marginTop: "4px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
    padding: "16px 16px 0",
  },
  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "500",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  bankName: {
    fontSize: "17px",
    fontWeight: "500",
    color: "#111",
  },
  accountNum: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "2px",
  },
  balanceBlock: {
    padding: "12px 16px 14px",
    borderBottom: "0.5px solid #f0f0f0",
  },
  balanceLabel: {
    fontSize: "10px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "4px",
  },
  balanceAmount: {
    fontSize: "20px",
    fontWeight: "500",
    fontVariantNumeric: "tabular-nums",
  },
  editRow: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    alignItems: "center",
  },
  confirmBox: {
    padding: "12px 16px",
    background: "#fafafa",
  },
  confirmText: {
    fontSize: "13px",
    color: "#444",
    marginBottom: "10px",
  },
  confirmBtns: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  cardActions: {
    display: "flex",
  },
  actionUpdate: {
    flex: 1,
    padding: "11px",
    border: "none",
    background: "none",
    fontSize: "13px",
    color: "#2563eb",
    cursor: "pointer",
    borderRight: "0.5px solid #f0f0f0",
  },
  actionDelete: {
    flex: 1,
    padding: "11px",
    border: "none",
    background: "none",
    fontSize: "13px",
    color: "#dc2626",
    cursor: "pointer",
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
  emptyBox: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "15px",
    color: "#444",
    fontWeight: "500",
  },
  emptySubText: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "6px",
  },
};

export default Banks;

import { useState } from "react";

const AddCheque = ({ banks, addCheque, onClose }) => {
  const [form, setForm] = useState({
    bankId: "",
    recipient: "",
    amount: "",
    chequeNumber: "",
    issueDate: today(),
    cashInDate: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function today() {
    return new Date().toISOString().split("T")[0];
  }

  const validate = () => {
    const e = {};
    if (!form.bankId) e.bankId = "Select a bank";
    if (!form.recipient.trim()) e.recipient = "Recipient name is required";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.cashInDate) e.cashInDate = "Cash-in date is required";
    if (form.cashInDate && form.cashInDate < form.issueDate)
      e.cashInDate = "Cash-in date cannot be before issue date";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) return setErrors(e);
    addCheque(form);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  if (banks.length === 0) {
    return (
      <div style={s.screen}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="1.8"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span style={s.title}>New cheque</span>
          <div style={{ width: 32 }} />
        </div>
        <div style={s.noBanks}>
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
          <p style={s.noBanksText}>No bank accounts found</p>
          <p style={s.noBanksSub}>
            Add a bank account first before issuing a cheque
          </p>
          <button style={s.goToBanks} onClick={onClose}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.screen}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="1.8"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={s.title}>New cheque</span>
        <div style={{ width: 32 }} />
      </div>

      {success ? (
        <div style={s.successBox}>
          <div style={s.successIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p style={s.successText}>Cheque added successfully</p>
        </div>
      ) : (
        <div style={s.form}>
          {/* Bank selector */}
          <div style={s.field}>
            <label style={s.label}>Bank account *</label>
            <div style={s.bankGrid}>
              {banks.map((bank, index) => {
                const colors = [
                  "#eff6ff|#2563eb",
                  "#f0fdf4|#16a34a",
                  "#fef3c7|#d97706",
                  "#fdf2f8|#9333ea",
                  "#fff1f2|#e11d48",
                  "#f0fdfa|#0d9488",
                ];
                const [bg, text] = colors[index % colors.length].split("|");
                const selected = form.bankId === bank.id;
                return (
                  <button
                    key={bank.id}
                    style={{
                      ...s.bankOption,
                      ...(selected
                        ? { ...s.bankOptionSelected, borderColor: text }
                        : {}),
                    }}
                    onClick={() => set("bankId", bank.id)}
                  >
                    <div
                      style={{ ...s.bankAvatar, background: bg, color: text }}
                    >
                      {bank.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <span style={s.bankOptionName}>{bank.name}</span>
                    <span style={s.bankOptionBalance}>
                      LKR {Number(bank.balance).toLocaleString()}
                    </span>
                    {selected && (
                      <div style={{ ...s.checkmark, color: text }}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.bankId && <p style={s.error}>{errors.bankId}</p>}
          </div>

          {/* Recipient */}
          <div style={s.field}>
            <label style={s.label}>Recipient *</label>
            <input
              style={{ ...s.input, ...(errors.recipient ? s.inputError : {}) }}
              placeholder="Who is this cheque for?"
              value={form.recipient}
              onChange={(e) => set("recipient", e.target.value)}
            />
            {errors.recipient && <p style={s.error}>{errors.recipient}</p>}
          </div>

          {/* Amount */}
          <div style={s.field}>
            <label style={s.label}>Amount (LKR) *</label>
            <input
              style={{ ...s.input, ...(errors.amount ? s.inputError : {}) }}
              placeholder="e.g. 50000"
              type="number"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
            {errors.amount && <p style={s.error}>{errors.amount}</p>}
          </div>

          {/* Cheque number */}
          <div style={s.field}>
            <label style={s.label}>Cheque number</label>
            <input
              style={s.input}
              placeholder="e.g. 001842"
              value={form.chequeNumber}
              onChange={(e) => set("chequeNumber", e.target.value)}
            />
          </div>

          {/* Dates row */}
          <div style={s.dateRow}>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Issue date *</label>
              <input
                style={s.input}
                type="date"
                value={form.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
              />
            </div>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Cash-in date *</label>
              <input
                style={{
                  ...s.input,
                  ...(errors.cashInDate ? s.inputError : {}),
                }}
                type="date"
                value={form.cashInDate}
                min={form.issueDate}
                onChange={(e) => set("cashInDate", e.target.value)}
              />
              {errors.cashInDate && <p style={s.error}>{errors.cashInDate}</p>}
            </div>
          </div>

          {/* Note */}
          <div style={s.field}>
            <label style={s.label}>Note (optional)</label>
            <textarea
              style={s.textarea}
              placeholder="Any additional notes..."
              rows={3}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>

          {/* Submit */}
          <button style={s.submitBtn} onClick={handleSubmit}>
            Add cheque
          </button>
        </div>
      )}
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
    padding: "16px 20px",
    borderBottom: "0.5px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#111",
  },
  form: {
    padding: "20px 16px 40px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    fontSize: "12px",
    color: "#666",
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    border: "0.5px solid #e5e5e5",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111",
    background: "#fff",
    outline: "none",
  },
  inputError: {
    borderColor: "#fca5a5",
  },
  textarea: {
    width: "100%",
    padding: "11px 12px",
    border: "0.5px solid #e5e5e5",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111",
    background: "#fff",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
  },
  error: {
    fontSize: "11px",
    color: "#dc2626",
    marginTop: "4px",
  },
  dateRow: {
    display: "flex",
    gap: "12px",
  },
  bankGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bankOption: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: "10px",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
  },
  bankOptionSelected: {
    background: "#f8faff",
    borderWidth: "1.5px",
  },
  bankAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "500",
    flexShrink: 0,
  },
  bankOptionName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#111",
    flex: 1,
  },
  bankOptionBalance: {
    fontSize: "12px",
    color: "#888",
  },
  checkmark: {
    marginLeft: "6px",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "8px",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  successText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#16a34a",
  },
  noBanks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
    textAlign: "center",
  },
  noBanksText: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#444",
  },
  noBanksSub: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "6px",
    marginBottom: "20px",
  },
  goToBanks: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 24px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default AddCheque;

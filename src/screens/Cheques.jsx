import { useState } from "react";

const Cheques = ({
  banks,
  cheques,
  getBankById,
  onClearCheque,
  onDeleteCheque,
  openAddCheque,
}) => {
  const [activeBank, setActiveBank] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [confirmClear, setConfirmClear] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);

  const allBanks = [{ id: "all", name: "All" }, ...banks];
  const statuses = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "cleared", label: "Cleared" },
    { id: "bounced", label: "Bounced" },
  ];

  const filtered = cheques
    .filter((c) => activeBank === "all" || c.bankId === activeBank)
    .filter((c) => activeStatus === "all" || c.status === activeStatus)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    return Math.round((due - today) / (1000 * 60 * 60 * 24));
  };

  const getDueLabel = (dateStr) => {
    const days = getDaysUntil(dateStr);
    if (days < 0) return `Overdue by ${Math.abs(days)}d`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days}d`;
  };

  const getUrgency = (cheque) => {
    if (cheque.status !== "pending") return "none";
    const days = getDaysUntil(cheque.cashInDate);
    if (days < 0) return "overdue";
    if (days <= 1) return "red";
    if (days <= 3) return "amber";
    return "gray";
  };

  const urgencyBorder = {
    overdue: "#dc2626",
    red: "#ef4444",
    amber: "#f59e0b",
    gray: "#e5e5e5",
    none: "#e5e5e5",
  };

  const formatAmount = (amount) =>
    "LKR " +
    Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2 });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const bankColors = [
    "#eff6ff|#2563eb",
    "#f0fdf4|#16a34a",
    "#fef3c7|#d97706",
    "#fdf2f8|#9333ea",
    "#fff1f2|#e11d48",
    "#f0fdfa|#0d9488",
  ];

  const getBankColor = (bankId) => {
    const index = banks.findIndex((b) => b.id === bankId);
    const [bg, text] =
      bankColors[Math.max(index, 0) % bankColors.length].split("|");
    return { bg, text };
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleClear = (chequeId) => {
    onClearCheque(chequeId);
    setConfirmClear(null);
  };

  const handleDelete = (chequeId) => {
    onDeleteCheque(chequeId);
    setConfirmDelete(null);
  };

  const statusColors = {
    pending: { bg: "#fffbeb", text: "#b45309" },
    cleared: { bg: "#f0fdf4", text: "#16a34a" },
    bounced: { bg: "#fef2f2", text: "#dc2626" },
  };

  const ChequeCard = ({ cheque }) => {
    const bank = getBankById(cheque.bankId);
    const urgency = getUrgency(cheque);
    const bankColor = bank
      ? getBankColor(cheque.bankId)
      : { bg: "#f3f4f6", text: "#666" };
    const isClearConfirm = confirmClear === cheque.id;
    const isDeleteConfirm = confirmDelete === cheque.id;
    const isNoteExpanded = expandedNote === cheque.id;
    const sc = statusColors[cheque.status];

    return (
      <div style={{ ...s.card, borderLeftColor: urgencyBorder[urgency] }}>
        <div style={s.cardInner}>
          {/* Row 1 — recipient + amount */}
          <div style={s.row1}>
            <div style={s.cardLeft}>
              {bank && (
                <div
                  style={{
                    ...s.bankDot,
                    background: bankColor.bg,
                    color: bankColor.text,
                  }}
                >
                  {getInitials(bank.name)}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <p style={s.recipient}>{cheque.recipient}</p>
                {cheque.chequeNumber && (
                  <p style={s.chequeNum}>Chq #{cheque.chequeNumber}</p>
                )}
              </div>
            </div>
            <div style={s.amountPill}>
              <p style={s.amount}>{formatAmount(cheque.amount)}</p>
            </div>
          </div>

          {/* Row 2 — bank + status */}
          <div style={s.row2}>
            {bank && <span style={s.bankName}>{bank.name}</span>}
            <span
              style={{ ...s.statusChip, background: sc.bg, color: sc.text }}
            >
              {cheque.status.charAt(0).toUpperCase() + cheque.status.slice(1)}
            </span>
          </div>

          {/* Row 3 — dates */}
          <div style={s.datesRow}>
            <div style={s.dateItem}>
              <span style={s.dateLabel}>Issued</span>
              <span style={s.dateValue}>{formatDate(cheque.issueDate)}</span>
            </div>
            <div style={s.dateDivider} />
            <div style={s.dateItem}>
              <span style={s.dateLabel}>Cash-in</span>
              <span
                style={{
                  ...s.dateValue,
                  color:
                    urgency === "overdue"
                      ? "#dc2626"
                      : urgency === "red"
                        ? "#ef4444"
                        : urgency === "amber"
                          ? "#d97706"
                          : "#111",
                }}
              >
                {formatDate(cheque.cashInDate)}
                {cheque.status === "pending" && (
                  <span style={s.daysAway}>
                    {" "}
                    · {getDueLabel(cheque.cashInDate)}
                  </span>
                )}
              </span>
            </div>
            {cheque.status === "cleared" && cheque.clearedAt && (
              <>
                <div style={s.dateDivider} />
                <div style={s.dateItem}>
                  <span style={s.dateLabel}>Cleared</span>
                  <span style={{ ...s.dateValue, color: "#16a34a" }}>
                    {formatDate(cheque.clearedAt)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Note */}
          {cheque.note && (
            <button
              style={s.noteToggle}
              onClick={() => setExpandedNote(isNoteExpanded ? null : cheque.id)}
            >
              {isNoteExpanded ? "Hide note ▲" : "Show note ▼"}
            </button>
          )}
          {cheque.note && isNoteExpanded && (
            <p style={s.noteText}>{cheque.note}</p>
          )}
        </div>

        {/* Confirm clear */}
        {isClearConfirm && (
          <div style={s.confirmBox}>
            <p style={s.confirmText}>
              Mark as cleared? This will deduct{" "}
              <strong>{formatAmount(cheque.amount)}</strong> from {bank?.name}.
            </p>
            <div style={s.confirmBtns}>
              <button style={s.cancelBtn} onClick={() => setConfirmClear(null)}>
                Cancel
              </button>
              <button style={s.clearBtn} onClick={() => handleClear(cheque.id)}>
                Yes, clear
              </button>
            </div>
          </div>
        )}

        {/* Confirm delete */}
        {isDeleteConfirm && (
          <div style={s.confirmBox}>
            <p style={s.confirmText}>Delete this cheque permanently?</p>
            <div style={s.confirmBtns}>
              <button
                style={s.cancelBtn}
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                style={s.deleteBtn}
                onClick={() => handleDelete(cheque.id)}
              >
                Yes, delete
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!isClearConfirm && !isDeleteConfirm && (
          <div style={s.cardActions}>
            {cheque.status === "pending" && (
              <button
                style={s.actionClear}
                onClick={() => {
                  setConfirmClear(cheque.id);
                  setConfirmDelete(null);
                }}
              >
                Mark cleared
              </button>
            )}
            <button
              style={{
                ...s.actionDelete,
                borderLeft:
                  cheque.status === "pending" ? "0.5px solid #f0f0f0" : "none",
              }}
              onClick={() => {
                setConfirmDelete(cheque.id);
                setConfirmClear(null);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={s.screen}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.title}>Cheques</span>
        <button style={s.addBtn} onClick={openAddCheque}>
          + New
        </button>
      </div>

      {/* Filters */}
      <div style={s.filtersWrap}>
        <div style={s.filterRow}>
          {allBanks.map((bank) => (
            <button
              key={bank.id}
              style={{
                ...s.chip,
                ...(activeBank === bank.id ? s.chipActive : {}),
              }}
              onClick={() => setActiveBank(bank.id)}
            >
              {bank.name}
            </button>
          ))}
        </div>
        <div style={s.filterRow}>
          {statuses.map((st) => (
            <button
              key={st.id}
              style={{
                ...s.chip,
                ...(activeStatus === st.id ? s.chipActive : {}),
              }}
              onClick={() => setActiveStatus(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p style={s.countLabel}>
          {filtered.length} cheque{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* List */}
      <div style={s.list}>
        {filtered.length === 0 ? (
          <div style={s.emptyBox}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.2"
              style={{ marginBottom: "10px" }}
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
            </svg>
            <p style={s.emptyText}>No cheques found</p>
            {cheques.length === 0 && (
              <button style={s.emptyAction} onClick={openAddCheque}>
                + Add first cheque
              </button>
            )}
          </div>
        ) : (
          filtered.map((c) => <ChequeCard key={c.id} cheque={c} />)
        )}
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
  filtersWrap: {
    background: "#fff",
    borderBottom: "0.5px solid #e5e5e5",
    padding: "10px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "sticky",
    top: "57px",
    zIndex: 9,
  },
  filterRow: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
    paddingBottom: "2px",
  },
  chip: {
    border: "0.5px solid #e5e5e5",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "11px",
    color: "#666",
    cursor: "pointer",
    whiteSpace: "nowrap",
    background: "#fff",
  },
  chipActive: {
    background: "#eff6ff",
    borderColor: "#93c5fd",
    color: "#2563eb",
    fontWeight: "500",
  },
  countLabel: {
    fontSize: "11px",
    color: "#aaa",
    padding: "10px 16px 4px",
  },
  list: {
    padding: "8px 16px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    borderLeft: "3px solid #e5e5e5",
    overflow: "hidden",
  },
  cardInner: {
    padding: "12px 14px",
  },
  row1: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    minWidth: 0,
  },
  bankDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "500",
    flexShrink: 0,
  },
  recipient: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111",
  },
  chequeNum: {
    fontSize: "10px",
    color: "#aaa",
    marginTop: "1px",
  },
  amountPill: {
    background: "#eff6ff",
    border: "0.5px solid #bfdbfe",
    borderRadius: "8px",
    padding: "4px 10px",
    flexShrink: 0,
    marginLeft: "8px",
  },
  amount: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1d4ed8",
    fontVariantNumeric: "tabular-nums",
  },
  row2: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  bankName: {
    fontSize: "11px",
    color: "#888",
  },
  statusChip: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  datesRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fafafa",
    borderRadius: "8px",
    padding: "8px 10px",
  },
  dateItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
  },
  dateLabel: {
    fontSize: "9px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  dateValue: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#111",
  },
  daysAway: {
    fontWeight: "400",
    color: "#888",
  },
  dateDivider: {
    width: "0.5px",
    height: "28px",
    background: "#e5e5e5",
    flexShrink: 0,
  },
  noteToggle: {
    background: "none",
    border: "none",
    fontSize: "11px",
    color: "#2563eb",
    cursor: "pointer",
    padding: "6px 0 0",
    display: "block",
  },
  noteText: {
    fontSize: "12px",
    color: "#666",
    marginTop: "6px",
    lineHeight: "1.5",
    background: "#f9f9f9",
    borderRadius: "8px",
    padding: "8px 10px",
  },
  cardActions: {
    borderTop: "0.5px solid #f0f0f0",
    display: "flex",
  },
  actionClear: {
    flex: 1,
    padding: "9px",
    border: "none",
    background: "none",
    fontSize: "12px",
    color: "#16a34a",
    cursor: "pointer",
  },
  actionDelete: {
    flex: 1,
    padding: "9px",
    border: "none",
    background: "none",
    fontSize: "12px",
    color: "#dc2626",
    cursor: "pointer",
  },
  confirmBox: {
    padding: "12px 14px",
    borderTop: "0.5px solid #f0f0f0",
    background: "#fafafa",
  },
  confirmText: {
    fontSize: "12px",
    color: "#444",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  confirmBtns: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    background: "none",
    border: "0.5px solid #e5e5e5",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "12px",
    color: "#666",
    cursor: "pointer",
  },
  clearBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "12px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "12px",
    cursor: "pointer",
  },
  emptyBox: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    padding: "40px 20px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "13px",
    color: "#aaa",
  },
  emptyAction: {
    marginTop: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default Cheques;

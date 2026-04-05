import { useState } from "react";

const Dashboard = ({
  banks,
  getUpcomingCheques,
  getRecentCheques,
  getBankById,
  onClearCheque,
  onDeleteCheque,
  openAddCheque,
  navigateTo,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [confirmClear, setConfirmClear] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const upcoming = getUpcomingCheques(7);
  const recent = getRecentCheques(10);

  const allBanks = [{ id: "all", name: "All banks" }, ...banks];

  const bankFiltered =
    activeFilter === "all"
      ? recent
      : recent.filter((c) => c.bankId === activeFilter);

  const pendingRecent = bankFiltered.filter((c) => c.status === "pending");
  const passedRecent = bankFiltered.filter(
    (c) => c.status === "cleared" || c.status === "bounced",
  );

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    return Math.round((due - today) / (1000 * 60 * 60 * 24));
  };

  const getUrgency = (dateStr) => {
    const days = getDaysUntil(dateStr);
    if (days <= 1) return "red";
    if (days <= 3) return "amber";
    return "gray";
  };

  const getDueLabel = (dateStr) => {
    const days = getDaysUntil(dateStr);
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  const formatAmount = (amount) =>
    "LKR " +
    Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2 });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const urgencyColors = {
    red: { border: "#ef4444", badge: "#fef2f2", badgeText: "#b91c1c" },
    amber: { border: "#f59e0b", badge: "#fffbeb", badgeText: "#b45309" },
    gray: { border: "#e5e5e5", badge: "#f3f4f6", badgeText: "#6b7280" },
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

  const ChequeCard = ({ cheque, showIssuedDate = false }) => {
    const bank = getBankById(cheque.bankId);
    const urgency = getUrgency(cheque.cashInDate);
    const colors = urgencyColors[urgency];
    const bankColor = bank
      ? getBankColor(cheque.bankId)
      : { bg: "#f3f4f6", text: "#666" };
    const isClearConfirm = confirmClear === cheque.id;
    const isDeleteConfirm = confirmDelete === cheque.id;

    return (
      <div style={{ ...s.card, borderLeftColor: colors.border }}>
        <div style={s.cardInner}>
          <div style={s.cardRow1}>
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
              <div>
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

          <div style={s.cardRow2}>
            <div style={s.bankInfo}>
              {bank && <span style={s.bankName}>{bank.name}</span>}
            </div>
            <span
              style={{
                ...s.dueBadge,
                background: colors.badge,
                color: colors.badgeText,
              }}
            >
              {showIssuedDate
                ? `Issued ${formatDate(cheque.issueDate)}`
                : getDueLabel(cheque.cashInDate)}
            </span>
          </div>
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
        {!isClearConfirm && !isDeleteConfirm && cheque.status === "pending" && (
          <div style={s.cardActions}>
            <button
              style={s.actionClear}
              onClick={() => {
                setConfirmClear(cheque.id);
                setConfirmDelete(null);
              }}
            >
              Mark cleared
            </button>
            <button
              style={s.actionDelete}
              onClick={() => {
                setConfirmDelete(cheque.id);
                setConfirmClear(null);
              }}
            >
              Delete
            </button>
          </div>
        )}

        {cheque.status !== "pending" && (
          <div style={s.cardActions}>
            <span
              style={{
                ...s.statusBadge,
                color: cheque.status === "cleared" ? "#16a34a" : "#dc2626",
                background: cheque.status === "cleared" ? "#f0fdf4" : "#fef2f2",
              }}
            >
              {cheque.status === "cleared" ? "Cleared" : "Bounced"}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={s.screen}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.logo}>
            Cheque<span style={{ color: "#2563eb" }}>Mate</span>
          </p>
          <p style={s.date}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div style={s.body}>
        {/* Upcoming section */}
        <p style={s.sectionLabel}>Upcoming — next 7 days</p>

        {upcoming.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={s.emptyText}>No cheques due in the next 7 days</p>
            <button style={s.emptyAction} onClick={openAddCheque}>
              + Add a cheque
            </button>
          </div>
        ) : (
          <div style={s.list}>
            {upcoming.map((c) => (
              <ChequeCard key={c.id} cheque={c} />
            ))}
          </div>
        )}

        <div style={s.divider} />

        {/* Recent section */}
        <p style={s.sectionLabel}>Recently issued</p>

        {/* Bank filter chips */}
        <div style={s.filterRow}>
          {allBanks.map((bank) => (
            <button
              key={bank.id}
              style={{
                ...s.chip,
                ...(activeFilter === bank.id ? s.chipActive : {}),
              }}
              onClick={() => setActiveFilter(bank.id)}
            >
              {bank.name}
            </button>
          ))}
        </div>

        {pendingRecent.length === 0 && passedRecent.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={s.emptyText}>No cheques found</p>
          </div>
        ) : (
          <>
            {pendingRecent.length > 0 && (
              <div style={s.list}>
                {pendingRecent.map((c) => (
                  <ChequeCard key={c.id} cheque={c} showIssuedDate />
                ))}
              </div>
            )}

            {passedRecent.length > 0 && (
              <>
                <p
                  style={{
                    ...s.sectionLabel,
                    marginTop: pendingRecent.length > 0 ? "16px" : "0",
                    marginBottom: "10px",
                  }}
                >
                  Cleared / bounced
                </p>
                <div style={s.list}>
                  {passedRecent.map((c) => (
                    <ChequeCard key={c.id} cheque={c} showIssuedDate />
                  ))}
                </div>
              </>
            )}
          </>
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
    padding: "16px 20px 14px",
    borderBottom: "0.5px solid #e5e5e5",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "500",
    letterSpacing: "-0.5px",
    color: "#111",
  },
  date: {
    fontSize: "12px",
    color: "#aaa",
    marginTop: "2px",
  },
  body: {
    padding: "20px 16px 32px",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: "500",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "12px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "4px",
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
  cardRow1: {
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
  cardRow2: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  bankName: {
    fontSize: "11px",
    color: "#888",
  },
  dueBadge: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  cardActions: {
    borderTop: "0.5px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
  },
  actionClear: {
    flex: 1,
    padding: "9px",
    border: "none",
    background: "none",
    fontSize: "12px",
    color: "#16a34a",
    cursor: "pointer",
    borderRight: "0.5px solid #f0f0f0",
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
  statusBadge: {
    flex: 1,
    textAlign: "center",
    padding: "9px",
    fontSize: "12px",
    fontWeight: "500",
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
  filterRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "12px",
    overflowX: "auto",
    paddingBottom: "2px",
  },
  chip: {
    border: "0.5px solid #e5e5e5",
    borderRadius: "20px",
    padding: "5px 12px",
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
  divider: {
    height: "0.5px",
    background: "#e5e5e5",
    margin: "20px 0",
  },
  emptyBox: {
    background: "#fff",
    borderRadius: "14px",
    border: "0.5px solid #e5e5e5",
    padding: "28px 20px",
    textAlign: "center",
    marginBottom: "4px",
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

export default Dashboard;

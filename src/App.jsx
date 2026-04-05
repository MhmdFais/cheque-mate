import { useState } from "react";
import Dashboard from "./screens/Dashboard";
import Cheques from "./screens/Cheques";
import AddCheque from "./screens/AddCheque";
import Banks from "./screens/Banks";
import useBanks from "./hooks/useBanks";
import useCheques from "./hooks/useCheques";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#2563eb" : "#aaa"}
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "cheques",
    label: "Cheques",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#2563eb" : "#aaa"}
        strokeWidth="1.8"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    id: "banks",
    label: "Banks",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#2563eb" : "#aaa"}
        strokeWidth="1.8"
      >
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M8 6V5a2 2 0 014 0v1" />
        <line x1="12" y1="11" x2="12" y2="15" />
      </svg>
    ),
  },
];

function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [showAddCheque, setShowAddCheque] = useState(false);

  const banksHook = useBanks();
  const chequesHook = useCheques();

  const handleClearCheque = (chequeId) => {
    const cheque = chequesHook.getChequeById(chequeId);
    if (!cheque) return;
    chequesHook.clearCheque(chequeId);
    banksHook.deductBalance(cheque.bankId, cheque.amount);
  };

  const handleDeleteCheque = (chequeId) => {
    const cheque = chequesHook.getChequeById(chequeId);
    if (!cheque) return;
    if (cheque.status === "cleared") {
      banksHook.refundBalance(cheque.bankId, cheque.amount);
    }
    chequesHook.deleteCheque(chequeId);
  };

  const sharedProps = {
    ...banksHook,
    ...chequesHook,
    onClearCheque: handleClearCheque,
    onDeleteCheque: handleDeleteCheque,
    navigateTo: setActiveScreen,
    openAddCheque: () => setShowAddCheque(true),
  };

  const renderScreen = () => {
    if (showAddCheque) {
      return (
        <AddCheque {...sharedProps} onClose={() => setShowAddCheque(false)} />
      );
    }
    switch (activeScreen) {
      case "dashboard":
        return <Dashboard {...sharedProps} />;
      case "cheques":
        return <Cheques {...sharedProps} />;
      case "banks":
        return <Banks {...sharedProps} />;
      default:
        return <Dashboard {...sharedProps} />;
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.screenArea}>{renderScreen()}</div>

      {!showAddCheque && (
        <nav style={styles.bottomNav}>
          {NAV_ITEMS.map((item, index) => {
            if (index === 1) {
              return (
                <>
                  <button
                    key={item.id}
                    style={{
                      ...styles.navItem,
                      ...(activeScreen === item.id ? styles.navItemActive : {}),
                    }}
                    onClick={() => setActiveScreen(item.id)}
                  >
                    {item.icon(activeScreen === item.id)}
                    <span
                      style={{
                        ...styles.navLabel,
                        ...(activeScreen === item.id
                          ? styles.navLabelActive
                          : {}),
                      }}
                    >
                      {item.label}
                    </span>
                  </button>

                  <button
                    key="add"
                    style={styles.addBtn}
                    onClick={() => setShowAddCheque(true)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </>
              );
            }
            return (
              <button
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(activeScreen === item.id ? styles.navItemActive : {}),
                }}
                onClick={() => setActiveScreen(item.id)}
              >
                {item.icon(activeScreen === item.id)}
                <span
                  style={{
                    ...styles.navLabel,
                    ...(activeScreen === item.id ? styles.navLabelActive : {}),
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    maxWidth: "480px",
    margin: "0 auto",
    background: "#f5f5f0",
    position: "relative",
    overflow: "hidden",
  },
  screenArea: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingBottom: "72px",
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "480px",
    background: "#fff",
    borderTop: "0.5px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    padding: "8px 0 16px",
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    padding: "4px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  navItemActive: {},
  navLabel: {
    fontSize: "10px",
    color: "#aaa",
  },
  navLabelActive: {
    color: "#2563eb",
  },
  addBtn: {
    width: "52px",
    height: "52px",
    background: "#2563eb",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-20px",
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 2px 12px rgba(37,99,235,0.3)",
  },
};

export default App;

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
        width="20"
        height="20"
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
        width="20"
        height="20"
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
        width="20"
        height="20"
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

const SIDEBAR_WIDTH = 220;
const MOBILE_TOPBAR_HEIGHT = 52;

function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [showAddCheque, setShowAddCheque] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const banksHook = useBanks();
  const chequesHook = useCheques();

  const handleClearCheque = (chequeId) => {
    const cheque = chequesHook.getChequeById(chequeId);
    if (!cheque) return;
    chequesHook.clearCheque(chequeId);
    banksHook.deductBalance(cheque.bankId, cheque.amount);
  };

  const handleDeleteCheque = (chequeId) => {
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

  const navigate = (id) => {
    setActiveScreen(id);
    setDrawerOpen(false);
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

  const SidebarContent = () => (
    <div style={styles.sidebarInner}>
      <div style={styles.sidebarLogo}>
        Cheque<span style={{ color: "#2563eb" }}>Mate</span>
      </div>

      <nav style={styles.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id && !showAddCheque;
          return (
            <button
              key={item.id}
              style={{
                ...styles.sidebarItem,
                ...(isActive ? styles.sidebarItemActive : {}),
              }}
              onClick={() => navigate(item.id)}
            >
              {item.icon(isActive)}
              <span
                style={{
                  ...styles.sidebarLabel,
                  ...(isActive ? styles.sidebarLabelActive : {}),
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <button
        style={styles.newChequeBtn}
        onClick={() => {
          setShowAddCheque(true);
          setDrawerOpen(false);
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New cheque
      </button>
    </div>
  );

  return (
    <div style={styles.root}>
      {/* Desktop sidebar */}
      <aside style={styles.sidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={styles.mobileTopbar} className="cm-mobile-topbar">
        <button style={styles.hamburger} onClick={() => setDrawerOpen(true)}>
          <div style={styles.hamburgerLine} />
          <div style={styles.hamburgerLine} />
          <div style={styles.hamburgerLine} />
        </button>
        <p style={styles.mobileLogoText}>
          Cheque<span style={{ color: "#2563eb" }}>Mate</span>
        </p>
        <button
          style={styles.mobileAddBtn}
          onClick={() => setShowAddCheque(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div style={styles.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          ...styles.drawer,
          transform: drawerOpen
            ? "translateX(0)"
            : `translateX(-${SIDEBAR_WIDTH}px)`,
        }}
      >
        <SidebarContent />
      </div>

      {/* Main content */}
      <main style={styles.main}>{renderScreen()}</main>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    height: "100dvh",
    background: "#f5f5f0",
    overflow: "hidden",
  },
  sidebar: {
    width: `${SIDEBAR_WIDTH}px`,
    flexShrink: 0,
    background: "#fff",
    borderRight: "0.5px solid #e5e5e5",
    height: "100dvh",
    overflowY: "auto",
    display: "none",
  },
  sidebarInner: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    height: "100%",
  },
  sidebarLogo: {
    fontSize: "20px",
    fontWeight: "500",
    letterSpacing: "-0.5px",
    color: "#111",
    padding: "0 20px 24px",
    borderBottom: "0.5px solid #f0f0f0",
    marginBottom: "12px",
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    padding: "0 12px",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    boxSizing: "border-box",
  },
  sidebarItemActive: {
    background: "#eff6ff",
  },
  sidebarLabel: {
    fontSize: "14px",
    color: "#666",
  },
  sidebarLabelActive: {
    color: "#2563eb",
    fontWeight: "500",
  },
  newChequeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    margin: "16px 12px 0",
    width: "calc(100% - 24px)",
    boxSizing: "border-box",
  },
  mobileTopbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: `${MOBILE_TOPBAR_HEIGHT}px`,
    background: "#fff",
    borderBottom: "0.5px solid #e5e5e5",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
  },
  mobileLogoText: {
    fontSize: "18px",
    fontWeight: "500",
    letterSpacing: "-0.5px",
    color: "#111",
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "4px",
  },
  hamburgerLine: {
    width: "20px",
    height: "2px",
    background: "#444",
    borderRadius: "2px",
  },
  mobileAddBtn: {
    width: "34px",
    height: "34px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 300,
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: `${SIDEBAR_WIDTH}px`,
    background: "#fff",
    borderRight: "0.5px solid #e5e5e5",
    zIndex: 400,
    transition: "transform 0.25s ease",
    overflowY: "auto",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: `${MOBILE_TOPBAR_HEIGHT}px`,
    background: "#f5f5f0",
  },
};

export default App;

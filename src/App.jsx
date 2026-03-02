import { useMemo, useState } from "react";
import HomePage from "./pages/HomePage";
import PitScoutPage from "./pages/PitScoutPage";
import MatchScoutPage from "./pages/MatchScoutPage";
import RankingsPage from "./pages/RankingsPage";

const TABS = ["home", "pit", "match", "rankings"];

const TAB_LABELS = {
  home: { label: "Home", icon: "🏠" },
  pit: { label: "Pit Scout", icon: "🛠️" },
  match: { label: "Match Scout", icon: "📊" },
  rankings: { label: "Rankings", icon: "🏆" }
};

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const page = useMemo(() => {
    if (activeTab === "pit") return <PitScoutPage />;
    if (activeTab === "match") return <MatchScoutPage />;
    if (activeTab === "rankings") return <RankingsPage />;
    return <HomePage onNavigate={setActiveTab} />;
  }, [activeTab]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>MorScout 2026</h1>
        <p>REBUILT</p>
      </header>

      <main className="page-content">{page}</main>

      <nav className="bottom-nav" aria-label="Primary">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab(tab)}
          >
            <span style={{ fontSize: '1.2rem' }}>{TAB_LABELS[tab].icon}</span>
            <span>{TAB_LABELS[tab].label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;

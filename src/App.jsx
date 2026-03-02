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

const BackgroundDrawings = () => (
  <div className="bg-drawings" aria-hidden="true">
    <svg className="bg-sketch bg-sketch-ammonite" viewBox="0 0 240 240">
      <path d="M120 14c-58 0-105 47-105 105s47 105 105 105 105-47 105-105S178 14 120 14z" />
      <path d="M120 44c-41 0-75 34-75 75s34 75 75 75 75-34 75-75-34-75-75-75z" />
      <path d="M120 74c-24 0-45 21-45 45s21 45 45 45 45-21 45-45-21-45-45-45z" />
      <path d="M120 103c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
      <path d="M120 14v29m0 31v29m0 31v29m0 31v29m-106-104h30m31 0h30m31 0h30m31 0h29" />
    </svg>

    <svg className="bg-sketch bg-sketch-bones" viewBox="0 0 300 160">
      <path d="M15 105c15-26 38-41 73-43 28-2 54 8 81 27 25 17 48 25 73 26" />
      <path d="M31 120c18-30 50-45 89-45 28 0 55 8 83 27 18 12 39 21 61 23" />
      <path d="M89 76v54m24-56v55m24-53v53m24-44v45m24-36v34" />
      <path d="M70 128c0 8 6 14 14 14 7 0 13-6 13-14 0-7-6-13-13-13-8 0-14 6-14 13zm130-9c0 8 6 14 14 14 7 0 13-6 13-14 0-7-6-13-13-13-8 0-14 6-14 13z" />
    </svg>

    <svg className="bg-sketch bg-sketch-footprint" viewBox="0 0 180 260">
      <path d="M88 78c-18 0-35 17-35 38 0 28 14 48 34 77 19-29 33-49 33-77 0-21-16-38-32-38z" />
      <circle cx="47" cy="52" r="16" />
      <circle cx="72" cy="32" r="13" />
      <circle cx="102" cy="28" r="12" />
      <circle cx="131" cy="42" r="15" />
      <path d="M86 121v71" />
    </svg>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const page = useMemo(() => {
    if (activeTab === "pit") return <PitScoutPage />;
    if (activeTab === "match") return <MatchScoutPage />;
    if (activeTab === "rankings") return <RankingsPage />;
    return <HomePage onNavigate={setActiveTab} />;
  }, [activeTab]);

  return (
    <>
      <BackgroundDrawings />
      <div className="app-shell">
        <header className="top-bar">
          <h1>MorScout 2026</h1>
          <p>REBUILT ARCHAEOLOGY</p>
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
              <span style={{ fontSize: "1.2rem" }}>{TAB_LABELS[tab].icon}</span>
              <span>{TAB_LABELS[tab].label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default App;

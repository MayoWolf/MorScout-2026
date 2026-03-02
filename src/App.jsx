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
    <svg className="bg-canvas" viewBox="0 0 1200 2000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <symbol id="glyph-skull" viewBox="0 0 120 120">
          <path d="M60 16c-22 0-40 18-40 40 0 13 6 24 16 31v15h12V86h24v16h12V87c10-7 16-18 16-31 0-22-18-40-40-40z" />
          <circle cx="48" cy="52" r="6" />
          <circle cx="72" cy="52" r="6" />
          <path d="M46 69h28M60 69v11M44 99h8m8 0h8m8 0h8" />
        </symbol>
        <symbol id="glyph-bone" viewBox="0 0 120 120">
          <path d="M31 47c-5 0-10-4-10-10s5-10 10-10c4 0 8 2 9 6l30 30c4-1 8 1 10 4s2 8 0 11-6 6-10 5L39 53c-2 3-5 5-8 5z" />
          <path d="M89 73c5 0 10 4 10 10s-5 10-10 10c-4 0-8-2-9-6L50 57c-4 1-8-1-10-4s-2-8 0-11 6-6 10-5l30 30c2-3 5-5 9-5z" />
        </symbol>
        <symbol id="glyph-ammonite" viewBox="0 0 120 120">
          <path d="M60 14c-25 0-46 21-46 46s21 46 46 46 46-21 46-46-21-46-46-46z" />
          <path d="M60 30c-17 0-30 13-30 30s13 30 30 30 30-13 30-30-13-30-30-30z" />
          <path d="M60 45c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15z" />
          <path d="M60 14v16m0 60v16M14 60h16m60 0h16" />
        </symbol>
        <symbol id="glyph-footprint" viewBox="0 0 120 120">
          <path d="M58 47c-11 0-22 11-22 24 0 18 9 31 21 49 12-18 21-31 21-49 0-13-10-24-20-24z" />
          <circle cx="33" cy="32" r="8" />
          <circle cx="47" cy="22" r="7" />
          <circle cx="63" cy="20" r="7" />
          <circle cx="79" cy="28" r="8" />
        </symbol>
      </defs>

      <rect className="bg-grid" x="0" y="0" width="1200" height="2000" />

      <use href="#glyph-ammonite" className="motif motif-a" x="40" y="80" width="210" height="210" />
      <use href="#glyph-skull" className="motif motif-b" x="330" y="140" width="160" height="160" />
      <use href="#glyph-footprint" className="motif motif-c" x="620" y="70" width="180" height="180" />
      <use href="#glyph-bone" className="motif motif-d" x="900" y="120" width="170" height="170" />

      <use href="#glyph-skull" className="motif motif-c" x="120" y="460" width="170" height="170" />
      <use href="#glyph-bone" className="motif motif-a" x="420" y="420" width="210" height="210" />
      <use href="#glyph-ammonite" className="motif motif-d" x="760" y="450" width="190" height="190" />
      <use href="#glyph-footprint" className="motif motif-b" x="980" y="420" width="170" height="170" />

      <use href="#glyph-ammonite" className="motif motif-b" x="30" y="800" width="180" height="180" />
      <use href="#glyph-footprint" className="motif motif-d" x="270" y="760" width="190" height="190" />
      <use href="#glyph-skull" className="motif motif-a" x="560" y="820" width="170" height="170" />
      <use href="#glyph-bone" className="motif motif-c" x="840" y="790" width="220" height="220" />

      <use href="#glyph-bone" className="motif motif-b" x="70" y="1140" width="230" height="230" />
      <use href="#glyph-ammonite" className="motif motif-c" x="380" y="1180" width="190" height="190" />
      <use href="#glyph-footprint" className="motif motif-a" x="680" y="1130" width="190" height="190" />
      <use href="#glyph-skull" className="motif motif-d" x="970" y="1190" width="160" height="160" />

      <use href="#glyph-skull" className="motif motif-a" x="110" y="1520" width="170" height="170" />
      <use href="#glyph-bone" className="motif motif-d" x="400" y="1500" width="210" height="210" />
      <use href="#glyph-ammonite" className="motif motif-c" x="720" y="1540" width="190" height="190" />
      <use href="#glyph-footprint" className="motif motif-b" x="980" y="1510" width="180" height="180" />
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

function HomePage({ onNavigate }) {
  return (
    <section className="home-page">
      <h2>Welcome, MorTorq Scout</h2>
      <div className="card-grid">
        <button type="button" className="feature-card" onClick={() => onNavigate("pit")}>
          <h3>Pit Scouting</h3>
          <p>Capture robot capabilities and strategy notes.</p>
        </button>
        <button type="button" className="feature-card" onClick={() => onNavigate("match")}>
          <h3>Match Scouting</h3>
          <p>Track per-match scoring, defense, climb, and issues.</p>
        </button>
        <button type="button" className="feature-card" onClick={() => onNavigate("rankings")}>
          <h3>Rankings</h3>
          <p>Review live data from Google Sheets.</p>
        </button>
      </div>
    </section>
  );
}

export default HomePage;

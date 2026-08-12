function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">S</span>
        <div>
          <p className="brand-name">Solar & Wind Deployment Intelligence</p>
          <p className="brand-subtitle">Location analysis for renewable-energy deployment</p>
        </div>
      </div>
      <nav className="nav-links">
        <a href="#analysis">Analysis</a>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

export default Header;

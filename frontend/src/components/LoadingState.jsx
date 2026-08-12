function LoadingState() {
  return (
    <div className="card status-card" aria-live="polite">
      <div className="loading-panel">
        <span className="loading-indicator" aria-hidden="true" />
        <div>
          <h2>Analysing site</h2>
          <p>Please wait while the platform evaluates solar and wind deployment potential.</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;

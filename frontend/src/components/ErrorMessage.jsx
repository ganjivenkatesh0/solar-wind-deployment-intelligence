function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card error-card">
      <div className="error-header">
        <h2>Analysis error</h2>
        {onRetry ? (
          <button type="button" className="retry-button" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;

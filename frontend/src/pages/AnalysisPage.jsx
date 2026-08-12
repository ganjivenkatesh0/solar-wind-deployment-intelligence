import { useState } from 'react';
import LocationForm from '../components/LocationForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ResultSection from '../components/ResultSection.jsx';
import LocationMap from '../components/LocationMap.jsx';
import { analyzeSite } from '../api/analysis.js';

function AnalysisPage() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  const handleSubmit = async (payload) => {
    if (status === 'loading') {
      return;
    }

    setErrorMessage('');
    setStatus('loading');
    setLastPayload(payload);

    try {
      const result = await analyzeSite(payload);
      setAnalysisResult(result);
      setStatus('success');
    } catch (error) {
      const message =
        error && typeof error.message === 'string'
          ? error.message
          : 'Analysis service is currently unavailable. Please try again later.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleRetry = async () => {
    if (lastPayload) {
      await handleSubmit(lastPayload);
    }
  };

  return (
    <div className="analysis-layout">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Renewable Deployment Platform</p>
          <h1>Site intelligence for solar, wind, and hybrid energy projects.</h1>
          <p className="hero-copy">
            Run an evidence-based analysis for a geographic location and determine technical feasibility, deployment strategy, and expected yield.
          </p>
        </div>
        <div className="hero-details">
          <div className="hero-card">
            <p className="hero-label">Professional site evaluation</p>
            <p>Use precise latitude and longitude inputs for accurate analysis.</p>
          </div>
          <div className="hero-card">
            <p className="hero-label">Backend-first design</p>
            <p>The frontend connects to the existing FastAPI analysis endpoint using a dedicated API layer.</p>
          </div>
        </div>
      </div>

      <div className="workspace-grid">
        <LocationForm onSubmit={handleSubmit} isSubmitting={status === 'loading'} />


<div className="results-column">
  {status === 'loading' ? <LoadingState /> : null}

  {status === 'error' ? (
    <ErrorMessage
      message={errorMessage}
      onRetry={handleRetry}
    />
  ) : null}

  <ResultSection
    result={analysisResult}
    status={status}
  />
</div>
      </div>

      {status === 'success' && lastPayload ? (
        <section className="map-section">
          <div className="section-heading">
            <p className="eyebrow">Site location</p>
            <h2>Analysed location</h2>
            <p>
              Interactive map showing the exact coordinates used for this analysis.
            </p>
          </div>

          <div className="map-meta">
            <span>
              Latitude: <strong>{lastPayload.latitude.toFixed(4)}</strong>
            </span>
            <span>
              Longitude: <strong>{lastPayload.longitude.toFixed(4)}</strong>
            </span>
          </div>

          <LocationMap
            latitude={lastPayload.latitude}
            longitude={lastPayload.longitude}
          />
        </section>
      ) : null}

      <section className="footer-card" id="about">
        <h2>About this analysis</h2>
        <p>
          This platform evaluates site suitability using an established solar and wind deployment pipeline. The results are sourced directly from the backend API and are not simulated in the frontend.
        </p>
      </section>
    </div>
  );
}

export default AnalysisPage;

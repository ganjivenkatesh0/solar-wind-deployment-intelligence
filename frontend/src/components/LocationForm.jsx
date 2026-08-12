import { useState } from 'react';

function LocationForm({ onSubmit, isSubmitting }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [landArea, setLandArea] = useState('1.0');
  const [budget, setBudget] = useState('100000');
  const [formError, setFormError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prevent duplicate submissions when a request is already running
    if (isSubmitting) {
      return;
    }

    // Client-side presence check only; backend remains authoritative
    if (!isValid) {
      setFormError('Please complete all required fields before submitting.');
      return;
    }

    setFormError('');
    onSubmit({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      land_area_hectares: parseFloat(landArea),
      available_budget: parseFloat(budget),
    });
  };

  const isValid =
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    landArea.trim() !== '' &&
    budget.trim() !== '';

  return (
    <section className="card form-card" id="analysis">
      <div className="section-header">
        <p className="eyebrow">LOCATION ANALYSIS</p>
        <h1>Evaluate renewable-energy deployment potential</h1>
        <p className="section-copy">
          Enter site details and coordinates to run a professional solar and wind analysis.
        </p>
      </div>

      <form className="location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            placeholder="e.g. 28.7041"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            placeholder="e.g. 77.1025"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="land-area">Land Area (hectares)</label>
          <input
            id="land-area"
            name="land-area"
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 1.0"
            value={landArea}
            onChange={(event) => setLandArea(event.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="budget">Available Budget (USD)</label>
          <input
            id="budget"
            name="budget"
            type="number"
            step="1000"
            min="0"
            placeholder="e.g. 100000"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="primary-button" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Analysing site...' : 'Analyse Location'}
        </button>

        {formError ? <p className="error-message">{formError}</p> : null}

      </form>
    </section>
  );
}

export default LocationForm;

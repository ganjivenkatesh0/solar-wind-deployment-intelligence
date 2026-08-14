const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || '/api';

export async function analyzeSite(payload) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    const error = new Error(
      'Unable to reach the analysis service. Please verify that the backend is running.'
    );
    error.type = 'network';
    throw error;
  }

  if (!response.ok) {
    let message =
      'Failed to analyze location. The backend returned an error.';

    const contentType = response.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        const errorBody = await response.json();

        if (errorBody && typeof errorBody === 'object') {
          message =
            errorBody.detail ||
            errorBody.message ||
            JSON.stringify(errorBody);
        }
      } else {
        const errorText = await response.text();

        if (errorText) {
          message = errorText;
        }
      }
    } catch {
      // Keep the default error message.
    }

    if (response.status >= 500) {
      message =
        'Analysis service is currently unavailable. Please try again later or verify that the backend is running.';
    }

    const error = new Error(message);
    error.status = response.status;
    error.type = 'backend';

    throw error;
  }

  return response.json();
}
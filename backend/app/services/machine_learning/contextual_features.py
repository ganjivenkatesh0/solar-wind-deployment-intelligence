"""Country-level contextual features for renewable-energy ML inference."""

from pathlib import Path

import pandas as pd


class MLContextualFeatureService:
    """Resolve country context from the ML training dataset."""

    _FILE_PATH = Path(__file__).resolve()
    _DATASET_RELATIVE_PATH = Path(
        "datasets",
        "raw",
        "global_wind_atlas",
        "global_data.xlsx",
    )

    _DATASET_CANDIDATES = [
        _FILE_PATH.parents[4] / _DATASET_RELATIVE_PATH,
        _FILE_PATH.parents[3] / _DATASET_RELATIVE_PATH,
        Path("/app") / _DATASET_RELATIVE_PATH,
    ]

    DATASET_PATH = next(
        (
            candidate
            for candidate in _DATASET_CANDIDATES
            if candidate.exists()
        ),
        _DATASET_CANDIDATES[0],
    )

    FEATURE_COLUMNS = [
        "Year",
        "renewables_share_elec",
        "Governance_Score",
        "Offshore_Wind_Potential_GW",
        "Hydro_Surface_Water_10^9_m3",
    ]

    def __init__(self, dataset_path: str | Path | None = None):
        self.dataset_path = Path(
            dataset_path or self.DATASET_PATH
        )

        if not self.dataset_path.exists():
            raise FileNotFoundError(
                f"ML contextual dataset not found: {self.dataset_path}"
            )

        self._data = pd.read_excel(self.dataset_path)

    def get_country_features(self, iso_code: str) -> dict[str, float]:
        """Return the latest available contextual features for an ISO code."""

        country_data = self._data[
            self._data["ISO_Code"].astype(str).str.upper()
            == iso_code.upper()
        ].copy()

        if country_data.empty:
            raise ValueError(
                f"No ML contextual data found for ISO code: {iso_code}"
            )

        country_data = country_data.sort_values("Year")
        latest = country_data.iloc[-1]

        return {
            "Year": int(latest["Year"]),
            "renewables_share_elec": float(
                latest["renewables_share_elec"]
            ),
            "Governance_Score": float(
                latest["Governance_Score"]
            ),
            "Offshore_Wind_Potential_GW": float(
                latest["Offshore_Wind_Potential_GW"]
            ),
            "Hydro_Surface_Water_10^9_m3": float(
                latest["Hydro_Surface_Water_10^9_m3"]
            ),
        }

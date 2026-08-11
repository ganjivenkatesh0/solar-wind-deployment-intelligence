"""Training dataset preparation for the renewable energy ML baseline."""

from pathlib import Path

import pandas as pd


class RenewableTrainingDataset:
    """Prepare features and target data for ML training."""

    FEATURES = [
        "Year",
        "renewables_share_elec",
        "Governance_Score",
        "Offshore_Wind_Potential_GW",
        "Hydro_Surface_Water_10^9_m3",
    ]

    TARGET = "Solar_PVOUT_Potential"

    @classmethod
    def load_dataset(cls, file_path: str) -> pd.DataFrame:
        """Load the Global Wind Atlas historical dataset."""

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Training dataset not found: {file_path}"
            )

        data = pd.read_excel(path)

        required_columns = cls.FEATURES + [cls.TARGET]

        missing_columns = [
            column
            for column in required_columns
            if column not in data.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Dataset is missing required columns: {missing_columns}"
            )

        return data[required_columns].copy()

    @classmethod
    def prepare(cls, file_path: str) -> tuple[pd.DataFrame, pd.Series]:
        """Prepare feature matrix X and target vector y."""

        data = cls.load_dataset(file_path)

        data = data.dropna(
            subset=cls.FEATURES + [cls.TARGET]
        ).reset_index(drop=True)

        X = data[cls.FEATURES]
        y = data[cls.TARGET]

        return X, y
"""Weighted scoring engine for overall site suitability."""

from typing import Dict

DEFAULT_WEIGHTS = {
    "renewable": 0.40,
    "terrain": 0.20,
    "infrastructure": 0.20,
    "environmental": 0.10,
    "economic": 0.10,
}


def calculate_overall_score(
    renewable: float,
    terrain: float,
    infrastructure: float,
    environmental: float,
    economic: float,
    weights: Dict[str, float] = DEFAULT_WEIGHTS,
) -> Dict[str, float]:
    """Calculate a weighted overall site suitability score."""
    overall = (
        renewable * weights["renewable"]
        + terrain * weights["terrain"]
        + infrastructure * weights["infrastructure"]
        + environmental * weights["environmental"]
        + economic * weights["economic"]
    )

    return {
        "renewable_score": round(renewable, 2),
        "terrain_score": round(terrain, 2),
        "infrastructure_score": round(infrastructure, 2),
        "environmental_score": round(environmental, 2),
        "economic_score": round(economic, 2),
        "overall_score": round(overall, 2),
    }

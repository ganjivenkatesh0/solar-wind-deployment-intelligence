"""Soft technical feasibility scoring for renewable energy sites."""

from typing import Any

from app.services.scoring.normalization import (
    normalize_grid_distance,
    normalize_road_distance,
)


def calculate_soft_constraint_score(
    *,
    grid_distance: float,
    road_distance: float,
) -> dict[str, Any]:
    """
    Calculate a feasibility score from non-mandatory constraints.

    Infrastructure proximity contributes to the score but does not
    independently reject a site.
    """

    grid_score = normalize_grid_distance(grid_distance)
    road_score = normalize_road_distance(road_distance)

    overall_score = round((grid_score + road_score) / 2, 2)

    return {
        "score": overall_score,
        "constraints": {
            "grid_proximity": {
                "score": grid_score,
                "value": grid_distance,
                "unit": "km",
            },
            "road_accessibility": {
                "score": road_score,
                "value": road_distance,
                "unit": "km",
            },
        },
    }

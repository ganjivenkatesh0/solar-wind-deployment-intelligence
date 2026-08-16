"""Soft technical feasibility scoring for renewable energy sites."""

from typing import Any

from app.services.scoring.normalization import (
    normalize_grid_distance,
    normalize_road_distance,
)


def calculate_soft_constraint_score(
    *,
    grid_distance: float | None,
    road_distance: float,
) -> dict[str, Any]:
    """
    Calculate a feasibility score from non-mandatory constraints.

    Infrastructure proximity contributes to the score but does not
    independently reject a site.
    """

    grid_score = (
        normalize_grid_distance(grid_distance)
        if grid_distance is not None
        else None
    )
    road_score = (
        None
        if road_distance is None
        else normalize_road_distance(road_distance)
    )

    available_scores = [
        score for score in (grid_score, road_score)
        if score is not None
    ]

    overall_score = round(
        sum(available_scores) / len(available_scores),
        2,
    ) if available_scores else 0.0

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

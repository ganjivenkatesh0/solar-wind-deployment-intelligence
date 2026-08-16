"""Technical feasibility engine for renewable energy site assessment."""

from typing import Any

from app.services.feasibility.hard_constraints import (
    validate_hard_constraints,
)
from app.services.feasibility.soft_constraints import (
    calculate_soft_constraint_score,
)


class FeasibilityEngine:
    """Evaluate hard constraints and soft technical factors."""

    def evaluate(
        self,
        *,
        slope: float,
        grid_distance: float | None,
        road_distance: float,
        land_use_restricted: bool = False,
    ) -> dict[str, Any]:
        """
        Evaluate the technical feasibility of a renewable energy site.

        Hard constraint failures make the site technically infeasible.
        Soft constraints affect the feasibility score but do not reject
        the site by themselves.
        """

        hard_result = validate_hard_constraints(
            slope=slope,
            land_use_restricted=land_use_restricted,
        )

        soft_result = calculate_soft_constraint_score(
            grid_distance=grid_distance,
            road_distance=road_distance,
        )

        is_feasible = hard_result["passed"]

        decision = (
            "TECHNICALLY FEASIBLE"
            if is_feasible
            else "NOT TECHNICALLY FEASIBLE"
        )

        feasibility_score = (
            soft_result["score"]
            if is_feasible
            else 0.0
        )

        return {
            "is_feasible": is_feasible,
            "feasibility_score": feasibility_score,
            "decision": decision,
            "hard_constraints": hard_result,
            "soft_constraints": soft_result,
            "constraint_summary": (
                "All mandatory technical constraints passed."
                if is_feasible
                else (
                    "Mandatory technical constraints failed: "
                    + ", ".join(hard_result["failed_constraints"])
                )
            ),
        }

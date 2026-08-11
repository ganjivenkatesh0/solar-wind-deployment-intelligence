"""Hard technical feasibility constraints for renewable energy sites."""

from typing import Any


DEFAULT_MAX_SLOPE = 15.0


def validate_hard_constraints(
    *,
    slope: float,
    land_use_restricted: bool = False,
    max_slope: float = DEFAULT_MAX_SLOPE,
) -> dict[str, Any]:
    """
    Validate mandatory technical constraints.

    A site is technically infeasible if:
    - the land is restricted, or
    - the terrain slope exceeds the configured maximum.
    """

    constraints: dict[str, dict[str, Any]] = {}

    land_use_passed = not land_use_restricted
    constraints["land_use"] = {
        "passed": land_use_passed,
        "status": "PASS" if land_use_passed else "FAIL",
        "reason": (
            "Land use is permitted."
            if land_use_passed
            else "Land use is restricted."
        ),
    }

    terrain_passed = 0.0 <= slope <= max_slope
    constraints["terrain"] = {
        "passed": terrain_passed,
        "status": "PASS" if terrain_passed else "FAIL",
        "reason": (
            f"Slope {slope:.2f}° is within the maximum "
            f"allowed slope of {max_slope:.2f}°."
            if terrain_passed
            else f"Slope {slope:.2f}° exceeds the maximum "
            f"allowed slope of {max_slope:.2f}°."
        ),
    }

    failed_constraints = [
        name
        for name, result in constraints.items()
        if not result["passed"]
    ]

    return {
        "passed": len(failed_constraints) == 0,
        "constraints": constraints,
        "failed_constraints": failed_constraints,
    }

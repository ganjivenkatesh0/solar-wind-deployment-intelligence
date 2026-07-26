"""Energy estimation service."""

from app.services.energy.energy_estimation import (
    estimate_solar_energy,
    estimate_wind_energy,
)


def estimate_site_energy(
    deployment_type: str,
    installed_capacity: float,
    solar_capacity_factor: float = 0.22,
    wind_capacity_factor: float = 0.35,
):
    """Estimate energy generation for a deployment type."""

    normalized_deployment_type = deployment_type.lower()

    if normalized_deployment_type in {"solar", "hybrid"}:
        solar_energy = estimate_solar_energy(
            installed_capacity=installed_capacity,
            capacity_factor=solar_capacity_factor,
        )
    else:
        solar_energy = 0

    if normalized_deployment_type in {"wind", "hybrid"}:
        wind_energy = estimate_wind_energy(
            installed_capacity=installed_capacity,
            capacity_factor=wind_capacity_factor,
        )
    else:
        wind_energy = 0

    total_energy = solar_energy + wind_energy

    return {
        "deployment_type": deployment_type,
        "solar_energy": round(solar_energy, 2),
        "wind_energy": round(wind_energy, 2),
        "total_energy": round(total_energy, 2),
    }

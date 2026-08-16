"""Energy estimation utilities."""

from typing import Union

Number = Union[int, float]

OPERATING_HOURS_PER_YEAR = 8760


def estimate_solar_energy(
    installed_capacity: Number,
    capacity_factor: Number,
) -> float:
    """
    Estimate annual solar energy generation.

    Parameters
    ----------
    installed_capacity : float
        Installed capacity in MW

    capacity_factor : float
        Capacity factor (0-1)

    Returns
    -------
    float
        Annual energy generation (MWh/year)
    """

    if installed_capacity < 0:
        raise ValueError("Installed capacity cannot be negative.")

    if not 0 <= capacity_factor <= 1:
        raise ValueError("Capacity factor must be between 0 and 1.")

    annual_energy = installed_capacity * capacity_factor * OPERATING_HOURS_PER_YEAR

    return round(annual_energy, 2)



def estimate_wind_energy(
    installed_capacity: Number,
    capacity_factor: Number,
) -> float:
    """
    Estimate annual wind energy generation.

    Parameters
    ----------
    installed_capacity : float
        Installed wind capacity in MW

    capacity_factor : float
        Wind capacity factor (0–1)

    Returns
    -------
    float
        Annual wind energy generation (MWh/year)
    """

    if installed_capacity < 0:
        raise ValueError("Installed capacity cannot be negative.")

    if not 0 <= capacity_factor <= 1:
        raise ValueError("Capacity factor must be between 0 and 1.")

    annual_energy = (
        installed_capacity
        * capacity_factor
        * OPERATING_HOURS_PER_YEAR
    )

    return round(annual_energy, 2)


def estimate_solar_energy_yield(
    installed_capacity: Number,
    solar_capacity_factor: Number,
    system_efficiency: Number = 1.0,
) -> float:
    """
    Estimate annual solar energy yield.

    Parameters
    ----------
    installed_capacity : float
        Installed capacity in MW

    solar_capacity_factor : float
        Solar capacity factor (0-1)

    system_efficiency : float
        System efficiency factor (0-1)

    Returns
    -------
    float
        Annual solar energy generation (MWh/year)
    """

    if not 0 <= system_efficiency <= 1:
        raise ValueError("System efficiency must be between 0 and 1.")

    annual_energy = estimate_solar_energy(
        installed_capacity=installed_capacity,
        capacity_factor=solar_capacity_factor,
    )

    return round(annual_energy * system_efficiency, 2)


def estimate_wind_energy_yield(
    installed_capacity: Number,
    wind_capacity_factor: Number,
    system_efficiency: Number = 1.0,
) -> float:
    """
    Estimate annual wind energy yield.

    Parameters
    ----------
    installed_capacity : float
        Installed capacity in MW

    wind_capacity_factor : float
        Wind capacity factor (0-1)

    system_efficiency : float
        System efficiency factor (0-1)

    Returns
    -------
    float
        Annual wind energy generation (MWh/year)
    """

    if not 0 <= system_efficiency <= 1:
        raise ValueError("System efficiency must be between 0 and 1.")

    annual_energy = estimate_wind_energy(
        installed_capacity=installed_capacity,
        capacity_factor=wind_capacity_factor,
    )

    return round(annual_energy * system_efficiency, 2)


def estimate_hybrid_energy_yield(
    installed_capacity: Number,
    solar_capacity_factor: Number,
    wind_capacity_factor: Number,
    system_efficiency: Number = 1.0,
    solar_capacity_share: Number = 0.5,
) -> dict:
    """
    Estimate annual energy yield for a hybrid deployment.

    ``installed_capacity`` represents the TOTAL hybrid capacity.
    The total is split between solar and wind using
    ``solar_capacity_share``; the remaining capacity is assigned to wind.
    """

    if installed_capacity < 0:
        raise ValueError("Installed capacity cannot be negative.")

    if not 0 <= solar_capacity_share <= 1:
        raise ValueError("Solar capacity share must be between 0 and 1.")

    solar_capacity = installed_capacity * solar_capacity_share
    wind_capacity = installed_capacity - solar_capacity

    solar_energy = estimate_solar_energy_yield(
        installed_capacity=solar_capacity,
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=system_efficiency,
    )
    wind_energy = estimate_wind_energy_yield(
        installed_capacity=wind_capacity,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=system_efficiency,
    )
    total_energy = solar_energy + wind_energy

    return {
        "solar_capacity_mw": round(solar_capacity, 2),
        "wind_capacity_mw": round(wind_capacity, 2),
        "solar_energy": round(solar_energy, 2),
        "wind_energy": round(wind_energy, 2),
        "total_energy": round(total_energy, 2),
    }


def estimate_deployment_energy_yield(
    deployment_type: str,
    installed_capacity: Number,
    solar_capacity_factor: Number,
    wind_capacity_factor: Number,
    system_efficiency: Number = 1.0,
) -> dict:
    """
    Estimate annual energy using the final recommended deployment type
    and final total installed capacity.
    """

    normalized_type = deployment_type.strip().lower()

    if normalized_type == "solar":
        solar_energy = estimate_solar_energy_yield(
            installed_capacity=installed_capacity,
            solar_capacity_factor=solar_capacity_factor,
            system_efficiency=system_efficiency,
        )
        return {
            "deployment_type": "Solar",
            "solar_capacity_mw": round(float(installed_capacity), 2),
            "wind_capacity_mw": 0.0,
            "solar_energy": round(solar_energy, 2),
            "wind_energy": 0.0,
            "total_energy": round(solar_energy, 2),
        }

    if normalized_type == "wind":
        wind_energy = estimate_wind_energy_yield(
            installed_capacity=installed_capacity,
            wind_capacity_factor=wind_capacity_factor,
            system_efficiency=system_efficiency,
        )
        return {
            "deployment_type": "Wind",
            "solar_capacity_mw": 0.0,
            "wind_capacity_mw": round(float(installed_capacity), 2),
            "solar_energy": 0.0,
            "wind_energy": round(wind_energy, 2),
            "total_energy": round(wind_energy, 2),
        }

    if normalized_type == "hybrid":
        result = estimate_hybrid_energy_yield(
            installed_capacity=installed_capacity,
            solar_capacity_factor=solar_capacity_factor,
            wind_capacity_factor=wind_capacity_factor,
            system_efficiency=system_efficiency,
        )
        result["deployment_type"] = "Hybrid"
        return result

    return {
        "deployment_type": "Not Recommended",
        "solar_capacity_mw": 0.0,
        "wind_capacity_mw": 0.0,
        "solar_energy": 0.0,
        "wind_energy": 0.0,
        "total_energy": 0.0,
    }



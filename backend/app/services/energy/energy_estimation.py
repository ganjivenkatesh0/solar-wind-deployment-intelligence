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
) -> dict:
    """
    Estimate annual energy yield for a hybrid deployment.

    Parameters
    ----------
    installed_capacity : float
        Installed total capacity in MW for each technology.

    solar_capacity_factor : float
        Solar capacity factor (0-1)

    wind_capacity_factor : float
        Wind capacity factor (0-1)

    system_efficiency : float
        System efficiency factor (0-1)

    Returns
    -------
    dict
        Annual energy generation breakdown for hybrid deployment.
    """

    solar_energy = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=system_efficiency,
    )
    wind_energy = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=system_efficiency,
    )
    total_energy = solar_energy + wind_energy

    return {
        "solar_energy": round(solar_energy, 2),
        "wind_energy": round(wind_energy, 2),
        "total_energy": round(total_energy, 2),
    }



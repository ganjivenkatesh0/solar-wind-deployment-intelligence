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



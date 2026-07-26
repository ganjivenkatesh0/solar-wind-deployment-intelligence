import pytest

from app.services.energy.energy_estimation import (
    estimate_solar_energy,
    estimate_wind_energy,
)
from app.services.energy.energy_service import estimate_site_energy


def test_estimate_solar_energy_returns_expected_annual_generation():
    result = estimate_solar_energy(installed_capacity=100, capacity_factor=0.22)

    assert result == 192720.0


def test_estimate_solar_energy_rejects_negative_capacity():
    with pytest.raises(ValueError, match="Installed capacity cannot be negative"):
        estimate_solar_energy(installed_capacity=-10, capacity_factor=0.2)


def test_estimate_solar_energy_rejects_invalid_capacity_factor():
    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_solar_energy(installed_capacity=50, capacity_factor=1.2)


def test_estimate_wind_energy_returns_expected_annual_generation():
    result = estimate_wind_energy(installed_capacity=100, capacity_factor=0.35)

    assert result == 306600.0


def test_estimate_wind_energy_rejects_negative_capacity():
    with pytest.raises(ValueError, match="Installed capacity cannot be negative"):
        estimate_wind_energy(installed_capacity=-10, capacity_factor=0.3)


def test_estimate_wind_energy_rejects_invalid_capacity_factor():
    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_wind_energy(installed_capacity=50, capacity_factor=1.5)


def test_estimate_site_energy_returns_hybrid_values():
    result = estimate_site_energy(
        deployment_type="Hybrid",
        installed_capacity=100,
    )

    assert result == {
        "deployment_type": "Hybrid",
        "solar_energy": 192720.0,
        "wind_energy": 306600.0,
        "total_energy": 499320.0,
    }


def test_estimate_site_energy_handles_solar_only():
    result = estimate_site_energy(
        deployment_type="Solar",
        installed_capacity=50,
    )

    assert result["deployment_type"] == "Solar"
    assert result["solar_energy"] == 96360.0
    assert result["wind_energy"] == 0.0
    assert result["total_energy"] == 96360.0


def test_estimate_site_energy_handles_wind_only():
    result = estimate_site_energy(
        deployment_type="Wind",
        installed_capacity=50,
    )

    assert result["deployment_type"] == "Wind"
    assert result["solar_energy"] == 0.0
    assert result["wind_energy"] == 153300.0
    assert result["total_energy"] == 153300.0

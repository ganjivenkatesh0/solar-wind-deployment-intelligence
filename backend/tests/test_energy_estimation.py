import pytest

from app.services.energy.energy_estimation import (
    estimate_hybrid_energy_yield,
    estimate_solar_energy,
    estimate_solar_energy_yield,
    estimate_wind_energy,
    estimate_wind_energy_yield,
)
from app.services.energy.energy_service import estimate_site_energy
from app.services.wind_assessment import WindAssessmentService


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


def test_estimate_solar_energy_yield_returns_expected_annual_generation():
    result = estimate_solar_energy_yield(installed_capacity=100, solar_capacity_factor=0.22)

    assert result == 192720.0


def test_estimate_wind_energy_yield_returns_expected_annual_generation():
    result = estimate_wind_energy_yield(installed_capacity=100, wind_capacity_factor=0.35)

    assert result == 306600.0


def test_estimate_hybrid_energy_yield_returns_expected_breakdown():
    result = estimate_hybrid_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.22,
        wind_capacity_factor=0.35,
    )

    assert result == {
        "solar_capacity_mw": 50.0,
        "wind_capacity_mw": 50.0,
        "solar_energy": 96360.0,
        "wind_energy": 153300.0,
        "total_energy": 249660.0,
    }


def test_day27_solar_yield_uses_capacity_factor_not_direct_irradiance():
    """Solar irradiance exists in the application, but the current Day-27 yield calculation consumes solar capacity factor."""
    low_energy = estimate_solar_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.18,
        system_efficiency=0.9,
    )
    high_energy = estimate_solar_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.28,
        system_efficiency=0.9,
    )

    assert high_energy > low_energy


def test_estimate_wind_energy_yield_increases_with_wind_speed_capacity_factor():
    service = WindAssessmentService()
    low_capacity_factor = service.calculate_capacity_factor(4.0) / 100.0
    high_capacity_factor = service.calculate_capacity_factor(8.0) / 100.0

    low_energy = estimate_wind_energy_yield(
        installed_capacity=100,
        wind_capacity_factor=low_capacity_factor,
        system_efficiency=0.9,
    )
    high_energy = estimate_wind_energy_yield(
        installed_capacity=100,
        wind_capacity_factor=high_capacity_factor,
        system_efficiency=0.9,
    )

    assert high_capacity_factor > low_capacity_factor
    assert high_energy > low_energy


def test_estimate_energy_yield_increases_with_capacity_factor_for_solar_wind_and_hybrid():
    installed_capacity = 100
    system_efficiency = 0.95

    low_solar_energy = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=0.20,
        system_efficiency=system_efficiency,
    )
    high_solar_energy = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=0.30,
        system_efficiency=system_efficiency,
    )

    low_wind_energy = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=0.20,
        system_efficiency=system_efficiency,
    )
    high_wind_energy = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=0.40,
        system_efficiency=system_efficiency,
    )

    low_hybrid_energy = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=0.20,
        wind_capacity_factor=0.20,
        system_efficiency=system_efficiency,
    )
    high_hybrid_energy = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=0.30,
        wind_capacity_factor=0.40,
        system_efficiency=system_efficiency,
    )

    assert high_solar_energy > low_solar_energy
    assert high_wind_energy > low_wind_energy
    assert high_hybrid_energy["total_energy"] > low_hybrid_energy["total_energy"]


def test_estimate_energy_yield_obeys_system_efficiency_order():
    installed_capacity = 100
    solar_capacity_factor = 0.25
    wind_capacity_factor = 0.35

    solar_high = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=1.0,
    )
    solar_mid = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=0.9,
    )
    solar_low = estimate_solar_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=0.8,
    )

    wind_high = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=1.0,
    )
    wind_mid = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=0.9,
    )
    wind_low = estimate_wind_energy_yield(
        installed_capacity=installed_capacity,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=0.8,
    )

    hybrid_high = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=1.0,
    )
    hybrid_mid = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=0.9,
    )
    hybrid_low = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=0.8,
    )

    assert solar_high > solar_mid > solar_low
    assert wind_high > wind_mid > wind_low
    assert hybrid_high["total_energy"] > hybrid_mid["total_energy"] > hybrid_low["total_energy"]


def test_estimate_hybrid_energy_yield_consistent_with_component_sums():
    installed_capacity = 100
    solar_capacity_factor = 0.22
    wind_capacity_factor = 0.35
    system_efficiency = 0.9

    hybrid = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=system_efficiency,
    )
    solar_energy = estimate_solar_energy_yield(
        installed_capacity=hybrid["solar_capacity_mw"],
        solar_capacity_factor=solar_capacity_factor,
        system_efficiency=system_efficiency,
    )
    wind_energy = estimate_wind_energy_yield(
        installed_capacity=hybrid["wind_capacity_mw"],
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=system_efficiency,
    )

    assert hybrid["solar_energy"] == pytest.approx(solar_energy)
    assert hybrid["wind_energy"] == pytest.approx(wind_energy)
    assert hybrid["total_energy"] == pytest.approx(solar_energy + wind_energy)
    assert hybrid["solar_energy"] == pytest.approx(solar_energy)
    assert hybrid["wind_energy"] == pytest.approx(wind_energy)

    solar_changed = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=0.25,
        wind_capacity_factor=wind_capacity_factor,
        system_efficiency=system_efficiency,
    )
    wind_changed = estimate_hybrid_energy_yield(
        installed_capacity=installed_capacity,
        solar_capacity_factor=solar_capacity_factor,
        wind_capacity_factor=0.45,
        system_efficiency=system_efficiency,
    )

    assert solar_changed["solar_energy"] > hybrid["solar_energy"]
    assert solar_changed["wind_energy"] == hybrid["wind_energy"]
    assert wind_changed["wind_energy"] > hybrid["wind_energy"]
    assert wind_changed["solar_energy"] == hybrid["solar_energy"]


def test_estimate_energy_yield_rejects_invalid_system_efficiency():
    with pytest.raises(ValueError, match="System efficiency must be between 0 and 1"):
        estimate_solar_energy_yield(
            installed_capacity=100,
            solar_capacity_factor=0.22,
            system_efficiency=-0.1,
        )

    with pytest.raises(ValueError, match="System efficiency must be between 0 and 1"):
        estimate_wind_energy_yield(
            installed_capacity=100,
            wind_capacity_factor=0.35,
            system_efficiency=1.1,
        )


def test_estimate_energy_yield_rejects_invalid_capacity_factors():
    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_solar_energy_yield(installed_capacity=100, solar_capacity_factor=-0.05)

    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_solar_energy_yield(installed_capacity=50, solar_capacity_factor=1.5)

    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_wind_energy_yield(installed_capacity=100, wind_capacity_factor=-0.1)

    with pytest.raises(ValueError, match="Capacity factor must be between 0 and 1"):
        estimate_wind_energy_yield(installed_capacity=50, wind_capacity_factor=1.5)


def test_estimate_wind_energy_yield_respects_system_efficiency():
    full_efficiency = estimate_wind_energy_yield(
        installed_capacity=100,
        wind_capacity_factor=0.35,
        system_efficiency=1.0,
    )
    reduced_efficiency = estimate_wind_energy_yield(
        installed_capacity=100,
        wind_capacity_factor=0.35,
        system_efficiency=0.8,
    )

    assert reduced_efficiency < full_efficiency
    assert reduced_efficiency == 245280.0


def test_estimate_hybrid_energy_yield_respects_system_efficiency():
    full_efficiency = estimate_hybrid_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.22,
        wind_capacity_factor=0.35,
        system_efficiency=1.0,
    )
    reduced_efficiency = estimate_hybrid_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.22,
        wind_capacity_factor=0.35,
        system_efficiency=0.75,
    )

    assert reduced_efficiency["total_energy"] < full_efficiency["total_energy"]
    assert reduced_efficiency["total_energy"] == 187245.0


def test_estimate_energy_yield_allows_zero_efficiency():
    result = estimate_solar_energy_yield(
        installed_capacity=100,
        solar_capacity_factor=0.22,
        system_efficiency=0.0,
    )

    assert result == 0.0


def test_estimate_energy_yield_rejects_invalid_capacity_values():
    with pytest.raises(ValueError, match="Installed capacity cannot be negative"):
        estimate_solar_energy_yield(installed_capacity=-10, solar_capacity_factor=0.22)

    with pytest.raises(ValueError, match="Installed capacity cannot be negative"):
        estimate_wind_energy_yield(installed_capacity=-10, wind_capacity_factor=0.35)

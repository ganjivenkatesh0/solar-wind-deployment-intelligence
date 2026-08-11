import pytest

from app.services.financial.financial_analysis import (
    calculate_roi,
    estimate_annual_revenue,
    estimate_total_project_cost,
    estimate_payback_period,
)


def test_estimate_annual_revenue_normal_calculation():
    revenue = estimate_annual_revenue(
        annual_energy_yield_mwh=100.0,
        electricity_tariff_inr_per_kwh=7.5,
    )

    assert revenue == 750000.0


def test_estimate_annual_revenue_zero_energy_yield():
    revenue = estimate_annual_revenue(
        annual_energy_yield_mwh=0.0,
        electricity_tariff_inr_per_kwh=7.5,
    )

    assert revenue == 0.0


def test_estimate_annual_revenue_various_tariffs():
    low_revenue = estimate_annual_revenue(
        annual_energy_yield_mwh=50.0,
        electricity_tariff_inr_per_kwh=5.0,
    )
    high_revenue = estimate_annual_revenue(
        annual_energy_yield_mwh=50.0,
        electricity_tariff_inr_per_kwh=10.0,
    )

    assert high_revenue > low_revenue
    assert low_revenue == 250000.0
    assert high_revenue == 500000.0


def test_estimate_annual_revenue_rejects_negative_inputs():
    with pytest.raises(ValueError, match="Annual energy yield cannot be negative"):
        estimate_annual_revenue(
            annual_energy_yield_mwh=-1.0,
            electricity_tariff_inr_per_kwh=7.5,
        )

    with pytest.raises(ValueError, match="Electricity tariff cannot be negative"):
        estimate_annual_revenue(
            annual_energy_yield_mwh=100.0,
            electricity_tariff_inr_per_kwh=-7.5,
        )


def test_estimate_total_project_cost_base_calculation():
    total_cost = estimate_total_project_cost(
        installed_capacity_mw=50.0,
        cost_per_mw_inr=10_000_000.0,
    )

    assert total_cost == 500000000.0


def test_estimate_total_project_cost_with_additional_installation():
    total_cost = estimate_total_project_cost(
        installed_capacity_mw=50.0,
        cost_per_mw_inr=10_000_000.0,
        additional_installation_percentage=10.0,
    )

    assert total_cost == 550000000.0


def test_estimate_total_project_cost_zero_additional_percentage():
    total_cost = estimate_total_project_cost(
        installed_capacity_mw=50.0,
        cost_per_mw_inr=10_000_000.0,
        additional_installation_percentage=0.0,
    )

    assert total_cost == 500000000.0


def test_estimate_total_project_cost_various_capacities():
    low_cost = estimate_total_project_cost(
        installed_capacity_mw=20.0,
        cost_per_mw_inr=10_000_000.0,
    )
    high_cost = estimate_total_project_cost(
        installed_capacity_mw=100.0,
        cost_per_mw_inr=10_000_000.0,
    )

    assert high_cost > low_cost
    assert low_cost == 200000000.0
    assert high_cost == 1000000000.0


def test_estimate_total_project_cost_rejects_negative_inputs():
    with pytest.raises(ValueError, match="Installed capacity cannot be negative"):
        estimate_total_project_cost(
            installed_capacity_mw=-1.0,
            cost_per_mw_inr=10_000_000.0,
        )

    with pytest.raises(ValueError, match="Cost per MW cannot be negative"):
        estimate_total_project_cost(
            installed_capacity_mw=50.0,
            cost_per_mw_inr=-10_000_000.0,
        )

    with pytest.raises(ValueError, match="Additional installation percentage cannot be negative"):
        estimate_total_project_cost(
            installed_capacity_mw=50.0,
            cost_per_mw_inr=10_000_000.0,
            additional_installation_percentage=-5.0,
        )


def test_estimate_payback_period_normal_calculation():
    payback = estimate_payback_period(
        total_project_cost_inr=42_000_000.0,
        annual_revenue_inr=11_560_000.0,
    )

    assert payback == 3.63


def test_estimate_payback_period_decimal_result():
    payback = estimate_payback_period(
        total_project_cost_inr=100_000_000.0,
        annual_revenue_inr=30_000_000.0,
    )

    assert payback == 3.33


def test_estimate_payback_period_rejects_zero_or_negative_revenue():
    with pytest.raises(ValueError, match="Annual revenue must be positive to calculate payback period"):
        estimate_payback_period(
            total_project_cost_inr=50_000_000.0,
            annual_revenue_inr=0.0,
        )

    with pytest.raises(ValueError, match="Annual revenue must be positive to calculate payback period"):
        estimate_payback_period(
            total_project_cost_inr=50_000_000.0,
            annual_revenue_inr=-1.0,
        )


def test_estimate_payback_period_zero_project_cost():
    payback = estimate_payback_period(
        total_project_cost_inr=0.0,
        annual_revenue_inr=10_000_000.0,
    )

    assert payback == 0.0


def test_estimate_payback_period_rejects_negative_project_cost():
    with pytest.raises(ValueError, match="Total project cost cannot be negative"):
        estimate_payback_period(
            total_project_cost_inr=-1.0,
            annual_revenue_inr=10_000_000.0,
        )


def test_calculate_roi_positive_return():
    roi = calculate_roi(
        total_project_cost_inr=10_000_000.0,
        annual_revenue_inr=12_000_000.0,
    )

    assert roi == 20.0


def test_calculate_roi_negative_return():
    roi = calculate_roi(
        total_project_cost_inr=10_000_000.0,
        annual_revenue_inr=8_000_000.0,
    )

    assert roi == -20.0


def test_calculate_roi_zero_revenue():
    roi = calculate_roi(
        total_project_cost_inr=10_000_000.0,
        annual_revenue_inr=0.0,
    )

    assert roi == -100.0


def test_calculate_roi_rejects_zero_project_cost():
    with pytest.raises(
        ValueError,
        match="Total project cost must be positive to calculate ROI",
    ):
        calculate_roi(
            total_project_cost_inr=0.0,
            annual_revenue_inr=10_000_000.0,
        )


def test_calculate_roi_rejects_negative_project_cost():
    with pytest.raises(
        ValueError,
        match="Total project cost must be positive to calculate ROI",
    ):
        calculate_roi(
            total_project_cost_inr=-1.0,
            annual_revenue_inr=10_000_000.0,
        )


def test_calculate_roi_rejects_negative_revenue():
    with pytest.raises(
        ValueError,
        match="Annual revenue cannot be negative",
    ):
        calculate_roi(
            total_project_cost_inr=10_000_000.0,
            annual_revenue_inr=-1.0,
        )

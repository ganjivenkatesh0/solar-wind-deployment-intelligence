"""Financial analysis module for renewable deployment projects."""

from __future__ import annotations
from typing import Union

Number = Union[int, float]


def estimate_annual_revenue(
    annual_energy_yield_mwh: Number,
    electricity_tariff_inr_per_kwh: Number,
) -> float:
    """Estimate annual revenue from renewable energy generation.

    Parameters
    ----------
    annual_energy_yield_mwh : float
        Annual energy yield in MWh/year.
    electricity_tariff_inr_per_kwh : float
        Electricity tariff in INR per kWh.

    Returns
    -------
    float
        Estimated annual revenue in INR.
    """

    if annual_energy_yield_mwh < 0:
        raise ValueError("Annual energy yield cannot be negative.")

    if electricity_tariff_inr_per_kwh < 0:
        raise ValueError("Electricity tariff cannot be negative.")

    annual_revenue = annual_energy_yield_mwh * 1000 * electricity_tariff_inr_per_kwh
    return round(annual_revenue, 2)


def estimate_total_project_cost(
    installed_capacity_mw: Number,
    cost_per_mw_inr: Number,
    additional_installation_percentage: Number = 0.0,
) -> float:
    """Estimate total renewable energy project installation cost.

    Parameters
    ----------
    installed_capacity_mw : float
        Installed capacity in MW.
    cost_per_mw_inr : float
        Cost per MW in INR.
    additional_installation_percentage : float, optional
        Additional installation cost percentage, by default 0.0.

    Returns
    -------
    float
        Estimated total project cost in INR.
    """

    if installed_capacity_mw < 0:
        raise ValueError("Installed capacity cannot be negative.")

    if cost_per_mw_inr < 0:
        raise ValueError("Cost per MW cannot be negative.")

    if additional_installation_percentage < 0:
        raise ValueError("Additional installation percentage cannot be negative.")

    base_cost = installed_capacity_mw * cost_per_mw_inr
    total_cost = base_cost * (1 + additional_installation_percentage / 100)
    return round(total_cost, 2)


def estimate_payback_period(
    total_project_cost_inr: Number,
    annual_revenue_inr: Number,
) -> float:
    """Estimate project payback period in years.

    Parameters
    ----------
    total_project_cost_inr : float
        Total project cost in INR.
    annual_revenue_inr : float
        Annual revenue in INR per year.

    Returns
    -------
    float
        Estimated payback period in years.
    """

    if total_project_cost_inr < 0:
        raise ValueError("Total project cost cannot be negative.")

    if annual_revenue_inr <= 0:
        raise ValueError("Annual revenue must be positive to calculate payback period.")

    payback_period = total_project_cost_inr / annual_revenue_inr
    return round(payback_period, 2)


def calculate_roi(
    total_project_cost_inr: Number,
    annual_revenue_inr: Number,
) -> float:
    """Calculate simple first-year return on investment.

    Parameters
    ----------
    total_project_cost_inr : float
        Total project cost in INR.

    annual_revenue_inr : float
        Annual revenue in INR per year.

    Returns
    -------
    float
        Return on investment as a percentage.
    """

    if total_project_cost_inr <= 0:
        raise ValueError("Total project cost must be positive to calculate ROI.")

    if annual_revenue_inr < 0:
        raise ValueError("Annual revenue cannot be negative.")

    roi = (
        (annual_revenue_inr - total_project_cost_inr)
        / total_project_cost_inr
    ) * 100

    return round(roi, 2)


class FinancialAnalysisService:
    """Placeholder service for financial calculations."""

    def __init__(self) -> None:
        pass

    def estimate_annual_revenue(
        self,
        annual_energy_yield_mwh: Number,
        electricity_tariff_inr_per_kwh: Number,
    ) -> float:
        return estimate_annual_revenue(
            annual_energy_yield_mwh=annual_energy_yield_mwh,
            electricity_tariff_inr_per_kwh=electricity_tariff_inr_per_kwh,
        )

    def estimate_total_project_cost(
        self,
        installed_capacity_mw: Number,
        cost_per_mw_inr: Number,
        additional_installation_percentage: Number = 0.0,
    ) -> float:
        return estimate_total_project_cost(
            installed_capacity_mw=installed_capacity_mw,
            cost_per_mw_inr=cost_per_mw_inr,
            additional_installation_percentage=additional_installation_percentage,
        )

    def estimate_payback_period(
        self,
        total_project_cost_inr: Number,
        annual_revenue_inr: Number,
    ) -> float:
        return estimate_payback_period(
            total_project_cost_inr=total_project_cost_inr,
            annual_revenue_inr=annual_revenue_inr,
        )

    def calculate_roi(
        self,
        total_project_cost_inr: Number,
        annual_revenue_inr: Number,
    ) -> float:
        return calculate_roi(
            total_project_cost_inr=total_project_cost_inr,
            annual_revenue_inr=annual_revenue_inr,
        )

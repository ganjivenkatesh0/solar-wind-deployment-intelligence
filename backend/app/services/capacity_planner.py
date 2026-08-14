class CapacityPlanner:
    """
    Service responsible for estimating the recommended
    installation capacity for a renewable energy site.
    """

    COST_PER_MW_INR = 10_000_000.0
    ADDITIONAL_INSTALLATION_PERCENTAGE = 10.0
    MINIMUM_CAPACITY_MW = 1.0

    @classmethod
    def recommend_capacity(
        cls,
        land_area_hectares: float,
        overall_site_score: float,
        available_budget: float | None = None,
    ) -> float:
        """
        Estimate recommended installation capacity (MW)
        using land area, site suitability, and available budget.
        """

        if land_area_hectares <= 0:
            raise ValueError("Land area must be positive.")

        if overall_site_score < 0:
            raise ValueError("Overall site score cannot be negative.")

        if available_budget is not None and available_budget <= 0:
            raise ValueError("Available budget must be positive.")

        # Base capacity determined by land area
        if land_area_hectares < 10:
            capacity = 10.0

        elif land_area_hectares < 25:
            capacity = 25.0

        elif land_area_hectares < 50:
            capacity = 50.0

        else:
            capacity = 100.0

        # Adjust capacity using site suitability
        if overall_site_score >= 90:
            multiplier = 1.20

        elif overall_site_score >= 80:
            multiplier = 1.10

        elif overall_site_score >= 70:
            multiplier = 1.00

        elif overall_site_score >= 60:
            multiplier = 0.80

        else:
            multiplier = 0.50

        optimized_capacity = capacity * multiplier

        # Apply budget constraint when budget is available.
        if available_budget is not None:
            effective_cost_per_mw = (
                cls.COST_PER_MW_INR
                * (1 + cls.ADDITIONAL_INSTALLATION_PERCENTAGE / 100)
            )

            budget_capacity = available_budget / effective_cost_per_mw

            optimized_capacity = min(
                optimized_capacity,
                budget_capacity,
            )

        # Never recommend zero or negative capacity.
        optimized_capacity = max(
            optimized_capacity,
            cls.MINIMUM_CAPACITY_MW,
        )

        return round(optimized_capacity, 2)

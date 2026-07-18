class WindAssessmentService:
    """
    Service for assessing wind energy potential at a given location.
    """

    def calculate_wind_class(self, wind_speed: float) -> str:
        """
        Classify wind resource based on wind speed (m/s).
        """
        if wind_speed < 3:
            return "Poor"
        elif wind_speed < 5:
            return "Moderate"
        elif wind_speed < 7:
            return "Good"
        else:
            return "Excellent"

    def calculate_capacity_factor(self, wind_speed: float) -> int:
        """
        Estimate wind turbine capacity factor based on wind speed.
        """
        if wind_speed < 3:
            return 15
        elif wind_speed < 5:
            return 30
        elif wind_speed < 7:
            return 45
        else:
            return 60

    def classify_wind_site(self, wind_speed: float) -> dict:
        """
        Generate a complete wind assessment for a site.
        """
        return {
            "wind_speed": wind_speed,
            "classification": self.calculate_wind_class(wind_speed),
            "capacity_factor": self.calculate_capacity_factor(wind_speed),
        }
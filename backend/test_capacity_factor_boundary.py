"""Why this test?

Boundary values are where most logical bugs occur. This test ensures the transition points are handled correctly."""

from app.services.wind_assessment import WindAssessmentService

service = WindAssessmentService()

boundary_cases = [2.9, 3.0, 4.9, 5.0, 6.9, 7.0]

for speed in boundary_cases:
    print(f"{speed} m/s -> {service.calculate_capacity_factor(speed)}%")


"""Output
2.9 m/s -> 15%
3.0 m/s -> 30%
4.9 m/s -> 30%
5.0 m/s -> 45%
6.9 m/s -> 45%
7.0 m/s -> 60%
Purpose

✅ Verify threshold transitions."""
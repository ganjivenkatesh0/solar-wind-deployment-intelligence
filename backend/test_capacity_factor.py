"""
Why this test?

To verify that each wind speed range returns the correct capacity factor.
"""

from app.services.wind_assessment import WindAssessmentService

service = WindAssessmentService()

test_cases = [2.5, 3.5, 5.5, 7.5]

for speed in test_cases:
    print(f"{speed} m/s -> {service.calculate_capacity_factor(speed)}%")

'''   Output 

    2.5 m/s -> 15%
3.5 m/s -> 30%
5.5 m/s -> 45%
7.5 m/s -> 60%  '''

"""Purpose

✅ Verify capacity factor estimation."""
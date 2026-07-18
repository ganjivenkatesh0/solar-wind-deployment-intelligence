""" 
Why this test?

To verify that wind speeds are classified into the correct categories.
"""

from app.services.wind_assessment import WindAssessmentService

service = WindAssessmentService()

test_cases = [2.9, 3.0, 4.5, 5.0, 6.8, 7.0, 8.5]

for speed in test_cases:
    print(f"{speed} m/s -> {service.calculate_wind_class(speed)}")


'''
    2.9 m/s -> Poor
3.0 m/s -> Moderate
4.5 m/s -> Moderate
5.0 m/s -> Good
6.8 m/s -> Good
7.0 m/s -> Excellent
8.5 m/s -> Excellent
'''

"""Purpose

✅ Verify classification logic."""
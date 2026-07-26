"""
Verify NASA POWER integration and feature extraction.
"""

from app.services.solar_service import SolarFeatureService


service = SolarFeatureService()

result = service.get_solar_features(
    latitude=17.3850,
    longitude=78.4867,
)

print(result)

assert "solar_irradiance" in result
assert "temperature" in result
""" 
Why this test?

To verify that:

NASA POWER API is accessible.
Data is fetched successfully.
Required features are extracted correctly.
"""

from app.services.solar_service import SolarService

service = SolarService()

result = service.get_solar_features(
    latitude=17.3850,
    longitude=78.4867
)

print(result)

#output
{
    "solar_irradiance": 4.1518,
    "temperature": 20.4,
    "relative_humidity": 65.44
}

'''
Purpose

✅ Verify external API integration.  '''

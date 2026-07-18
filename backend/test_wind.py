from app.services.wind_assessment import WindAssessmentService

service = WindAssessmentService()

print(service.calculate_wind_class(2.5))
print(service.calculate_wind_class(4.0))
print(service.calculate_wind_class(6.2))
print(service.calculate_wind_class(8.1))

print(service.classify_wind_site(6.2))

'''Command for test run 

python test_wind.py

'''
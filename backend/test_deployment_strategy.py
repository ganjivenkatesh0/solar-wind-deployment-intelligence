"""Why this test?

To verify that different combinations of solar and wind classifications produce the correct deployment recommendation."""


from app.services.deployment_strategy import DeploymentStrategyService

service = DeploymentStrategyService()

tests = [
    ("Excellent", "Excellent"),
    ("Excellent", "Poor"),
    ("Poor", "Excellent"),
    ("Poor", "Poor"),
    ("Good", "Excellent"),
    ("Excellent", "Good"),
]

for solar, wind in tests:
    result = service.recommend_deployment(solar, wind)
    print(f"Solar={solar}, Wind={wind} -> {result}")

"""
Output
Solar=Excellent, Wind=Excellent -> Hybrid
Solar=Excellent, Wind=Poor -> Solar
Solar=Poor, Wind=Excellent -> Wind
Solar=Poor, Wind=Poor -> Not Recommended
Solar=Good, Wind=Excellent -> Hybrid
Solar=Excellent, Wind=Good -> Hybrid
Purpose

✅ Verify deployment recommendation logic."""


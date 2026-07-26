from app.services.solar_service import SolarFeatureService
from app.services.wind_assessment import WindAssessmentService
from app.services.deployment_recommendation_service import (
    DeploymentRecommendationService,
)
from app.services.capacity_planner import CapacityPlanner
from app.services.expansion_analysis import ExpansionAnalysis
from app.services.deployment_plan import DeploymentPlanService

from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.schemas.optimization import OptimizationRequest
from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
)

from app.services.energy.energy_service import estimate_site_energy

from app.services.scoring.category_scoring import (
    renewable_resource_score,
    terrain_score,
    infrastructure_score,
    environmental_score,
    economic_score,
)

from app.services.scoring.scoring_engine import calculate_overall_score


class AnalysisPipelineService:
    """
    Executes the complete renewable energy analysis workflow.
    """

    def __init__(self):
        self.solar_service = SolarFeatureService()
        self.wind_service = WindAssessmentService()
        self.deployment_service = DeploymentRecommendationService()
        self.capacity_planner = CapacityPlanner()
        self.expansion_analysis = ExpansionAnalysis()
        self.deployment_plan = DeploymentPlanService()

    def analyze_site(self, request: AnalysisRequest) -> AnalysisResponse:
        """
        Run the complete renewable energy analysis pipeline.
        """

        # Step 1: Get solar data
        solar_features = self.solar_service.get_solar_features(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        # Temporary values
        wind_speed = 7.5
        slope = 4.0
        grid_distance = 2.0
        road_distance = 1.5

        # Step 2: Wind assessment
        wind_assessment = self.wind_service.classify_wind_site(
            wind_speed
        )

        # Step 3: Renewable Resource Score
        renewable = renewable_resource_score(
            solar_features["solar_irradiance"],
            wind_speed,
        )

        # Step 4: Terrain Score
        terrain = terrain_score(slope)

        # Step 5: Infrastructure Score
        infrastructure = infrastructure_score(
            grid_distance,
            road_distance,
        )

        # Step 6: Environmental & Economic Scores
        environmental = environmental_score(85.0)
        economic = economic_score(80.0)


        # Step 7: Calculate Overall Site Score
        score_result = calculate_overall_score(
            renewable=renewable,
            terrain=terrain,
            infrastructure=infrastructure,
            environmental=environmental,
            economic=economic,
        )

        renewable = score_result["renewable_score"]
        terrain = score_result["terrain_score"]
        infrastructure = score_result["infrastructure_score"]
        environmental = score_result["environmental_score"]
        economic = score_result["economic_score"]
        overall_site_score = score_result["overall_score"]

                # Step 8: Temporary deployment type
        deployment_type = "HYBRID"

            # Temporary installed capacity (MW)
        installed_capacity = 50.0

                # Step 9: Estimate annual energy generation
        energy_estimation = estimate_site_energy(
            deployment_type=deployment_type,
            installed_capacity=installed_capacity,
        )

        # Step 10: Temporary Solar and Wind Scores
        solar_score = renewable
        wind_score = renewable

        recommendation_request = DeploymentRecommendationRequest(
            overall_site_score=overall_site_score,
            solar_score=solar_score,
            wind_score=wind_score,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            estimated_solar_energy=energy_estimation["solar_energy"],
            estimated_wind_energy=energy_estimation["wind_energy"],
        )

        recommendation = (
            self.deployment_service.generate_recommendation(
                recommendation_request
            )
        )

        recommendation = (
    self.deployment_service.generate_recommendation(
        recommendation_request
    )
)

                # Step 11: Calculate recommended installation capacity
        recommended_capacity = self.capacity_planner.recommend_capacity(
            land_area_hectares=request.land_area_hectares,
            overall_site_score=overall_site_score,
        )

                # Step 12: Analyze future expansion potential
        expansion_status = self.expansion_analysis.analyze_expansion(
            land_area_hectares=request.land_area_hectares,
            infrastructure_score=infrastructure,
            overall_site_score=overall_site_score,
        )

                # Step 13: Create optimization request
        optimization_request = OptimizationRequest(
            overall_site_score=overall_site_score,
            solar_score=solar_score,
            wind_score=wind_score,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            estimated_solar_energy=energy_estimation["solar_energy"],
            estimated_wind_energy=energy_estimation["wind_energy"],
            land_area_hectares=request.land_area_hectares,
            available_budget=request.available_budget,
        )

                # Step 14: Generate deployment plan
        deployment_plan = self.deployment_plan.generate_plan(
            optimization_request
        )

                # Step 15: Return complete analysis response
        return AnalysisResponse(
            solar_features=solar_features,
            wind_assessment=wind_assessment,
            renewable_score=renewable,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            environmental_score=environmental,
            economic_score=economic,
            overall_site_score=overall_site_score,
            deployment_plan={
                "recommendation": recommendation.model_dump(),
                "recommended_capacity_mw": recommended_capacity,
                "expansion_status": expansion_status,
                "energy_estimation": energy_estimation,
                "optimization": deployment_plan.model_dump(),
            },
        )

    
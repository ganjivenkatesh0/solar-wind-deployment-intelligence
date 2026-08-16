from app.services.solar_service import SolarFeatureService
from app.services.wind_assessment import WindAssessmentService
from app.data_sources.global_wind_atlas import GlobalWindAtlasClient
from app.data_sources.osm import OSMClient
from app.data_sources.srtm import SRTMClient
from app.services.deployment_recommendation_service import (
    DeploymentRecommendationService,
)
from app.services.capacity_planner import CapacityPlanner
from app.services.expansion_analysis import ExpansionAnalysis
from app.services.deployment_plan import DeploymentPlanService
from app.services.machine_learning.inference import RenewableModelInference
from app.services.machine_learning.contextual_features import (
    MLContextualFeatureService,
)
from app.services.machine_learning.country_resolver import CountryResolver
from app.services.sentinel2_service import Sentinel2Service
from app.services.feasibility.feasibility_engine import FeasibilityEngine

from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.schemas.optimization import OptimizationRequest
from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
)

from app.services.energy.energy_estimation import (
    estimate_hybrid_energy_yield,
    estimate_deployment_energy_yield,
)
from app.services.financial.financial_analysis import (
    estimate_annual_revenue,
    estimate_total_project_cost,
    estimate_annual_opex,
    estimate_net_annual_cash_flow,
    estimate_payback_period,
    calculate_roi,
)

DEFAULT_SOLAR_CAPACITY_FACTOR = 0.22
DEFAULT_SYSTEM_EFFICIENCY = 0.9

DEFAULT_ELECTRICITY_TARIFF_INR_PER_KWH = 7.5
DEFAULT_COST_PER_MW_INR = 10_000_000
DEFAULT_ADDITIONAL_INSTALLATION_PERCENTAGE = 10.0
DEFAULT_ANNUAL_OPEX_PERCENTAGE_OF_CAPEX = 2.0

from app.services.scoring.normalization import (
    normalize_solar,
    normalize_wind,
)

from app.services.scoring.category_scoring import (
    renewable_resource_score,
    project_resource_score,
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
        self.wind_data_source = GlobalWindAtlasClient()
        self.srtm_data_source = SRTMClient()
        self.osm_data_source = OSMClient()
        self.deployment_service = DeploymentRecommendationService()
        self.capacity_planner = CapacityPlanner()
        self.expansion_analysis = ExpansionAnalysis()
        self.deployment_plan = DeploymentPlanService()
        self.ml_inference = RenewableModelInference()
        self.ml_context_service = MLContextualFeatureService()
        self.country_resolver = CountryResolver()
        self.sentinel2_service = Sentinel2Service()
        self.feasibility_engine = FeasibilityEngine()

    def analyze_site(self, request: AnalysisRequest) -> AnalysisResponse:
        """
        Run the complete renewable energy analysis pipeline.
        """

        # Step 1: Get solar data
        solar_features = self.solar_service.get_solar_features(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        # Step 1.1: Machine Learning Solar PVOUT Prediction
        country_iso = self.country_resolver.resolve_iso_code(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        ml_features = self.ml_context_service.get_country_features(
            country_iso
        )

        # Call the inference service and unpack numeric prediction + explanation
        _prediction = self.ml_inference.predict(ml_features)

        if isinstance(_prediction, dict) and "solar_pvout_potential" in _prediction:
            predicted_solar_pvout = float(_prediction["solar_pvout_potential"])
            prediction_explanation = _prediction.get("explanation")
        else:
            predicted_solar_pvout = float(_prediction)
            prediction_explanation = None

        # Step 1.1: Get location-specific wind data from Global Wind Atlas
        wind_data = self.wind_data_source.get_wind_data(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        wind_speed = wind_data["wind_speed"]

        # Location-specific terrain data from SRTM
        terrain_data = self.srtm_data_source.get_terrain_data(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        slope = terrain_data["slope"]

        # Location-specific infrastructure data from OpenStreetMap
        infrastructure_data = self.osm_data_source.get_infrastructure_data(
            {
                "latitude": request.latitude,
                "longitude": request.longitude,
            }
        )

        road_distance = infrastructure_data["road_distance_km"]
        grid_distance = infrastructure_data["grid_distance_km"]

        # Step 1.2: Technical Feasibility Evaluation
        technical_feasibility = self.feasibility_engine.evaluate(
            slope=slope,
            grid_distance=grid_distance,
            road_distance=road_distance,
        )

        # Step 2: Wind assessment
        wind_assessment = self.wind_service.classify_wind_site(
            wind_speed
        )

        # Step 3: Renewable Resource Scores
        #
        # Keep the individual solar and wind resource scores separate.
        # The requested project type determines which resource score
        # contributes to the overall site suitability score.
        # Calculate the individual resource scores directly.
        # Do not inject placeholder values into the combined
        # renewable_resource_score() function.
        solar_resource_score = round(
            normalize_solar(
                solar_features["solar_irradiance"]
            ),
            2,
        )

        wind_resource_score = round(
            normalize_wind(wind_speed),
            2,
        )

        renewable = project_resource_score(
            solar_irradiance=solar_features["solar_irradiance"],
            wind_speed=wind_speed,
            project_type=request.project_type,
        )

        # Step 4: Terrain Score
        terrain = terrain_score(slope)

        # Step 5: Infrastructure Score
        infrastructure = infrastructure_score(
            grid_distance,
            road_distance,
        )

        # Step 6: Environmental Intelligence
        environmental = environmental_score(
            solar_irradiance=solar_features["solar_irradiance"],
            temperature=solar_features["temperature"],
            relative_humidity=solar_features["relative_humidity"],
        )

        # Step 7: Initial Capacity, Energy and Financial Analysis
        #
        # Economic score depends on financial results, while final capacity
        # depends on the overall site score. To avoid a circular dependency,
        # first calculate a provisional capacity using the non-economic
        # resource/site scores, then calculate the final capacity after the
        # first overall suitability score is available.

        provisional_site_score = (
            renewable * 0.40
            + terrain * 0.20
            + infrastructure * 0.20
            + environmental * 0.10
            + 70.0 * 0.10
        )

        installed_capacity = self.capacity_planner.recommend_capacity(
            land_area_hectares=request.land_area_hectares,
            overall_site_score=provisional_site_score,
            available_budget=request.available_budget,
            installation_type=request.installation_type,
        )

        wind_capacity_factor = wind_assessment["capacity_factor"] / 100.0

        energy_estimation = estimate_hybrid_energy_yield(
            installed_capacity=installed_capacity,
            solar_capacity_factor=DEFAULT_SOLAR_CAPACITY_FACTOR,
            wind_capacity_factor=wind_capacity_factor,
            system_efficiency=DEFAULT_SYSTEM_EFFICIENCY,
        )

        # Step 8: Initial Financial Analysis
        annual_revenue = estimate_annual_revenue(
            annual_energy_yield_mwh=energy_estimation["total_energy"],
            electricity_tariff_inr_per_kwh=DEFAULT_ELECTRICITY_TARIFF_INR_PER_KWH,
        )

        estimated_project_cost = estimate_total_project_cost(
            installed_capacity_mw=installed_capacity,
            cost_per_mw_inr=DEFAULT_COST_PER_MW_INR,
            additional_installation_percentage=DEFAULT_ADDITIONAL_INSTALLATION_PERCENTAGE,
        )

        annual_opex = estimate_annual_opex(
            total_project_cost_inr=estimated_project_cost,
            annual_opex_percentage_of_capex=DEFAULT_ANNUAL_OPEX_PERCENTAGE_OF_CAPEX,
        )

        net_annual_cash_flow = estimate_net_annual_cash_flow(
            annual_revenue_inr=annual_revenue,
            annual_opex_inr=annual_opex,
        )

        payback_period = estimate_payback_period(
            total_project_cost_inr=estimated_project_cost,
            annual_revenue_inr=annual_revenue,
            annual_opex_inr=annual_opex,
        )

        roi = calculate_roi(
            total_project_cost_inr=estimated_project_cost,
            annual_revenue_inr=annual_revenue,
            annual_opex_inr=annual_opex,
        )

        economic = economic_score(
            payback_period=payback_period,
            roi=roi,
        )

        financial_analysis = {
            "annual_revenue": annual_revenue,
            "estimated_project_cost": estimated_project_cost,
            "payback_period": payback_period,
            "roi": roi,
        }

        # Step 9: Sentinel-2 Land-Cover Intelligence
        sentinel2_analysis = {
            "status": "not_available",
            "source": "Sentinel-2 / EuroSAT",
            "reason": (
                "The current EuroSAT dataset provides land-cover classes "
                "but does not provide coordinate-specific classification "
                "for the requested analysis location."
            ),
        }

        # Step 10: First Overall Site Score
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

        # Step 11: Deployment Recommendation
        #
        # Recommendation receives the actual individual solar and wind
        # resource scores instead of duplicating the combined score.
        recommendation_request = DeploymentRecommendationRequest(
            overall_site_score=overall_site_score,
            solar_score=solar_resource_score,
            wind_score=wind_resource_score,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            estimated_solar_energy=energy_estimation["solar_energy"],
            estimated_wind_energy=energy_estimation["wind_energy"],
            project_type=request.project_type,
        )

        recommendation = (
            self.deployment_service.generate_recommendation(
                recommendation_request
            )
        )

        # Step 12: Final Recommended Capacity
        recommended_capacity = self.capacity_planner.recommend_capacity(
            land_area_hectares=request.land_area_hectares,
            overall_site_score=overall_site_score,
            available_budget=request.available_budget,
            installation_type=request.installation_type,
        )

        # Step 13: Final Energy and Financial Analysis
        #
        # The final recommended capacity must be the source of truth for
        # energy and financial metrics returned to the frontend. This keeps
        # capacity, generation, revenue and ROI internally consistent.

        energy_deployment_type = recommendation.deployment_type

        # Energy & Financial describes the site's potential.
        # A "Not Recommended" site still gets a potential hybrid
        # energy estimate; the final recommendation remains unchanged.
        if energy_deployment_type == "Not Recommended":
            energy_deployment_type = "Hybrid"

        energy_estimation = estimate_deployment_energy_yield(
            deployment_type=energy_deployment_type,
            installed_capacity=recommended_capacity,
            solar_capacity_factor=DEFAULT_SOLAR_CAPACITY_FACTOR,
            wind_capacity_factor=wind_capacity_factor,
            system_efficiency=DEFAULT_SYSTEM_EFFICIENCY,
        )

        if recommended_capacity <= 0:
            annual_revenue = 0.0
            estimated_project_cost = 0.0
            annual_opex = 0.0
            net_annual_cash_flow = 0.0
            payback_period = 0.0
            roi = 0.0
            economic = 0.0
        else:
            annual_revenue = estimate_annual_revenue(
                annual_energy_yield_mwh=energy_estimation["total_energy"],
                electricity_tariff_inr_per_kwh=DEFAULT_ELECTRICITY_TARIFF_INR_PER_KWH,
            )

            estimated_project_cost = estimate_total_project_cost(
                installed_capacity_mw=recommended_capacity,
                cost_per_mw_inr=DEFAULT_COST_PER_MW_INR,
                additional_installation_percentage=DEFAULT_ADDITIONAL_INSTALLATION_PERCENTAGE,
            )

            annual_opex = estimate_annual_opex(
                total_project_cost_inr=estimated_project_cost,
                annual_opex_percentage_of_capex=DEFAULT_ANNUAL_OPEX_PERCENTAGE_OF_CAPEX,
            )

            net_annual_cash_flow = estimate_net_annual_cash_flow(
                annual_revenue_inr=annual_revenue,
                annual_opex_inr=annual_opex,
            )

            payback_period = estimate_payback_period(
                total_project_cost_inr=estimated_project_cost,
                annual_revenue_inr=annual_revenue,
                annual_opex_inr=annual_opex,
            )

            roi = calculate_roi(
                total_project_cost_inr=estimated_project_cost,
                annual_revenue_inr=annual_revenue,
                annual_opex_inr=annual_opex,
            )

            economic = economic_score(
                payback_period=payback_period,
                roi=roi,
            )

        financial_analysis = {
            "annual_revenue": float(annual_revenue),
            "estimated_project_cost": float(estimated_project_cost),
            "annual_opex": float(annual_opex),
            "net_annual_cash_flow": float(net_annual_cash_flow),
            "payback_period": float(payback_period),
            "roi": float(roi),
        }

        # Keep Step 10 as the source of truth for site suitability.
        # Final energy/financial values describe the recommended deployment
        # and must not recalculate the original suitability score.
        recommendation_request = DeploymentRecommendationRequest(
            overall_site_score=overall_site_score,
            solar_score=solar_resource_score,
            wind_score=wind_resource_score,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            estimated_solar_energy=energy_estimation["solar_energy"],
            estimated_wind_energy=energy_estimation["wind_energy"],
            project_type=request.project_type,
        )

        recommendation = (
            self.deployment_service.generate_recommendation(
                recommendation_request
            )
        )

        # Step 14: Analyze future expansion potential
        expansion_status = self.expansion_analysis.analyze_expansion(
            land_area_hectares=request.land_area_hectares,
            infrastructure_score=infrastructure,
            overall_site_score=overall_site_score,
        )

        # Step 15: Create optimization request
        optimization_request = OptimizationRequest(
            overall_site_score=overall_site_score,
            solar_score=solar_resource_score,
            wind_score=wind_resource_score,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            estimated_solar_energy=energy_estimation["solar_energy"],
            estimated_wind_energy=energy_estimation["wind_energy"],
            land_area_hectares=request.land_area_hectares,
            available_budget=request.available_budget,
            project_type=request.project_type,
            installation_type=request.installation_type,
        )

        # Step 16: Generate deployment plan
        deployment_plan = self.deployment_plan.generate_plan(
            optimization_request
        )

        # Step 17: Return complete analysis response
        return AnalysisResponse(
            solar_features=solar_features,
            ml_prediction={
                "solar_pvout_potential": predicted_solar_pvout,
                "explanation": prediction_explanation,
            },
            wind_assessment=wind_assessment,
            renewable_score=renewable,
            terrain_score=terrain,
            infrastructure_score=infrastructure,
            environmental_score=environmental,
            economic_score=economic,
            overall_site_score=overall_site_score,
            technical_feasibility=technical_feasibility,

            site_suitability=overall_site_score,
            recommended_deployment=recommendation.deployment_type,
            energy_yield=energy_estimation,
            financial_metrics=financial_analysis,
            recommendation_reason=recommendation.reason,
            recommendation=recommendation,

            deployment_plan={
                "recommendation": recommendation.model_dump(),
                "recommended_capacity_mw": recommended_capacity,
                "expansion_status": expansion_status,
                "energy_estimation": energy_estimation,
                "financial_analysis": financial_analysis,
                "optimization": deployment_plan.model_dump(),
            },
            sentinel2=sentinel2_analysis,
        )

    
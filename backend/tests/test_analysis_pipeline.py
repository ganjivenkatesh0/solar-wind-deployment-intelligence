from app.schemas.analysis import AnalysisRequest
from app.services import analysis_pipeline as pipeline_module
from app.services.analysis_pipeline import AnalysisPipelineService
from app.services.machine_learning.inference import RenewableModelInference


def test_analysis_pipeline():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    service = AnalysisPipelineService()

    assert isinstance(service.ml_inference, RenewableModelInference)

    result = service.analyze_site(request)

    assert isinstance(result.ml_prediction, dict)
    assert "solar_pvout_potential" in result.ml_prediction
    assert isinstance(result.ml_prediction["solar_pvout_potential"], float)
    assert isinstance(result.solar_features, dict)
    assert isinstance(result.wind_assessment, dict)
    assert isinstance(result.renewable_score, float)
    assert isinstance(result.terrain_score, float)
    assert isinstance(result.infrastructure_score, float)
    assert isinstance(result.overall_site_score, float)
    assert isinstance(result.deployment_plan, dict)
    assert hasattr(result.technical_feasibility, "is_feasible")
    assert isinstance(result.deployment_plan["energy_estimation"], dict)
    assert isinstance(result.deployment_plan["energy_estimation"]["solar_energy"], float)
    assert isinstance(result.deployment_plan["energy_estimation"]["wind_energy"], float)
    assert isinstance(result.deployment_plan["energy_estimation"]["total_energy"], float)
    assert result.deployment_plan["energy_estimation"]["solar_energy"] >= 0.0
    assert result.deployment_plan["energy_estimation"]["wind_energy"] >= 0.0
    assert result.deployment_plan["energy_estimation"]["total_energy"] >= 0.0
    assert result.deployment_plan["energy_estimation"]["deployment_type"] == "HYBRID"


def test_analysis_pipeline_feasibility_occurs_before_energy_estimation(monkeypatch):
    order = []

    def mock_evaluate(self, *args, **kwargs):
        order.append("feasibility")
        return {
            "is_feasible": True,
            "feasibility_score": 100.0,
            "decision": "Feasible",
            "hard_constraints": {
                "passed": True,
                "constraints": {},
                "failed_constraints": [],
            },
            "soft_constraints": {
                "score": 100.0,
                "constraints": {},
            },
            "constraint_summary": "",
        }

    def mock_estimate_hybrid_energy_yield(
        installed_capacity,
        solar_capacity_factor,
        wind_capacity_factor,
        system_efficiency,
    ):
        order.append("energy")
        assert system_efficiency == pipeline_module.DEFAULT_SYSTEM_EFFICIENCY
        return {
            "solar_energy": 1.0,
            "wind_energy": 2.0,
            "total_energy": 3.0,
        }

    monkeypatch.setattr(pipeline_module.FeasibilityEngine, "evaluate", mock_evaluate)
    monkeypatch.setattr(
        pipeline_module,
        "estimate_hybrid_energy_yield",
        mock_estimate_hybrid_energy_yield,
    )

    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    service = AnalysisPipelineService()
    result = service.analyze_site(request)

    assert order == ["feasibility", "energy"]
    assert result.deployment_plan["energy_estimation"]["total_energy"] == 3.0
    assert result.technical_feasibility.is_feasible is True


if __name__ == "__main__":
    test_analysis_pipeline()



def test_analysis_pipeline_includes_financial_analysis():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    service = AnalysisPipelineService()
    result = service.analyze_site(request)

    financial = result.deployment_plan["financial_analysis"]

    assert isinstance(financial, dict)

    assert "annual_revenue" in financial
    assert "estimated_project_cost" in financial
    assert "payback_period" in financial
    assert "roi" in financial

    assert isinstance(financial["annual_revenue"], float)
    assert isinstance(financial["estimated_project_cost"], float)
    assert isinstance(financial["payback_period"], float)
    assert isinstance(financial["roi"], float)

    assert financial["annual_revenue"] >= 0.0
    assert financial["estimated_project_cost"] > 0.0
    assert financial["payback_period"] >= 0.0

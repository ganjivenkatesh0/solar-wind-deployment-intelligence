import pytest

from app.services.machine_learning.contextual_features import (
    MLContextualFeatureService,
)
from app.services.machine_learning.country_resolver import CountryResolver


def test_country_resolver_returns_india_iso():
    resolver = CountryResolver()

    assert resolver.resolve_iso_code(
        17.3850,
        78.4867,
    ) == "IND"


def test_country_resolver_rejects_invalid_coordinates():
    resolver = CountryResolver()

    with pytest.raises(ValueError):
        resolver.resolve_iso_code(91.0, 78.4867)

    with pytest.raises(ValueError):
        resolver.resolve_iso_code(17.3850, 181.0)


def test_contextual_features_returns_latest_india_record():
    service = MLContextualFeatureService()

    features = service.get_country_features("IND")

    assert features["Year"] == 2023
    assert features["renewables_share_elec"] == pytest.approx(19.514)
    assert features["Governance_Score"] == pytest.approx(67.78518518518518)
    assert features["Offshore_Wind_Potential_GW"] == pytest.approx(
        173.57460211
    )
    assert features["Hydro_Surface_Water_10^9_m3"] == pytest.approx(
        1868.9
    )


def test_contextual_features_rejects_unknown_country():
    service = MLContextualFeatureService()

    with pytest.raises(ValueError):
        service.get_country_features("XXX")

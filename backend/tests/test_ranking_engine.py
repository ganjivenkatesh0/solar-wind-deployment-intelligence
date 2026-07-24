from app.services.scoring.ranking_engine import rank_candidate_sites


def test_rank_candidate_sites_orders_by_overall_score():
    sites = [
        {"site_name": "Site A", "overall_score": 86.4},
        {"site_name": "Site B", "overall_score": 91.2},
        {"site_name": "Site C", "overall_score": 78.5},
    ]

    ranked = rank_candidate_sites(sites)

    assert ranked[0]["site_name"] == "Site B"
    assert ranked[0]["rank"] == 1
    assert ranked[1]["site_name"] == "Site A"
    assert ranked[1]["rank"] == 2
    assert ranked[2]["site_name"] == "Site C"
    assert ranked[2]["rank"] == 3

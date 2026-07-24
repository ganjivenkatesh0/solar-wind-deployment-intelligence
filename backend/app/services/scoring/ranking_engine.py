"""Ranking utilities for candidate renewable energy sites."""

from typing import Dict, List


def rank_candidate_sites(site_results: List[Dict]) -> List[Dict]:
    """Rank candidate sites by overall suitability score in descending order."""
    ranked_sites = sorted(
        site_results,
        key=lambda site: site["overall_score"],
        reverse=True,
    )

    for rank, site in enumerate(ranked_sites, start=1):
        site["rank"] = rank

    return ranked_sites

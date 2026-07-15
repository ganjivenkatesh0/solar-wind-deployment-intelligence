"""Data sources package for external dataset access."""

from .nasa_power import NASAPowerClient
from .global_wind_atlas import GlobalWindAtlasClient
from .srtm import SRTMClient
from .osm import OSMClient

__all__ = [
    "NASAPowerClient",
    "GlobalWindAtlasClient",
    "SRTMClient",
    "OSMClient",
]

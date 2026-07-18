"""Data sources package for external dataset access."""

from .nasa_power import NasaPowerClient
from .global_wind_atlas import GlobalWindAtlasClient
from .srtm import SRTMClient
from .osm import OSMClient

__all__ = [
    "NasaPowerClient",
    "GlobalWindAtlasClient",
    "SRTMClient",
    "OSMClient",
]

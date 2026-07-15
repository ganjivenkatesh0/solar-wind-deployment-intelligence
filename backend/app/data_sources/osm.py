"""OpenStreetMap (OSM) data source client."""


class OSMClient:
    """Client for retrieving infrastructure data from OpenStreetMap."""

    def get_infrastructure_data(self, bounding_box):
        """
        Retrieve nearby infrastructure.

        Args:
            bounding_box: Geographic bounding box for query region

        Returns:
            Infrastructure data containing roads, power lines, cities, and other features

        Raises:
            ValueError: If bounding box is invalid
            ConnectionError: If unable to connect to OpenStreetMap API
            RuntimeError: If infrastructure data retrieval fails
        """
        raise NotImplementedError

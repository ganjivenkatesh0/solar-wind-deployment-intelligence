# Solar & Wind Deployment Intelligence Platform – Project Architecture

```
                                      +----------------------+ 
                                      |        User          |
                                      +----------+-----------+
                                                 |
                                                 | Login / Request
                                                 v
                                +----------------+----------------+
                                |        Frontend (React)         |
                                |  Dashboard • Maps • Charts      |
                                +----------------+----------------+
                                                 |
                                                 | REST API Request
                                                 v
                             +-------------------+-------------------+
                             |        FastAPI Backend (API)          |
                             +-------------------+-------------------+
                                                 |
              +------------------+---------------+---------------+------------------+
              |                  |                               |                  |
              |                  |                               |                  |
              v                  v                               v                  v
      +---------------+  +----------------+          +----------------+   +----------------+
      | Authentication|  | Prediction API |          | Report Service |   | Admin Services |
      +-------+-------+  +--------+-------+          +--------+-------+   +--------+-------+
              |                   |                           |                     |
              |                   |                           |                     |
              +-------------------+---------------------------+---------------------+
                                                  |
                                                  v
                                   +--------------+--------------+
                                   |      Business Logic          |
                                   |  Solar • Wind • Site Score  |
                                   +--------------+--------------+
                                                  |
                     +----------------------------+----------------------------+
                     |                             |                            |
                     |                             |                            |
                     v                             v                            v
          +--------------------+      +----------------------+      +----------------------+
          | Solar Prediction   |      | Wind Prediction      |      | Site Suitability     |
          | Engine             |      | Engine               |      | Engine               |
          +---------+----------+      +----------+-----------+      +----------+-----------+
                    |                            |                             |
                    +-------------+--------------+-------------+---------------+
                                  |                            |
                                  v                            v
                    +------------------------------------------------------+
                    |               Renewable Energy Datasets              |
                    +------------------------------------------------------+
                    | • NASA POWER                                        |
                    | • Global Wind Atlas                                 |
                    | • Sentinel-2                                        |
                    | • OpenStreetMap (OSM)                               |
                    | • SRTM Elevation Data                               |
                    +----------------------+-------------------------------+
                                           |
                                           |
                                           v
                               +-----------+-----------+
                               |   PostgreSQL Database |
                               +-----------+-----------+
                                           |
                                           |
                                           v
                         +-----------------+------------------+
                         | Dashboard & Visualization Layer    |
                         |                                    |
                         | • Interactive Maps                 |
                         | • Solar Prediction                 |
                         | • Wind Prediction                  |
                         | • Site Suitability Score           |
                         | • Graphs                           |
                         | • Reports (PDF / Excel)            |
                         +------------------------------------+
```

---

# Architecture Flow

```
User
   │
   ▼
Frontend (React)
   │
   ▼
FastAPI APIs
   │
   ▼
Authentication
   │
   ▼
Business Logic
   │
   ├────────► Solar Prediction
   │
   ├────────► Wind Prediction
   │
   └────────► Site Suitability
                    │
                    ▼
 Renewable Energy Datasets
                    │
                    ▼
 PostgreSQL Database
                    │
                    ▼
 Dashboard & Reports
                    │
                    ▼
 User
```

---

# Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | FastAPI |
| Database | PostgreSQL |
| AI/ML | Python, Scikit-learn (later), Pandas, NumPy |
| APIs | REST APIs |
| Authentication | JWT Authentication |
| Maps | OpenStreetMap / Leaflet (later) |
| Reports | PDF & Excel |
| Version Control | Git & GitHub |

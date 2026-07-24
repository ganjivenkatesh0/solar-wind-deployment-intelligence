Infosys Virtual Internship – Day 15

Project: Solar & Wind Deployment Intelligence Platform
Date: 20 July 2026
Version: v0.3.0 – Scoring & Ranking Engine

Objective

The objective of Day 15 was to build a complete Site Suitability Scoring Engine capable of evaluating renewable energy sites using multiple parameters. The implementation focused on converting raw feature values into standardized scores, calculating category-wise scores, generating an overall suitability score, ranking candidate sites, and validating the complete scoring pipeline through automated testing.

Tasks Completed
1. Implemented Score Normalization

Developed reusable normalization functions to convert parameters with different measurement units into a common 0–100 scoring scale.

Normalized parameters:

Solar Irradiance
Wind Speed
Terrain Slope
Distance to Electrical Grid
Distance to Road Network

This ensured fair comparison between different site characteristics.

2. Implemented Category-wise Scoring

Created independent scoring functions for each evaluation category:

Renewable Resource Score
Terrain Score
Infrastructure Score
Environmental Score
Economic Score

This modular approach improves maintainability and provides better explainability of the evaluation process.

3. Implemented Overall Site Suitability Score

Developed a weighted scoring engine that combines all category scores into a single Overall Site Suitability Score.

Default weight distribution:

Category	Weight
Renewable Resources	40%
Terrain	20%
Infrastructure	20%
Environmental	10%
Economic	10%

The engine returns both the individual category scores and the final weighted score.

4. Implemented Candidate Site Ranking

Developed a ranking engine capable of:

Evaluating multiple candidate sites
Ranking sites by Overall Suitability Score
Automatically identifying the highest-ranked location
Supporting scalable evaluation for multiple deployment sites
5. Implemented Scoring Engine Validation

Created automated end-to-end validation tests covering:

Score normalization
Category-wise scoring
Overall score calculation
Candidate site ranking
Consistency checks
End-to-end pipeline validation
Files Created / Updated
backend/
├── app/
│   └── services/
│       └── scoring/
│           ├── normalization.py
│           ├── category_scoring.py
│           ├── scoring_engine.py
│           └── ranking_engine.py
│
└── tests/
    ├── test_normalization.py
    ├── test_category_scoring.py
    ├── test_scoring_engine.py
    └── test_ranking_engine.py
Testing Performed

Executed the complete validation suite using pytest.

Command

pytest -q tests/test_scoring_engine.py \
tests/test_normalization.py \
tests/test_category_scoring.py \
tests/test_ranking_engine.py

Result

18 passed in 0.09s

All validation tests passed successfully.

Skills Learned
Data normalization techniques
Weighted scoring models
Multi-criteria decision analysis (MCDA)
Modular scoring system design
Candidate ranking algorithms
Automated testing with Pytest
End-to-end validation strategies
Renewable energy site suitability analysis
Day 15 Outcome

Successfully implemented and validated a complete Scoring & Ranking Engine that can evaluate, compare, and rank renewable energy sites using configurable scoring logic and automated testing.
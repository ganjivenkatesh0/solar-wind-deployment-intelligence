# Day 27 — Energy Yield Estimation

Date: 5 August 2026

## Objective

Implement annual renewable energy yield estimation and integrate it into the existing analysis pipeline after technical feasibility validation.

## Task 1 — Energy Yield Service Design

The project already uses `backend/app/services/energy/energy_estimation.py` for energy calculations. Day 27 extends this existing module rather than creating unnecessary new modules.

The design keeps energy calculations modular with independent functions for solar, wind, and hybrid estimation.

## Task 2 — Separate Estimation Functions

Day 27 introduces the actual functions:

- `estimate_solar_energy_yield()`
- `estimate_wind_energy_yield()`
- `estimate_hybrid_energy_yield()`

These functions return annual energy generation in MWh/year.

## Task 3 — Capacity Factor and System Efficiency

The implemented formula is:

Annual Energy (MWh/year)
= Installed Capacity (MW) × Capacity Factor × 8760 × System Efficiency

The implementation includes:

- installed capacity
- capacity factor
- system efficiency
- efficiency validation between 0 and 1
- capacity and capacity factor validation inherited from the existing estimation functions

The default pipeline efficiency is `0.90`.

## Task 4 — Analysis Pipeline Integration

The analysis pipeline now performs:

Technical Feasibility
→ Energy Yield Estimation
→ Recommendation / Optimization
→ Final Response

The pipeline uses:

- solar capacity factor: `0.22`
- wind capacity factor from `WindAssessmentService`
- system efficiency: `0.90`
- installed capacity: `50 MW`

The previous energy estimation call was replaced with `estimate_hybrid_energy_yield()`.

## Task 5 — Scenario Validation

The following relationships were verified:

- higher solar capacity factor → higher solar energy
- higher wind speed → higher wind capacity factor → higher wind energy
- higher capacity factor → higher energy yield
- higher system efficiency → higher energy yield
- hybrid total = solar energy + wind energy
- invalid capacity, capacity factor, and efficiency values are rejected

Verified numerical examples:

Solar:
100 MW, CF 0.25, efficiency 0.90 = 197100 MWh/year

Wind:
100 MW, CF 0.40, efficiency 0.90 = 315360 MWh/year

Hybrid:
100 MW, solar CF 0.25, wind CF 0.40, efficiency 0.90 = 512460 MWh/year

Wind speed examples:
2.5 m/s → CF 0.15 → 118260 MWh/year
4.0 m/s → CF 0.30 → 236520 MWh/year
8.0 m/s → CF 0.60 → 473040 MWh/year

## Solar Irradiance Limitation

Solar irradiance is available in the application, but the Day-27 yield calculation currently consumes solar capacity factor rather than directly converting irradiance into annual energy.

The current implementation intentionally uses the existing capacity-factor model and avoids introducing an unsupported engineering formula.

## Testing

Energy yield tests: 23 passed
Analysis pipeline tests: 2 passed
Full backend tests: 87 passed

Existing legacy energy tests continue to pass.

## Files Changed

Production:
- `backend/app/services/energy/energy_estimation.py`
- `backend/app/services/analysis_pipeline.py`

Tests:
- `backend/tests/test_energy_estimation.py`
- `backend/tests/test_analysis_pipeline.py`

Documentation:
- `docs/weekly_notes/Day-27.md`

## Final Status

Day 27 Tasks 1–5 completed and validated.

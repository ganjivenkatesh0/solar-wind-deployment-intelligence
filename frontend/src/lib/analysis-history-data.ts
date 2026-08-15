/**
 * Analysis History presentation data layer.
 *
 * All rows are local mock data shaped like the future analysis-list API
 * response, so Task 12 can swap this module for a real fetch without
 * touching any JSX.
 */

export type AnalysisTechnology = "Solar" | "Wind" | "Hybrid";
export type AnalysisStatus = "Completed" | "Failed" | "Running";

export type AnalysisRecord = {
  id: string;
  location: string;
  coordinatesLabel: string;
  dateLabel: string;
  timeLabel: string;
  score: number;
  technology: AnalysisTechnology;
  capacityLabel: string;
  status: AnalysisStatus;
  notes?: string;
  details: {
    landAreaLabel: string;
    budgetLabel: string;
    projectType: string;
    minFeasibilityLabel: string;
    riskTolerance: string;
  };
  radar: { dimension: string; score: number }[];
};

export type AnalysisHistorySummary = {
  label: string;
  value: string;
  suffix?: string;
  caption: string;
  icon: "history" | "check" | "star" | "chart";
  tone: "primary" | "info" | "solar" | "hybrid";
};

function radar(values: [number, number, number, number, number, number]) {
  const dims = [
    "Solar Resource",
    "Wind Resource",
    "Terrain & Topography",
    "Infrastructure",
    "Economic",
    "Technical Feasibility",
  ];
  return dims.map((dimension, i) => ({ dimension, score: values[i]! }));
}

export const analysisHistorySummary: AnalysisHistorySummary[] = [
  { label: "Total Analyses", value: "18", caption: "All time analyses", icon: "history", tone: "primary" },
  { label: "Completed", value: "16", caption: "Successfully completed", icon: "check", tone: "info" },
  { label: "Top Suitability Score", value: "92.4", suffix: "/100", caption: "Best score achieved", icon: "star", tone: "solar" },
  { label: "Avg. Suitability Score", value: "67.8", suffix: "/100", caption: "Average of all analyses", icon: "chart", tone: "hybrid" },
];

export const analysisHistoryDateRange = "Jul 13, 2026 - Aug 13, 2026";

export const analysisHistoryRecords: AnalysisRecord[] = [
  {
    id: "ANL-00018",
    location: "Hyderabad, Telangana, India",
    coordinatesLabel: "17.3850° N, 78.4867° E",
    dateLabel: "Aug 13, 2026",
    timeLabel: "10:45 AM",
    score: 82.6,
    technology: "Solar",
    capacityLabel: "8.0 MW",
    status: "Completed",
    notes: "Flagship utility-scale solar site",
    details: {
      landAreaLabel: "40.0 hectares",
      budgetLabel: "$5,000,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Medium",
    },
    radar: radar([85, 62, 78, 80, 70, 95]),
  },
  {
    id: "ANL-00017",
    location: "Vijayawada, Andhra Pradesh",
    coordinatesLabel: "16.5062° N, 80.6480° E",
    dateLabel: "Aug 12, 2026",
    timeLabel: "04:20 PM",
    score: 71.3,
    technology: "Solar",
    capacityLabel: "6.0 MW",
    status: "Completed",
    notes: "Rooftop + ground mount mix",
    details: {
      landAreaLabel: "28.0 hectares",
      budgetLabel: "$3,600,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Medium",
    },
    radar: radar([80, 55, 72, 76, 68, 88]),
  },
  {
    id: "ANL-00016",
    location: "Anantapur, Andhra Pradesh",
    coordinatesLabel: "14.6819° N, 77.6006° E",
    dateLabel: "Aug 12, 2026",
    timeLabel: "11:05 AM",
    score: 65.2,
    technology: "Wind",
    capacityLabel: "10.0 MW",
    status: "Completed",
    notes: "High wind corridor",
    details: {
      landAreaLabel: "62.0 hectares",
      budgetLabel: "$8,200,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "High",
    },
    radar: radar([68, 84, 66, 70, 62, 80]),
  },
  {
    id: "ANL-00015",
    location: "Kurnool, Andhra Pradesh",
    coordinatesLabel: "15.8281° N, 78.0373° E",
    dateLabel: "Aug 11, 2026",
    timeLabel: "06:30 PM",
    score: 58.7,
    technology: "Hybrid",
    capacityLabel: "7.5 MW",
    status: "Completed",
    notes: "Hybrid feasibility screening",
    details: {
      landAreaLabel: "45.0 hectares",
      budgetLabel: "$6,100,000",
      projectType: "Hybrid Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "Medium",
    },
    radar: radar([72, 70, 60, 64, 58, 76]),
  },
  {
    id: "ANL-00014",
    location: "Guntur, Andhra Pradesh",
    coordinatesLabel: "16.3067° N, 80.4365° E",
    dateLabel: "Aug 11, 2026",
    timeLabel: "02:15 PM",
    score: 74.1,
    technology: "Solar",
    capacityLabel: "7.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "33.0 hectares",
      budgetLabel: "$4,300,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Low",
    },
    radar: radar([82, 58, 74, 78, 70, 86]),
  },
  {
    id: "ANL-00013",
    location: "Nellore, Andhra Pradesh",
    coordinatesLabel: "14.4426° N, 79.9865° E",
    dateLabel: "Aug 10, 2026",
    timeLabel: "10:10 AM",
    score: 61.9,
    technology: "Wind",
    capacityLabel: "9.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "55.0 hectares",
      budgetLabel: "$7,400,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "Medium",
    },
    radar: radar([64, 80, 62, 68, 60, 78]),
  },
  {
    id: "ANL-00012",
    location: "Warangal, Telangana, India",
    coordinatesLabel: "17.9689° N, 79.5941° E",
    dateLabel: "Aug 09, 2026",
    timeLabel: "05:40 PM",
    score: 49.8,
    technology: "Wind",
    capacityLabel: "8.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "48.0 hectares",
      budgetLabel: "$6,800,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "50%",
      riskTolerance: "High",
    },
    radar: radar([58, 72, 52, 56, 48, 70]),
  },
  {
    id: "ANL-00011",
    location: "Kadapa, Andhra Pradesh",
    coordinatesLabel: "14.4673° N, 78.8242° E",
    dateLabel: "Aug 09, 2026",
    timeLabel: "12:35 PM",
    score: 44.2,
    technology: "Wind",
    capacityLabel: "6.0 MW",
    status: "Failed",
    notes: "Wind dataset incomplete",
    details: {
      landAreaLabel: "36.0 hectares",
      budgetLabel: "$5,200,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "50%",
      riskTolerance: "High",
    },
    radar: radar([52, 66, 46, 50, 42, 64]),
  },
  {
    id: "ANL-00010",
    location: "Tirupati, Andhra Pradesh",
    coordinatesLabel: "13.6288° N, 79.4192° E",
    dateLabel: "Aug 08, 2026",
    timeLabel: "09:20 AM",
    score: 78.4,
    technology: "Solar",
    capacityLabel: "9.5 MW",
    status: "Completed",
    details: {
      landAreaLabel: "42.0 hectares",
      budgetLabel: "$5,900,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Low",
    },
    radar: radar([86, 54, 76, 80, 72, 90]),
  },
  {
    id: "ANL-00009",
    location: "Karimnagar, Telangana, India",
    coordinatesLabel: "18.4386° N, 79.1288° E",
    dateLabel: "Aug 07, 2026",
    timeLabel: "03:05 PM",
    score: 92.4,
    technology: "Hybrid",
    capacityLabel: "12.0 MW",
    status: "Completed",
    notes: "Best score achieved to date",
    details: {
      landAreaLabel: "70.0 hectares",
      budgetLabel: "$11,500,000",
      projectType: "Hybrid Project",
      minFeasibilityLabel: "65%",
      riskTolerance: "Medium",
    },
    radar: radar([90, 88, 86, 92, 84, 96]),
  },
  {
    id: "ANL-00008",
    location: "Nizamabad, Telangana, India",
    coordinatesLabel: "18.6725° N, 78.0941° E",
    dateLabel: "Aug 06, 2026",
    timeLabel: "11:45 AM",
    score: 67.5,
    technology: "Solar",
    capacityLabel: "5.5 MW",
    status: "Completed",
    details: {
      landAreaLabel: "26.0 hectares",
      budgetLabel: "$3,200,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Medium",
    },
    radar: radar([78, 56, 68, 72, 64, 82]),
  },
  {
    id: "ANL-00007",
    location: "Khammam, Telangana, India",
    coordinatesLabel: "17.2473° N, 80.1514° E",
    dateLabel: "Aug 05, 2026",
    timeLabel: "05:10 PM",
    score: 55.3,
    technology: "Wind",
    capacityLabel: "7.5 MW",
    status: "Failed",
    notes: "Terrain model timed out",
    details: {
      landAreaLabel: "44.0 hectares",
      budgetLabel: "$6,000,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "High",
    },
    radar: radar([58, 70, 54, 58, 50, 72]),
  },
  {
    id: "ANL-00006",
    location: "Rajahmundry, Andhra Pradesh",
    coordinatesLabel: "17.0005° N, 81.8040° E",
    dateLabel: "Aug 04, 2026",
    timeLabel: "10:30 AM",
    score: 70.8,
    technology: "Solar",
    capacityLabel: "6.5 MW",
    status: "Completed",
    details: {
      landAreaLabel: "31.0 hectares",
      budgetLabel: "$4,000,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Low",
    },
    radar: radar([80, 52, 70, 74, 68, 84]),
  },
  {
    id: "ANL-00005",
    location: "Kakinada, Andhra Pradesh",
    coordinatesLabel: "16.9891° N, 82.2475° E",
    dateLabel: "Aug 03, 2026",
    timeLabel: "02:50 PM",
    score: 63.4,
    technology: "Hybrid",
    capacityLabel: "8.5 MW",
    status: "Completed",
    details: {
      landAreaLabel: "50.0 hectares",
      budgetLabel: "$7,000,000",
      projectType: "Hybrid Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "Medium",
    },
    radar: radar([74, 72, 64, 66, 60, 80]),
  },
  {
    id: "ANL-00004",
    location: "Mahbubnagar, Telangana, India",
    coordinatesLabel: "16.7488° N, 77.9853° E",
    dateLabel: "Aug 02, 2026",
    timeLabel: "09:15 AM",
    score: 76.2,
    technology: "Solar",
    capacityLabel: "10.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "52.0 hectares",
      budgetLabel: "$6,400,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Medium",
    },
    radar: radar([84, 60, 74, 78, 72, 88]),
  },
  {
    id: "ANL-00003",
    location: "Ongole, Andhra Pradesh",
    coordinatesLabel: "15.5057° N, 80.0499° E",
    dateLabel: "Aug 01, 2026",
    timeLabel: "04:35 PM",
    score: 59.6,
    technology: "Wind",
    capacityLabel: "7.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "40.0 hectares",
      budgetLabel: "$5,600,000",
      projectType: "Wind Project",
      minFeasibilityLabel: "55%",
      riskTolerance: "High",
    },
    radar: radar([62, 76, 58, 62, 56, 74]),
  },
  {
    id: "ANL-00002",
    location: "Adilabad, Telangana, India",
    coordinatesLabel: "19.6640° N, 78.5320° E",
    dateLabel: "Jul 31, 2026",
    timeLabel: "11:25 AM",
    score: 68.9,
    technology: "Solar",
    capacityLabel: "5.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "24.0 hectares",
      budgetLabel: "$3,000,000",
      projectType: "Solar Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Low",
    },
    radar: radar([78, 58, 70, 72, 66, 84]),
  },
  {
    id: "ANL-00001",
    location: "Chittoor, Andhra Pradesh",
    coordinatesLabel: "13.2172° N, 79.1003° E",
    dateLabel: "Jul 30, 2026",
    timeLabel: "01:40 PM",
    score: 72.7,
    technology: "Hybrid",
    capacityLabel: "9.0 MW",
    status: "Completed",
    details: {
      landAreaLabel: "58.0 hectares",
      budgetLabel: "$8,000,000",
      projectType: "Hybrid Project",
      minFeasibilityLabel: "60%",
      riskTolerance: "Medium",
    },
    radar: radar([80, 74, 72, 76, 68, 86]),
  },
];

/** Score colour band used by the circular score indicators and badges. */
export function scoreTone(score: number): "success" | "warning" | "error" {
  if (score >= 70) return "success";
  if (score >= 55) return "warning";
  return "error";
}

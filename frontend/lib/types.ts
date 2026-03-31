export type Severity = "Info" | "Low" | "Medium" | "High" | "Critical";

export interface Finding {
  title: string;
  description: string;
  severity: Severity;
  line: number | null;
  recommendation: string | null;
}

export interface StyleReview {
  summary: string;
  findings: Finding[];
}

export interface FunctionalityReview {
  summary: string;
  findings: Finding[];
}

export interface BugReview {
  summary: string;
  findings: Finding[];
}

export interface SecurityReview {
  summary: string;
  findings: Finding[];
}

export interface ConsistencyConflict {
  title: string;
  description: string;
  involved_agents: string[];
  recommendation: string;
}

export interface ConsistencyReview {
  summary: string;
  conflicts: ConsistencyConflict[];
  cross_agent_notes: string[];
}

export interface ReviewResult {
  style: StyleReview;
  functionality: FunctionalityReview;
  bug: BugReview;
  security: SecurityReview;
  consistency: ConsistencyReview;
  timestamp: number;
}

export interface ReviewRequest {
  code: string;
  explanation: string;
  language: string;
}

export interface ErrorResponse {
  error: string;
}

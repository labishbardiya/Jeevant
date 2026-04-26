export type CapabilityValue = "true" | "false" | "partial" | "unknown" | "visiting" | "limited" | "24/7";

export type FacilityCapabilities = {
  icu: CapabilityValue;
  surgery: CapabilityValue;
  oxygen: CapabilityValue;
  anesthesiologist: CapabilityValue;
  availability: CapabilityValue;
};

export type Facility = {
  name: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  trust_score: number;
  final_score: number;
  requirement_coverage: number;
  capabilities: FacilityCapabilities;
  reasoning: string[];
};

export type RejectedOption = {
  name: string;
  city?: string;
  trust_score?: number;
  final_score?: number;
  rejection_reason?: string[];
  reason?: string[];
};

export type QueryMetadata = {
  retrieved?: number;
  pre_filtered_out?: number;
  extracted?: number;
  hard_filtered?: number;
  final_candidates?: number;
  coverage?: number;
  fallback?: string;
  latency_ms?: number;
};

export type QueryRequirements = {
  needs_surgery?: boolean;
  needs_icu?: boolean;
  needs_emergency?: boolean;
  needs_dialysis?: boolean;
};

export type QueryResponse = {
  query: string;
  requirements: QueryRequirements;
  top_facilities: Facility[];
  rejected_options: RejectedOption[];
  metadata: QueryMetadata;
};

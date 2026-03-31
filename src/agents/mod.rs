use serde::{Deserialize, Serialize};

// --- Input ---

#[derive(Debug, Clone)]
pub struct ReviewInput {
    pub code: String,
    pub explanation: String,
    pub language: String,
}

// --- Shared primitives ---

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Severity {
    Info,
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Finding {
    pub title: String,
    pub description: String,
    pub severity: Severity,
    pub line: Option<usize>,
    pub recommendation: Option<String>,
}

// --- Agent output types ---

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct StyleReview {
    pub summary: String,
    pub findings: Vec<Finding>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct FunctionalityReview {
    pub summary: String,
    pub findings: Vec<Finding>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct BugReview {
    pub summary: String,
    pub findings: Vec<Finding>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct SecurityReview {
    pub summary: String,
    pub findings: Vec<Finding>,
}

// --- Consistency agent types ---

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsistencyConflict {
    pub title: String,
    pub description: String,
    pub involved_agents: Vec<String>,
    pub recommendation: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ConsistencyReview {
    pub summary: String,
    pub conflicts: Vec<ConsistencyConflict>,
    pub cross_agent_notes: Vec<String>,
}

// Final aggregated result returned to the API layer.
#[derive(Debug, Serialize)]
pub struct ReviewResult {
    pub style: StyleReview,
    pub functionality: FunctionalityReview,
    pub bug: BugReview,
    pub security: SecurityReview,
    pub consistency: ConsistencyReview,
    pub timestamp: u64,
}

// Input bundle passed to the Consistency agent after the 4 main agents complete.
pub struct AllReviews {
    pub input: ReviewInput,
    pub style: StyleReview,
    pub functionality: FunctionalityReview,
    pub bug: BugReview,
    pub security: SecurityReview,
}

// --- Agent trait (for the 4 main agents) ---

mod claude;
pub mod style;
pub mod functionality;
pub mod bug;
pub mod security;
pub mod consistency;
pub mod orchestrator;

#[async_trait::async_trait]
pub trait Agent {
    type Output;

    fn name(&self) -> &'static str;
    async fn review(&self, input: &ReviewInput) -> Result<Self::Output, String>;
}

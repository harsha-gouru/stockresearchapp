# Task: AI Insights Service (Staged)

Scope:
- Start with OpenAI (prompt-based), later support OSS models via Ollama

Read first:
- Backend/AI_RESEARCH_PROMPTS.md, OpenAIResearch.md
- components/AIAnalysisDetail.tsx, AIInsightsHistory.tsx
- DATA_FLOWS.md (AI flows)

Stage 1 (MVP):
1) Service methods: analyzeStock(symbol), portfolioInsights(userId)
2) Prompt templates using real market data from MarketDataService
3) Routes: GET /api/v1/ai/analysis/:symbol, GET /api/v1/ai/recommendations
4) Persist insights to ai_insights table; list via history endpoint

Stage 2 (Cost control):
1) Add FinBERT for sentiment
2) Add caching of AI outputs
3) Implement truncation/summary of large inputs

Stage 3 (OSS models):
1) Add Ollama client (llama3/mistral); configurable via env
2) Optional fine-tuning plan (collect Q/A pairs, train LoRA)

Acceptance Criteria:
- Deterministic output format (JSON with keys: summary, sentiment, risks, opportunities)
- Inputs constrained and token-count aware
- Errors handled gracefully with fallback messages
- Tests stub models and assert output schema


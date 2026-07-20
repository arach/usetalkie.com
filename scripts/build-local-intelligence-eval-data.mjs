import fs from 'fs'
import path from 'path'
import { localIntelligenceCards } from '../components/blog/local-intelligence-cards-data.js'

const OUTPUT_DIR = path.join(process.cwd(), 'docs/evals/local-intelligence/v1')
const JSONL_PATH = path.join(OUTPUT_DIR, 'hf_local_intelligence_eval_v1.jsonl')
const CSV_PATH = path.join(OUTPUT_DIR, 'hf_local_intelligence_eval_v1.csv')
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'hf_local_intelligence_eval_manifest_v1.json')
const README_PATH = path.join(OUTPUT_DIR, 'README.md')
const MODELS_PATH = path.join(OUTPUT_DIR, 'model-comparison-candidates-2026-04-04.md')
const MODELS_JSON_PATH = path.join(OUTPUT_DIR, 'model-comparison-candidates-2026-04-04.json')

const TIER_ORDER = ['ship-soon', 'local-first', 'big-swings']

const CARD_EVAL_CONFIG = {
  'memo-auto-title': {
    taskType: 'structured-generation',
    outputType: 'json-object',
    primaryMetric: 'pass_rate_rule_checks',
    secondaryMetrics: ['title_specificity_judge', 'latency_ms_p50'],
    requiresJudge: true,
  },
  'memo-type-detection': {
    taskType: 'classification',
    outputType: 'json-object',
    primaryMetric: 'label_accuracy',
    secondaryMetrics: ['confidence_calibration_brier', 'review_recall'],
    requiresJudge: false,
  },
  'action-item-extraction': {
    taskType: 'extraction',
    outputType: 'json-array',
    primaryMetric: 'item_f1',
    secondaryMetrics: ['due_date_accuracy', 'evidence_span_precision'],
    requiresJudge: false,
  },
  'transcript-cleanup-presets': {
    taskType: 'rewrite',
    outputType: 'json-object',
    primaryMetric: 'fact_preservation_rate',
    secondaryMetrics: ['fluency_judge', 'compression_ratio'],
    requiresJudge: true,
  },
  'what-matters-summary': {
    taskType: 'summarization',
    outputType: 'json-array',
    primaryMetric: 'top_k_recall',
    secondaryMetrics: ['priority_rank_correlation', 'evidence_quote_match'],
    requiresJudge: false,
  },
  'calendar-intent-detection': {
    taskType: 'temporal-extraction',
    outputType: 'json-array',
    primaryMetric: 'event_slot_accuracy',
    secondaryMetrics: ['time_resolution_accuracy', 'needs_confirmation_precision'],
    requiresJudge: false,
  },
  'reminder-normalization': {
    taskType: 'normalization',
    outputType: 'json-object',
    primaryMetric: 'imperative_phrase_compliance',
    secondaryMetrics: ['semantic_fidelity_judge', 'followup_question_recall'],
    requiresJudge: true,
  },
  'private-redaction-pass': {
    taskType: 'safety-redaction',
    outputType: 'json-object',
    primaryMetric: 'pii_leak_rate',
    secondaryMetrics: ['entity_detection_f1', 'readability_judge'],
    requiresJudge: false,
  },
  'writing-style-memory': {
    taskType: 'style-transfer',
    outputType: 'json-object',
    primaryMetric: 'style_constraint_pass_rate',
    secondaryMetrics: ['meaning_preservation_judge', 'verbosity_delta'],
    requiresJudge: true,
  },
  'similar-memo-recall': {
    taskType: 'ranking',
    outputType: 'json-array',
    primaryMetric: 'mrr',
    secondaryMetrics: ['ndcg_at_3', 'top1_relevance'],
    requiresJudge: false,
  },
  'project-clustering': {
    taskType: 'clustering',
    outputType: 'json-array',
    primaryMetric: 'cluster_pair_f1',
    secondaryMetrics: ['v_measure', 'misc_bucket_rate'],
    requiresJudge: false,
  },
  'next-step-suggestion-engine': {
    taskType: 'recommendation',
    outputType: 'json-object',
    primaryMetric: 'action_selection_accuracy',
    secondaryMetrics: ['reason_grounding_judge', 'time_to_unblock_proxy'],
    requiresJudge: true,
  },
  'follow-up-question-generator': {
    taskType: 'question-generation',
    outputType: 'json-array',
    primaryMetric: 'question_utility_judge',
    secondaryMetrics: ['question_count_compliance', 'ambiguity_resolution_rate'],
    requiresJudge: true,
  },
  'hybrid-model-router': {
    taskType: 'routing',
    outputType: 'json-object',
    primaryMetric: 'route_accuracy',
    secondaryMetrics: ['privacy_constraint_violations', 'cost_estimate_delta'],
    requiresJudge: false,
  },
  'context-packet-builder': {
    taskType: 'context-selection',
    outputType: 'json-object',
    primaryMetric: 'token_budget_compliance',
    secondaryMetrics: ['relevance_recall', 'noise_ratio'],
    requiresJudge: false,
  },
  'conversation-to-checklist': {
    taskType: 'structuring',
    outputType: 'json-array',
    primaryMetric: 'order_accuracy',
    secondaryMetrics: ['dependency_correctness', 'owner_fill_rate'],
    requiresJudge: false,
  },
  'personal-knowledge-graph': {
    taskType: 'graph-extraction',
    outputType: 'json-object',
    primaryMetric: 'node_edge_f1',
    secondaryMetrics: ['entity_merge_accuracy', 'edge_type_accuracy'],
    requiresJudge: false,
  },
  'catch-me-up-daily-brief': {
    taskType: 'narrative-summary',
    outputType: 'json-object',
    primaryMetric: 'section_coverage_rate',
    secondaryMetrics: ['factuality_judge', 'bullet_budget_compliance'],
    requiresJudge: true,
  },
  'contradiction-drift-detection': {
    taskType: 'contradiction-detection',
    outputType: 'json-array',
    primaryMetric: 'conflict_detection_f1',
    secondaryMetrics: ['severity_accuracy', 'false_positive_rate'],
    requiresJudge: false,
  },
  'momentum-scoring': {
    taskType: 'scoring',
    outputType: 'json-object',
    primaryMetric: 'score_mae',
    secondaryMetrics: ['hotspot_recall', 'trend_accuracy'],
    requiresJudge: false,
  },
  'local-agent-loop': {
    taskType: 'pipeline-orchestration',
    outputType: 'json-object',
    primaryMetric: 'step_completion_accuracy',
    secondaryMetrics: ['final_status_accuracy', 'verification_gate_recall'],
    requiresJudge: false,
  },
  'meeting-live-structure': {
    taskType: 'incremental-state-update',
    outputType: 'json-object',
    primaryMetric: 'state_update_accuracy',
    secondaryMetrics: ['duplicate_suppression_rate', 'chunk_tag_correctness'],
    requiresJudge: false,
  },
  'intent-trend-alerts': {
    taskType: 'alerting',
    outputType: 'json-array',
    primaryMetric: 'alert_precision',
    secondaryMetrics: ['alert_recall', 'intervention_quality_judge'],
    requiresJudge: true,
  },
  'voice-os-command-layer': {
    taskType: 'command-planning',
    outputType: 'json-object',
    primaryMetric: 'plan_validity_rate',
    secondaryMetrics: ['safety_confirmation_recall', 'step_execution_match'],
    requiresJudge: false,
  },
}

const MODEL_CANDIDATES = [
  {
    model_id: 'apple-foundation-models',
    display_name: 'Apple Foundation Models (on-device)',
    provider: 'Apple',
    class: 'system-on-device',
    params: '~3B on-device model',
    context_window: 'Framework-managed',
    license: 'Apple platform terms',
    strengths: ['On-device privacy', 'Offline availability', 'No per-token inference cost'],
    source_urls: [
      'https://developer.apple.com/documentation/FoundationModels?language=objc',
      'https://www.apple.com/cm/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/',
      'https://machinelearning.apple.com/research/introducing-apple-foundation-models',
    ],
  },
  {
    model_id: 'microsoft/Phi-4-mini-instruct',
    display_name: 'Phi-4-mini-instruct',
    provider: 'Microsoft',
    class: 'small-open',
    params: '3.8B',
    context_window: '128K',
    license: 'MIT',
    strengths: ['Strong small-model reasoning', 'Long context for size', 'Permissive license'],
    source_urls: [
      'https://huggingface.co/microsoft/Phi-4-mini-instruct',
    ],
  },
  {
    model_id: 'meta-llama/Llama-3.2-3B-Instruct',
    display_name: 'Llama-3.2-3B-Instruct',
    provider: 'Meta',
    class: 'small-open',
    params: '3B class',
    context_window: 'Check model card (license-gated)',
    license: 'Llama 3.2 Community License',
    strengths: ['Wide ecosystem support', 'Small footprint options', 'Strong baseline for instruction tuning'],
    source_urls: [
      'https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct',
    ],
  },
  {
    model_id: 'Qwen/Qwen2.5-3B-Instruct',
    display_name: 'Qwen2.5-3B-Instruct',
    provider: 'Qwen',
    class: 'small-open',
    params: '3.09B',
    context_window: '32,768 (128K support in family)',
    license: 'qwen-research',
    strengths: ['Good structured output behavior', 'Strong multilingual support', 'Fast local inference'],
    source_urls: [
      'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct',
    ],
  },
  {
    model_id: 'google/gemma-3-4b-it',
    display_name: 'Gemma-3-4B-IT',
    provider: 'Google',
    class: 'small-open',
    params: '4B class',
    context_window: '128K input for 4B size',
    license: 'Gemma license',
    strengths: ['Strong quality for size', 'Large context for small model', 'Good multilingual coverage'],
    source_urls: [
      'https://huggingface.co/google/gemma-3-4b-it',
    ],
  },
  {
    model_id: 'Qwen/Qwen3-8B-AWQ',
    display_name: 'Qwen3-8B-AWQ',
    provider: 'Qwen',
    class: 'mid-open',
    params: '8.2B',
    context_window: '32,768 native; 131,072 with YaRN',
    license: 'Apache-2.0',
    strengths: ['Stronger reasoning than 3B class', 'AWQ quantized for local use', 'Good agentic behavior'],
    source_urls: [
      'https://huggingface.co/Qwen/Qwen3-8B-AWQ',
    ],
  },
  {
    model_id: 'mistralai/Mistral-Small-3.1-24B-Instruct-2503',
    display_name: 'Mistral-Small-3.1-24B-Instruct-2503',
    provider: 'Mistral AI',
    class: 'large-open',
    params: '24B',
    context_window: '128K',
    license: 'Apache-2.0',
    strengths: ['High open-weight quality ceiling', 'Native JSON/function-calling support', 'Strong long-context behavior'],
    source_urls: [
      'https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503',
    ],
  },
]

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function toJson(value) {
  return JSON.stringify(value, null, 2)
}

function csvEscape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replaceAll('"', '""') + '"'
  }
  return str
}

function deriveTaskFamily(cardId) {
  return cardId.replaceAll('-', '_')
}

function getTemplateValue(input, key) {
  if (key in input) return input[key]

  if (key === 'requestMetadata') return input
  if (key === 'request_metadata') return input

  return undefined
}

function fillTemplate(template, input) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, rawKey) => {
    const key = rawKey.trim()
    const value = getTemplateValue(input, key)

    if (value === undefined) {
      return `{{${key}}}`
    }

    if (typeof value === 'string') return value
    return JSON.stringify(value, null, 2)
  })
}

function buildMessages(card) {
  const renderedUserPrompt = fillTemplate(card.prompt.user, card.inputExample)

  return {
    renderedUserPrompt,
    messages: [
      { role: 'system', content: card.prompt.system },
      { role: 'user', content: renderedUserPrompt },
    ],
  }
}

function buildRows(cards) {
  return cards.map((card, index) => {
    const cfg = CARD_EVAL_CONFIG[card.id] ?? {
      taskType: 'structured-generation',
      outputType: 'json-object',
      primaryMetric: 'pass_rate_rule_checks',
      secondaryMetrics: [],
      requiresJudge: false,
    }

    const { renderedUserPrompt, messages } = buildMessages(card)

    return {
      row_id: `${String(index + 1).padStart(2, '0')}__${card.id}__base_v1`,
      card_id: card.id,
      title: card.title,
      tier: card.tier,
      tier_rank: TIER_ORDER.indexOf(card.tier) + 1,
      task_family: deriveTaskFamily(card.id),
      task_type: cfg.taskType,
      output_type: cfg.outputType,
      prompt: {
        task: card.prompt.task,
        system: card.prompt.system,
        user_template: card.prompt.user,
        user_rendered: renderedUserPrompt,
      },
      input_example: card.inputExample,
      expected_output: card.expectedOutput,
      assertions: card.testCase.assertions,
      test_case: card.testCase,
      scoring: {
        primary_metric: cfg.primaryMetric,
        secondary_metrics: cfg.secondaryMetrics,
        requires_judge: cfg.requiresJudge,
      },
      hf_chat: {
        messages,
        response_format: 'json',
      },
      metadata: {
        source: 'components/blog/local-intelligence-cards-data.js',
        split: 'eval',
        version: 'v1',
      },
    }
  })
}

function writeJsonl(rows, filePath) {
  const content = rows.map(row => JSON.stringify(row)).join('\n') + '\n'
  fs.writeFileSync(filePath, content, 'utf8')
}

function writeCsv(rows, filePath) {
  const headers = [
    'row_id',
    'card_id',
    'title',
    'tier',
    'task_type',
    'primary_metric',
    'assertion_count',
  ]

  const lines = [headers.join(',')]

  for (const row of rows) {
    lines.push([
      csvEscape(row.row_id),
      csvEscape(row.card_id),
      csvEscape(row.title),
      csvEscape(row.tier),
      csvEscape(row.task_type),
      csvEscape(row.scoring.primary_metric),
      csvEscape(row.assertions.length),
    ].join(','))
  }

  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8')
}

function writeManifest(rows, filePath) {
  const byTier = Object.fromEntries(
    TIER_ORDER.map(tier => [tier, rows.filter(row => row.tier === tier).length])
  )

  const byTaskType = {}
  for (const row of rows) {
    byTaskType[row.task_type] = (byTaskType[row.task_type] || 0) + 1
  }

  const manifest = {
    dataset_name: 'talkie-local-intelligence-eval-v1',
    description: 'Evaluation rows derived from Talkie local-intelligence primitive cards.',
    version: 'v1',
    total_rows: rows.length,
    tiers: byTier,
    task_types: byTaskType,
    files: {
      jsonl: path.basename(JSONL_PATH),
      csv: path.basename(CSV_PATH),
    },
    schema: {
      required_fields: [
        'row_id',
        'card_id',
        'tier',
        'task_type',
        'prompt',
        'input_example',
        'expected_output',
        'assertions',
        'scoring',
      ],
      output_contract: 'All model outputs should be valid JSON matching expected_output.format.',
    },
  }

  fs.writeFileSync(filePath, toJson(manifest) + '\n', 'utf8')
}

function writeReadme(filePath) {
  const content = `# Local Intelligence Eval Pack (v1)

This folder contains raw evaluation data derived from the 24 local-intelligence primitive cards.

## Files

- \`hf_local_intelligence_eval_v1.jsonl\`: canonical eval rows (one JSON object per line)
- \`hf_local_intelligence_eval_v1.csv\`: flat summary for quick filtering and spreadsheet use
- \`hf_local_intelligence_eval_manifest_v1.json\`: counts and schema hints
- \`model-comparison-candidates-2026-04-04.md\`: suggested models to benchmark
- \`model-comparison-candidates-2026-04-04.json\`: machine-readable model matrix

## Row Shape

Each JSONL row includes:

- \`prompt.system\`, \`prompt.user_template\`, \`prompt.user_rendered\`
- \`input_example\`
- \`expected_output\`
- \`assertions\` and \`test_case\`
- \`scoring\` with suggested metrics
- \`hf_chat.messages\` for chat-style inference harnesses

## Suggested Split

- Use all rows as \`eval\` for now (small, high-quality golden set).
- Add your own synthetic or user-sampled \`test-hard\` split separately.
`

  fs.writeFileSync(filePath, content, 'utf8')
}

function writeModelsGuide(filePath) {
  const content = `# Model Comparison Candidates (Draft, 2026-04-04)

Use this as a benchmark matrix for the local-intelligence eval pack.

## Baseline Group A: Small On-Device Friendly

1. Apple Foundation Models (on-device, Apple Intelligence)
2. Microsoft Phi-4-mini-instruct (3.8B, 128K)
3. Meta Llama-3.2-3B-Instruct (3.21B, 128K)
4. Qwen2.5-3B-Instruct (3.09B, 32K)

## Baseline Group B: Mid-Size Local

1. Google Gemma-3-4B-it (4B class, 128K)
2. Qwen3-8B-AWQ (8.2B, AWQ 4-bit, 32K native)

## Baseline Group C: Higher-Capacity Open Model

1. Mistral-Small-3.1-24B-Instruct-2503 (24B, 128K)

## Why this mix

- Group A tests whether tiny models are enough for structured voice workflows.
- Group B checks if modest parameter increases improve extraction/routing quality.
- Group C gives a stronger open-weight ceiling before cloud APIs.

## Suggested Evaluation Matrix

- Primary: pass rate on rule assertions per row
- By task type: classification, extraction, routing, contradiction, planning
- Latency: p50 / p95 per row
- JSON validity rate
- Cost proxy: tokens/sec and memory footprint

## Promotion Rule (example)

Promote a model to production candidate only if:

1. overall pass rate >= 0.90
2. safety-redaction leak rate = 0
3. routing accuracy >= 0.92
4. contradiction detection F1 >= 0.80
5. p95 latency for Tier 1 rows under your target budget
`

  fs.writeFileSync(filePath, content, 'utf8')
}

function writeModelCandidatesJson(filePath) {
  const payload = {
    generated_at: '2026-04-04',
    purpose: 'Candidate models for local-intelligence benchmark comparisons.',
    candidates: MODEL_CANDIDATES,
    recommendation: {
      quick_smoke_set: [
        'apple-foundation-models',
        'microsoft/Phi-4-mini-instruct',
        'Qwen/Qwen2.5-3B-Instruct',
      ],
      balanced_set: [
        'apple-foundation-models',
        'microsoft/Phi-4-mini-instruct',
        'Qwen/Qwen2.5-3B-Instruct',
        'google/gemma-3-4b-it',
        'Qwen/Qwen3-8B-AWQ',
      ],
      ceiling_set: [
        'mistralai/Mistral-Small-3.1-24B-Instruct-2503',
      ],
    },
  }

  fs.writeFileSync(filePath, toJson(payload) + '\n', 'utf8')
}

function main() {
  mkdirp(OUTPUT_DIR)

  const rows = buildRows(localIntelligenceCards)
  writeJsonl(rows, JSONL_PATH)
  writeCsv(rows, CSV_PATH)
  writeManifest(rows, MANIFEST_PATH)
  writeReadme(README_PATH)
  writeModelsGuide(MODELS_PATH)
  writeModelCandidatesJson(MODELS_JSON_PATH)

  console.log(`Wrote ${rows.length} eval rows to ${OUTPUT_DIR}`)
}

main()

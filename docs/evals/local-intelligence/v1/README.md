# Local Intelligence Eval Pack (v1)

This folder contains raw evaluation data derived from the 24 local-intelligence primitive cards.

## Files

- `hf_local_intelligence_eval_v1.jsonl`: canonical eval rows (one JSON object per line)
- `hf_local_intelligence_eval_v1.csv`: flat summary for quick filtering and spreadsheet use
- `hf_local_intelligence_eval_manifest_v1.json`: counts and schema hints
- `model-comparison-candidates-2026-04-04.md`: suggested models to benchmark
- `model-comparison-candidates-2026-04-04.json`: machine-readable model matrix

## Row Shape

Each JSONL row includes:

- `prompt.system`, `prompt.user_template`, `prompt.user_rendered`
- `input_example`
- `expected_output`
- `assertions` and `test_case`
- `scoring` with suggested metrics
- `hf_chat.messages` for chat-style inference harnesses

## Suggested Split

- Use all rows as `eval` for now (small, high-quality golden set).
- Add your own synthetic or user-sampled `test-hard` split separately.

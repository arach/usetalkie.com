# Model Comparison Candidates (Draft, 2026-04-04)

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

# AI Model Findings

## Summary
MobileCLIP model weights are licensed for research purposes only, which is incompatible with commercial use. A commercial-friendly alternative is required for release.

## MobileCLIP Licensing Issue
- MobileCLIP model weights are governed by the Apple Machine Learning Research Model (AMLR) license. The license scope is limited to non-commercial research use, which conflicts with commercial distribution by policy.
  - MobileCLIP model license text: `https://huggingface.co/apple/MobileCLIP-S0/blob/main/LICENSE`
- **Important distinction:** The MobileCLIP *code* is MIT-licensed, but the *model weights* are AMLR (research-only). For CullVue, we need to redistribute the weights, so the AMLR restriction is a blocker.

## Commercially Licensed Alternatives

### Comparison Table (practical, source-backed)

Note: Public accuracy numbers vary by benchmark/prompting. If exact benchmarks are needed, add citations per model card or paper. Size values below are taken from the linked ONNX files where available.

**ONNX availability note:** For text-to-image search to work offline, you need *both* ONNX files:
- **Vision model** (image → embedding)
- **Text model** (query text → embedding)

If only the vision ONNX exists, you can embed images but you cannot embed text queries locally, which breaks semantic search.

| Model | License | ONNX Availability | Size (ONNX) | Notes |
|-------|---------|-------------------|-------------|-------|
| MobileCLIP-S2 (current) | AMLR (research only) | Yes (Xenova) | Varies (verify) | **Blocked for commercial use** |
| google/siglip-base-patch16-224 | Apache-2.0 | Yes (Xenova) | 813 MB (single combined `model.onnx`) | Stable, proven ONNX exports |
| google/siglip2-base-patch16-224 | Apache-2.0 | Unconfirmed (vision ONNX found only) | 63.3 MB (vision q4 only) | Text ONNX not confirmed; verify before use |
| google/siglip2-so400m-patch16-naflex | Apache-2.0 | Unconfirmed | — | Best quality candidate; verify ONNX and size |
| EVA02-CLIP-ViT-B/16 (BAAI) | MIT + Apache-2.0 | Unconfirmed (via OpenCLIP exports) | — | Worth benchmarking; verify ONNX export path |
| OpenCLIP ViT-B/16 (LAION-2B) | Apache-2.0 | Unconfirmed | — | Proven in production; verify exact ONNX source |
| OpenAI CLIP ViT-B/16 | MIT | Yes | — | Lower quality vs newer options |
| TinyCLIP ViT-39M/16 | MIT | Unknown | — | Size-efficient; verify availability |
| OpenVision ViT-B/16@384 | Apache-2.0 | Unknown | — | Newer; verify ONNX and stability |

### Detailed Notes on Top Candidates

**SigLIP base (`google/siglip-base-patch16-224`)** — Current recommendation
- Apache-2.0 on model card
- Xenova has stable ONNX exports (`Xenova/siglip-base-patch16-224`)
- Sigmoid-based loss (better for retrieval tasks than softmax-based CLIP)
- Well-tested ecosystem, good community support
- Solid default choice with lowest integration risk

**SigLIP 2 base (`google/siglip2-base-patch16-224`)** — Worth evaluating
- Apache-2.0 on model card
- Improved training recipe over SigLIP v1 (better accuracy at same size)
- Verify Xenova ONNX exports exist and are stable before committing
- If ONNX exports are ready, this is likely a better pick than SigLIP v1

**EVA02-CLIP-ViT-B/16** — Strongest quality candidate
- ~74.7% ImageNet 0-shot — highest accuracy among base-size models
- MIT (code) + Apache-2.0 (weights) dual license
- ~286 MB ONNX — slightly smaller than SigLIP base
- ONNX conversion available via OpenCLIP (`open_clip` library)
- From BAAI (Beijing Academy of AI) — large, well-resourced lab
- Worth benchmarking against SigLIP for CullVue's specific use case (photo search)

**OpenCLIP ViT-B/16 (LAION-2B trained)** — Production-proven
- Used by Immich (open-source photo manager) for the same use case
- Apache-2.0, well-maintained
- ~70% accuracy is lower, but real-world photo search performance may differ from ImageNet benchmarks
- Proven production reliability is a strong signal

**SigLIP 2 SO400M naflex** — Premium option
- Best accuracy (~76%+) but ~1.5 GB model size
- Variable resolution input (naflex) — could improve search quality for mixed-resolution photo libraries
- Only viable if storage/memory budget allows it

### Models Considered but Not Recommended

- **Apple Vision Framework (macOS only)**: Can generate image embeddings but does NOT support text-to-image search (no text encoder). Not suitable for CullVue's semantic search feature.
- **TinyCLIP**: Significant accuracy drop (~63.5%) for moderate size savings. Not worth the tradeoff for a desktop app without strict size constraints.
- **OpenAI CLIP ViT-B/16**: Lower accuracy than newer alternatives. No advantage over SigLIP or EVA02-CLIP.

## Decision

**Status: Benchmark 3 models, then ship the winner.**

Priorities (from survey):
- **Accuracy first** — best search quality matters most, OK if model is 300-800 MB
- **Willing to convert ONNX** — not limited to pre-built Xenova exports
- **Benchmark before committing** — test 2-3 models on real photos before final choice

### Benchmark shortlist

| # | Model | Role | ONNX Status |
|---|-------|------|-------------|
| 1 | `google/siglip-base-patch16-224` | **Baseline** — integrate first, confirmed working | Ready (Xenova) |
| 2 | `google/siglip2-base-patch16-224` | **Challenger** — likely better accuracy at same size | Needs ONNX text model verification |
| 3 | `EVA02-CLIP-ViT-B/16` | **Challenger** — highest accuracy (~74.7%) among base-size | Needs OpenCLIP ONNX export |

### Benchmark plan

1. **Integrate SigLIP v1 first** — use `SWAP_MODEL_PROMPT.md` to swap it in. This becomes the working baseline.
2. **Export SigLIP 2 and EVA02-CLIP to ONNX** — use Hugging Face Optimum or OpenCLIP's export script.
3. **Test all 3 on ~20 real photo queries** against a folder of personal photos. Example queries: "sunset at beach", "person with dog", "birthday party", "snowy mountain", "food on a table", "group selfie".
4. **Compare on these criteria:**
   - Text-to-image retrieval accuracy (subjective ranking of top-10 results per query)
   - Embedding generation speed on target hardware (M1 Mac, mid-range Windows PC)
   - ONNX model file size and RAM usage during inference
   - Quality of zero-shot classification for auto-tagging
5. **Ship the winner.** Once chosen, swapping models is trivial — just change URLs, embedding dim, and tokenizer config. Architecture stays the same.

### Licensing (all 3 candidates)

All three models are Apache-2.0 or MIT licensed. **Zero royalties, zero fees, zero revenue sharing** for commercial use. Only requirements:
- Bundle the license text with the app
- Preserve copyright notices
- Don't claim endorsement by Google/BAAI

## Deployment Stack

- **Runtime:** ONNX Runtime with platform-specific execution providers
  - macOS: CoreML EP (GPU acceleration via ANE/Metal)
  - Windows: DirectML EP (GPU acceleration) or CPU EP
  - Linux: CPU EP (or CUDA EP if GPU available)
- **Model format:** ONNX (exported via Xenova/Hugging Face Optimum or OpenCLIP)
- **Integration:** Load model at app startup, generate embeddings on import, store in local vector index

## Platform Notes (Windows + macOS focus)
- Prefer models with clear Apache-2.0 licensing and broad ecosystem support, since they are easy to redistribute and integrate across Windows and macOS.
- Choose model size based on local device constraints. Base-sized models (~300–350 MB) are a safe default for desktop performance.
- Larger models (SO400M at ~1.5 GB) trade more compute/memory for quality — consider only if benchmarks show meaningful improvement for photo search.

## Compliance Checklist
- [ ] Re-verify model license at the time of integration (licenses can change)
- [ ] Store a copy of the model's license text in the app bundle (e.g., `THIRD_PARTY_LICENSES/`)
- [ ] Update `TERMS_OF_SERVICE.md` Section 9 (IP) and Section 10 (Third-Party Components) to reference the chosen model instead of MobileCLIP-S2
- [ ] Add model attribution in the app's About/Licenses screen

## Sources
1. SigLIP base model card and license (Apache-2.0): `https://huggingface.co/google/siglip-base-patch16-224`
2. SigLIP base ONNX combined file size (`model.onnx`, 813 MB): `https://huggingface.co/Xenova/siglip-base-patch16-224/blob/main/onnx/model.onnx`
3. SigLIP base ONNX vision file size (`vision_model.onnx`, 372 MB): `https://huggingface.co/Xenova/siglip-base-patch16-224/blob/main/onnx/vision_model.onnx`
4. SigLIP 2 base model card and license (Apache-2.0): `https://huggingface.co/google/siglip2-base-patch16-224`
5. SigLIP 2 base ONNX vision q4 file size (`vision_model_q4.onnx`, 63.3 MB): `https://huggingface.co/onnx-community/siglip2-base-patch16-224-ONNX/blob/main/onnx/vision_model_q4.onnx`
6. MobileCLIP model license text (AMLR, research-only): `https://huggingface.co/apple/MobileCLIP-S0/blob/main/LICENSE`

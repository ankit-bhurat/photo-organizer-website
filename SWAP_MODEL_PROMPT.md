# Prompt: Swap MobileCLIP-S2 → SigLIP base in CullVue

Use the following prompt when starting a new Claude session in the `/Users/Kabir/_Dev/photo-organizer/` repo.

---

## Prompt

I need to replace the MobileCLIP-S2 AI model with `google/siglip-base-patch16-224` in my CullVue desktop app (Tauri 2 + Rust + Svelte 5). The model is used for semantic photo search — embedding images and text queries, then finding matches via cosine similarity.

**Context:** SigLIP base is the first of 3 models I'm benchmarking. After this integration works, I'll also test `google/siglip2-base-patch16-224` and `EVA02-CLIP-ViT-B/16` by swapping in their ONNX files and adjusting config. So please keep the model-specific values (URLs, dimensions, tokenizer config, normalization params) in clearly named constants at the top of the file — this makes future model swaps trivial.

The ONNX weights come from Xenova's export: `https://huggingface.co/Xenova/siglip-base-patch16-224`

### What needs to change

All model logic lives in `src-tauri/src/embedding/mod.rs`. Here are the specific changes:

#### 1. Constants (trivial)

Update these constants:

| Constant | Old (MobileCLIP-S2) | New (SigLIP base) |
|----------|---------------------|-------------------|
| `MODEL_VERSION` | `"mobileclip-s2-v2"` | `"siglip-base-v1"` |
| `IMAGE_SIZE` | `256` | `224` |
| `EMBEDDING_DIM` | `512` | `768` |
| `VISUAL_ONNX_URL` | MobileCLIP Xenova URL | SigLIP Xenova vision model URL |
| `TEXT_ONNX_URL` | MobileCLIP Xenova URL | SigLIP Xenova text model URL |

For the ONNX URLs, use the **non-quantized** individual model files from `https://huggingface.co/Xenova/siglip-base-patch16-224/tree/main/onnx/`:
- Vision: `https://huggingface.co/Xenova/siglip-base-patch16-224/resolve/main/onnx/vision_model.onnx` (~372 MB)
- Text: `https://huggingface.co/Xenova/siglip-base-patch16-224/resolve/main/onnx/text_model.onnx` (**verify this file exists before coding**)

Do NOT use the combined `model.onnx` (813 MB) since the app loads vision and text models separately. Both files are required — vision for image embeddings, text for query embeddings. Without both, semantic search won't work.

#### 2. Image preprocessing (small change)

In `preprocess_image_static()`, MobileCLIP only normalizes to [0, 1] range (no ImageNet mean/std normalization). SigLIP expects standard ImageNet normalization:

- Mean: `[0.5, 0.5, 0.5]`
- Std: `[0.5, 0.5, 0.5]`

After converting pixels to [0, 1], apply: `pixel = (pixel - 0.5) / 0.5` for each channel. Also update the resize target from 256 to 224 (use the `IMAGE_SIZE` constant).

#### 3. Tokenizer swap (main piece of work)

This is the biggest change. MobileCLIP uses OpenAI's CLIP BPE tokenizer via the `instant-clip-tokenizer` crate. SigLIP uses a SentencePiece tokenizer with a completely different vocabulary.

**Steps:**
1. Remove the `instant-clip-tokenizer` dependency from `Cargo.toml`
2. Add the `tokenizers` crate (by Hugging Face): `tokenizers = { version = "0.21", default-features = false, features = ["onig"] }` — or whichever recent version is available. Check crates.io for the latest version.
3. Download SigLIP's `tokenizer.json` from `https://huggingface.co/Xenova/siglip-base-patch16-224/resolve/main/tokenizer.json` — **store it in the same models directory** as the ONNX files (recommended), or embed it at build time.
4. Replace the `tokenize()` function to use the HuggingFace tokenizer:
   - Load `tokenizer.json` using `tokenizers::Tokenizer::from_file()` or `from_bytes()` if embedded
   - Encode input text, truncate/pad to `MAX_TOKEN_LENGTH` (64 for SigLIP, not 77)
   - SigLIP's pad token ID is `1` (not `0` like CLIP)
   - The text should still be lowercased before tokenizing
5. Update `MAX_TOKEN_LENGTH` from `77` to `64`
6. Update the `ClipModel` struct's `tokenizer` field type from `instant_clip_tokenizer::Tokenizer` to `tokenizers::Tokenizer`

**Thread safety note:** The HuggingFace `tokenizers::Tokenizer` may not implement `Send + Sync` by default. Since `ClipModel` is shared across threads via `Arc<Mutex<>>`, verify it compiles. If not, wrap the tokenizer in its own `Mutex` or load it per-call from the cached file.

#### 4. ONNX input/output tensor names (verify and update)

The ONNX model's input and output tensor names may differ from MobileCLIP. Before running, inspect the ONNX graph or check Xenova's model card for the correct names. Common SigLIP names:
- Vision model input: `"pixel_values"` (likely the same)
- Text model input: `"input_ids"` (likely the same)
- Output: may be `"image_embeds"` / `"text_embeds"` or the last hidden state — verify and update the output extraction code

If the output shape differs (e.g., returns `[1, seq_len, 768]` instead of `[1, 768]`), you may need to pool (take the first token or mean pool) before normalizing. SigLIP typically outputs pooled embeddings directly.

**Important: `attention_mask` is likely required.** SigLIP's text model almost certainly expects `attention_mask` as a mandatory input alongside `input_ids`. The current MobileCLIP code only passes `input_ids` — you must add `attention_mask` (a tensor of 1s for real tokens and 0s for padding) or inference will fail at runtime.

**How to verify ONNX I/O names quickly:**
- Use `onnxruntime` CLI or a small Python script to print input/output names before coding.
- If the text model also expects `token_type_ids`, add it as a zeroed tensor.

#### 5. Embedding dimension in storage

The SQLite schema in `src-tauri/src/embedding/db.rs` stores embeddings as `BLOB`. Since it's just raw bytes, no schema change is needed — the blob size will grow from 2048 bytes (512 × f32) to 3072 bytes (768 × f32) automatically.

The `MODEL_VERSION` change will cause all existing embeddings to be treated as stale and re-indexed, which is the correct behavior.

#### 6. Tokenizer download + integrity (missing in current pipeline)

The current download pipeline only handles two model files. Update it to also download `tokenizer.json` (3 files total), and fail gracefully if it's missing or corrupted. Suggested behavior:
- If `tokenizer.json` is missing, show a UI error and stop semantic search.
- Store a small version marker file next to the model files to ensure all required artifacts are present.
- Update any progress reporting (e.g., "downloading 1 of 2") to reflect 3 files instead of 2.

### What NOT to change

- The ONNX Runtime setup (Session builder, CoreML EP on macOS, CPU EP fallback) — keep as-is
- The batch inference pipeline (rayon parallelism, pipelined preloading) — keep as-is
- The SQLite embedding storage and retrieval — keep as-is
- Cosine similarity search logic — keep as-is
- All Tauri commands in `src-tauri/src/commands/semantic.rs` — keep as-is
- The download pipeline with progress callbacks — keep as-is (just uses different URLs)
- Background/foreground indexing architecture — keep as-is
- The frontend (Svelte) — no changes needed

### Potential blockers (check before coding)
1. Confirm `text_model.onnx` exists in the Xenova repo. If it does not, the SigLIP base swap is blocked.
2. Confirm the ONNX text model input names (may include `attention_mask`).
3. Confirm output shape is pooled embeddings (if not, define pooling strategy).

### Testing

After making changes:
1. Delete the existing models directory so fresh models are downloaded:
   - macOS: `rm -rf ~/Library/Application\ Support/com.cullvue.CullVue/models/`
   - Windows: `rmdir /s /q "%APPDATA%\com.cullvue.CullVue\models"`
2. Delete the embeddings database to force re-indexing:
   - macOS: `rm ~/Library/Application\ Support/com.cullvue.CullVue/embeddings.db`
   - Windows: `del "%APPDATA%\com.cullvue.CullVue\embeddings.db"`
3. Run `cargo build` in `src-tauri/` to verify compilation
4. Run the benchmark test (`src-tauri/src/benchmark.rs`) to verify inference works
5. Test semantic search with a few queries to verify quality

### UI/UX follow-ups (if needed)
- Update any UI text that mentions model download size (e.g., “~400MB”) if the combined ONNX size changes.

### Design for easy model swapping

Since I'll be benchmarking SigLIP 2 and EVA02-CLIP next, structure the constants so swapping models later only requires changing values at the top of the file:

```rust
// --- Model Configuration (change these to swap models) ---
const MODEL_VERSION: &str = "siglip-base-v1";
const IMAGE_SIZE: u32 = 224;
const EMBEDDING_DIM: usize = 768;
const MAX_TOKEN_LENGTH: usize = 64;
const PAD_TOKEN_ID: i64 = 1;
const IMAGE_MEAN: [f32; 3] = [0.5, 0.5, 0.5];
const IMAGE_STD: [f32; 3] = [0.5, 0.5, 0.5];
const VISUAL_ONNX_URL: &str = "...";
const TEXT_ONNX_URL: &str = "...";
const TOKENIZER_URL: &str = "...";  // or embed as bytes
```

This way, swapping to SigLIP 2 or EVA02-CLIP later is just changing these constants (and possibly the tokenizer file).

### Reference files to read first

Before making any changes, read these files to understand the current implementation:
- `src-tauri/src/embedding/mod.rs` — all model logic (loading, preprocessing, inference, tokenization)
- `src-tauri/src/embedding/db.rs` — embedding storage
- `src-tauri/src/commands/semantic.rs` — Tauri commands that call into the embedding module
- `src-tauri/Cargo.toml` — dependencies

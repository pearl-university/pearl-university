#!/usr/bin/env python3
"""
Compress PDF Textbooks in Pearl University e-Library.
Uses PyMuPDF (fitz) and Pillow to:
1. Downscale excessively high-res images to web-optimized dimensions (max 1400px, 75% quality JPEG).
2. Deflate all content streams and font subsets.
3. Garbage-collect unused duplicate objects (garbage=4).
4. Preserve 100% vector sharpness for text, code snippets, formulas, diagrams, and outlines.
"""

import os
import sys
import io
import time
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image

MAX_IMAGE_DIM = 1280
JPEG_QUALITY = 75
MIN_IMAGE_BYTES_TO_COMPRESS = 40 * 1024  # 40 KB

def format_size(bytes_val):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_val < 1024.0:
            return f"{bytes_val:.2f} {unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.2f} TB"

def compress_pdf_images_and_streams(input_path: Path, output_path: Path):
    doc = fitz.open(input_path)
    processed_xrefs = set()
    images_compressed_count = 0

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        image_list = page.get_images(full=True)
        for img_info in image_list:
            xref = img_info[0]
            if xref in processed_xrefs:
                continue
            processed_xrefs.add(xref)

            try:
                base_image = doc.extract_image(xref)
                if not base_image:
                    continue

                image_bytes = base_image.get("image")
                if not image_bytes or len(image_bytes) < MIN_IMAGE_BYTES_TO_COMPRESS:
                    continue

                # Load image with Pillow
                pil_img = Image.open(io.BytesIO(image_bytes))
                orig_w, orig_h = pil_img.size

                # If image has alpha transparency, convert to RGBA, otherwise RGB
                has_alpha = pil_img.mode in ('RGBA', 'LA') or (pil_img.mode == 'P' and 'transparency' in pil_img.info)
                
                # Check if resizing is needed
                needs_resize = orig_w > MAX_IMAGE_DIM or orig_h > MAX_IMAGE_DIM
                scale = min(MAX_IMAGE_DIM / max(orig_w, 1), MAX_IMAGE_DIM / max(orig_h, 1), 1.0)
                
                new_w = max(1, int(orig_w * scale))
                new_h = max(1, int(orig_h * scale))

                if needs_resize:
                    pil_img = pil_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                out_buffer = io.BytesIO()
                if has_alpha:
                    pil_img.save(out_buffer, format="PNG", optimize=True)
                else:
                    if pil_img.mode != "RGB":
                        pil_img = pil_img.convert("RGB")
                    pil_img.save(out_buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)

                compressed_bytes = out_buffer.getvalue()

                # Only replace if compressed version is significantly smaller
                if len(compressed_bytes) < len(image_bytes) * 0.9:
                    doc.update_stream(xref, compressed_bytes)
                    images_compressed_count += 1
            except Exception as e:
                # Silently skip unsupported or corrupt image streams
                continue

    # Save with maximum stream deflating & garbage collection
    doc.save(
        str(output_path),
        garbage=4,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True,
        clean=True,
        linear=False
    )
    doc.close()
    return images_compressed_count

def main():
    base_dir = Path(__file__).resolve().parent.parent / "src" / "assets" / "books"
    if not base_dir.exists():
        print(f"Error: Directory {base_dir} does not exist.")
        sys.exit(1)

    pdf_files = sorted(list(base_dir.rglob("*.pdf")))
    if not pdf_files:
        print("No PDF files found.")
        return

    print(f"==================================================")
    print(f"  PEARL UNIVERSITY E-LIBRARY PDF COMPRESSOR")
    print(f"  Found {len(pdf_files)} PDF books to process")
    print(f"==================================================")

    total_orig_size = 0
    total_new_size = 0
    start_time = time.time()

    for idx, pdf_path in enumerate(pdf_files, 1):
        orig_size = pdf_path.stat().st_size
        total_orig_size += orig_size
        rel_path = pdf_path.relative_to(base_dir)
        temp_out = pdf_path.with_suffix(".tmp.pdf")

        print(f"\n[{idx}/{len(pdf_files)}] Processing: {pdf_path.name}")
        print(f"    Path: {rel_path.parent}")
        print(f"    Original Size: {format_size(orig_size)}")

        t0 = time.time()
        try:
            img_count = compress_pdf_images_and_streams(pdf_path, temp_out)
            new_size = temp_out.stat().st_size
            elapsed = time.time() - t0

            if new_size < orig_size:
                savings = (orig_size - new_size) / orig_size * 100
                print(f"    Compressed Size: {format_size(new_size)} (Saved {savings:.1f}%, {img_count} images optimized in {elapsed:.1f}s)")
                # Replace original with compressed version
                temp_out.replace(pdf_path)
                total_new_size += new_size
            else:
                print(f"    Original was already optimal ({format_size(orig_size)}). Keeping original.")
                temp_out.unlink(missing_ok=True)
                total_new_size += orig_size

        except Exception as err:
            print(f"    Error processing {pdf_path.name}: {err}")
            if temp_out.exists():
                temp_out.unlink()
            total_new_size += orig_size

    total_elapsed = time.time() - start_time
    total_savings = (total_orig_size - total_new_size) / max(total_orig_size, 1) * 100
    saved_bytes = total_orig_size - total_new_size

    print("\n" + "="*50)
    print("  COMPRESSION SUMMARY")
    print("="*50)
    print(f"  Total Original Size:    {format_size(total_orig_size)}")
    print(f"  Total Compressed Size:  {format_size(total_new_size)}")
    print(f"  Total Space Saved:      {format_size(saved_bytes)} ({total_savings:.1f}%)")
    print(f"  Total Time Elapsed:     {total_elapsed:.1f}s")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()

"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProductImage, moveProductImage, uploadProductImage } from "../../catalog-actions";

type Img = { id: string; image_url: string };

/**
 * Shrinks a photo in the browser before upload: longest side 1600px, WebP.
 * A 6 MB phone photo becomes roughly 200 to 400 KB, which keeps the shop fast
 * and the R2 bucket small.
 */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (blob && blob.type === "image/webp") return blob;
  // Older Safari cannot encode WebP; JPEG works everywhere.
  return (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85))) ?? file;
}

export default function ImageManager({
  productId,
  images,
  r2Ready,
}: {
  productId: string;
  images: Img[];
  r2Ready: boolean;
}) {
  const [status, setStatus] = useState("");
  const [busy, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    start(async () => {
      let done = 0;
      for (const file of Array.from(files)) {
        setStatus(`Uploading ${done + 1} of ${files.length}…`);
        try {
          const blob = await shrink(file);
          const fd = new FormData();
          fd.append("productId", productId);
          fd.append("file", new File([blob], file.name, { type: blob.type }));
          const res = await uploadProductImage(fd);
          if (res.error) {
            setStatus(res.error);
            return;
          }
          done++;
        } catch {
          setStatus(`Couldn't read ${file.name}. Try a JPG or PNG.`);
          return;
        }
      }
      setStatus(`Uploaded ${done} photo${done === 1 ? "" : "s"}.`);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Photos</h2>
        <label
          className={`cursor-pointer rounded-full px-4 py-2 text-sm text-white ${r2Ready ? "bg-accent" : "bg-muted pointer-events-none"}`}
        >
          {busy ? "Uploading…" : "Add photos"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={!r2Ready || busy}
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {!r2Ready && (
        <p className="rounded-xl bg-surface px-4 py-3 text-sm text-muted">
          Photo uploads switch on once Cloudflare R2 is connected (R2 keys in Vercel).
        </p>
      )}
      {status && <p className="text-sm text-muted">{status}</p>}

      {images.length === 0 ? (
        <p className="text-sm text-muted">No photos yet. The first photo is the one shown on product cards.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <li key={img.id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative">
                <img src={img.image_url} alt="" className="aspect-square w-full bg-surface object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] text-white">Main</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2 text-xs">
                <div className="flex gap-1">
                  <form action={moveProductImage}>
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="imageId" value={img.id} />
                    <input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={i === 0} aria-label="Move earlier" className="rounded-lg border border-line px-2 py-1 disabled:opacity-40">←</button>
                  </form>
                  <form action={moveProductImage}>
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="imageId" value={img.id} />
                    <input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={i === images.length - 1} aria-label="Move later" className="rounded-lg border border-line px-2 py-1 disabled:opacity-40">→</button>
                  </form>
                </div>
                <form action={deleteProductImage}>
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" className="rounded-lg px-2 py-1 text-danger hover:bg-danger/5">Remove</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

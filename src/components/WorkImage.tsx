"use client";

import { useEffect, useState } from "react";
import { getImage } from "@/lib/images";

export function WorkImage({
  imageId,
  alt,
  className,
}: {
  imageId?: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!imageId) {
      setSrc(null);
      return;
    }
    void getImage(imageId).then((value) => {
      if (!cancelled) setSrc(value);
    });
    return () => {
      cancelled = true;
    };
  }, [imageId]);

  if (!imageId || !src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={
        className ??
        "mt-3 max-h-80 w-full rounded-xl border border-line object-contain bg-paper"
      }
    />
  );
}

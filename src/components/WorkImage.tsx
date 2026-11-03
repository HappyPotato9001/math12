"use client";

import { imageUrl } from "@/lib/paths";

export function WorkImage({
  imageId,
  alt,
  className,
}: {
  imageId?: string;
  alt: string;
  className?: string;
}) {
  if (!imageId) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(imageId)}
      alt={alt}
      className={
        className ??
        "mt-3 max-h-80 w-full rounded-xl border border-line object-contain bg-paper"
      }
    />
  );
}

import Image from "next/image";
import type { Still as StillType } from "@/lib/products";

/**
 * Product still with precomputed blur placeholder.
 * All source imagery is 9:16 portrait (900×1600).
 */
export function Still({
  still,
  sizes = "90vw",
  priority = false,
  className = "",
  draggable = false,
}: {
  still: StillType;
  sizes?: string;
  priority?: boolean;
  className?: string;
  draggable?: boolean;
}) {
  return (
    <Image
      src={still.src}
      alt={still.caption}
      width={still.w}
      height={still.h}
      placeholder="blur"
      blurDataURL={still.blur}
      sizes={sizes}
      priority={priority}
      draggable={draggable}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

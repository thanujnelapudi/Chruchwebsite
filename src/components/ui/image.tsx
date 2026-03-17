/**
 * src/components/ui/image.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in replacement for the Wix Image component.
 * No @wix/image-kit dependency — uses standard <img> with lazy loading,
 * error fallback, and the same external prop API so zero component changes needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { forwardRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import "./image.css";

const FALLBACK_IMAGE_URL = "/images/placeholder.jpg";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  // Wix compat props — accepted but not used; prevents TS errors in existing components
  fittingType?: "fill" | "fit";
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt = "",
      className,
      fittingType,
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src);

    if (!src) {
      return <div data-empty-image className={className} />;
    }

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(className)}
        onError={() => {
          if (imgSrc !== FALLBACK_IMAGE_URL) {
            setImgSrc(FALLBACK_IMAGE_URL);
          }
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

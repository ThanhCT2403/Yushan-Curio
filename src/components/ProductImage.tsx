import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-[#F2EFE9] via-[#EAE4DA] to-[#DFD7CA] flex flex-col items-center justify-center p-6 text-center select-none"
        role="img"
        aria-label={alt}
      >
        <Package className="w-8 h-8 text-[#5E5A54] mb-2" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-[#1A1917] leading-snug">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

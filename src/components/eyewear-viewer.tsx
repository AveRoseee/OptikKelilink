"use client";

import dynamic from "next/dynamic";

const ThreeModelCanvas = dynamic(
  () =>
    import("@/components/three-model-canvas").then(
      (module) => module.ThreeModelCanvas,
    ),
  {
    ssr: false,
    loading: () => <div className="model-viewer-host">Memuat viewer 3D...</div>,
  },
);

export function EyewearViewer({
  src,
  poster,
  tint,
  materialOverrides,
  preserveMaterials = false,
  minDistance,
  maxDistance,
  alt,
  onInteract,
}: {
  src: string;
  poster?: string;
  tint: string;
  materialOverrides?: Record<string, { color: string }>;
  preserveMaterials?: boolean;
  minDistance?: number;
  maxDistance?: number;
  alt: string;
  onInteract?: () => void;
}) {
  return (
    <div
      className="model-viewer-host"
      role="img"
      aria-label={alt}
      style={poster ? { backgroundImage: `url("${poster}")` } : undefined}
    >
      <ThreeModelCanvas
        src={src}
        tint={tint}
        materialOverrides={materialOverrides}
        preserveMaterials={preserveMaterials}
        minDistance={minDistance}
        maxDistance={maxDistance}
        onInteract={onInteract}
      />
    </div>
  );
}

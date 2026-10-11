"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Material, Mesh, type Color } from "three";

type MaterialOverrides = Record<string, { color: string }>;

export function ThreeModelCanvas({
  src,
  tint,
  materialOverrides,
  preserveMaterials = false,
  minDistance = 1.5,
  maxDistance = 9,
  onInteract,
}: {
  src: string;
  tint: string;
  materialOverrides?: MaterialOverrides;
  preserveMaterials?: boolean;
  minDistance?: number;
  maxDistance?: number;
  onInteract?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <directionalLight position={[-4, 1, -3]} intensity={1} />
      <Suspense fallback={<Html center>Memuat model...</Html>}>
        <Bounds fit clip observe margin={1.25}>
          <Center>
            <LoadedModel
              src={src}
              tint={tint}
              materialOverrides={materialOverrides}
              preserveMaterials={preserveMaterials}
            />
          </Center>
        </Bounds>
        <OrbitControls
          enablePan={false}
          minDistance={minDistance}
          maxDistance={maxDistance}
          onStart={onInteract}
        />
      </Suspense>
    </Canvas>
  );
}

function LoadedModel({
  src,
  tint,
  materialOverrides,
  preserveMaterials,
}: {
  src: string;
  tint: string;
  materialOverrides?: MaterialOverrides;
  preserveMaterials: boolean;
}) {
  const { scene } = useGLTF(src);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      // Object3D.traverse() is typed broadly. Check Three.js' runtime mesh
      // flag, then narrow explicitly so `material` has the correct type.
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (preserveMaterials) return;
    model.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const materials: Material[] = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((material) => {
        const colorMaterial = material as Material & { color?: Color };
        const color = materialOverrides?.[material.name]?.color ?? tint;
        colorMaterial.color?.set(color);
      });
    });
  }, [model, tint, materialOverrides, preserveMaterials]);

  return <primitive object={model} />;
}

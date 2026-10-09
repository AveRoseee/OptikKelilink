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
  onInteract,
}: {
  src: string;
  tint: string;
  materialOverrides?: MaterialOverrides;
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
            />
          </Center>
        </Bounds>
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={9}
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
}: {
  src: string;
  tint: string;
  materialOverrides?: MaterialOverrides;
}) {
  const { scene } = useGLTF(src);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        const colorMaterial = material as Material & { color?: Color };
        const color = materialOverrides?.[material.name]?.color ?? tint;
        colorMaterial.color?.set(color);
      });
    });
  }, [model, tint, materialOverrides]);

  return <primitive object={model} />;
}

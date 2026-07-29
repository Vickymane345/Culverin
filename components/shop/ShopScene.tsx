"use client";

/**
 * Shop hub 3D backdrop.
 *
 * Deliberately different from the landing page scene (a particle sphere with a
 * wireframe core). Here: a loose 3D lattice of rounded slabs standing in for
 * devices on shelves. Scrolling dollies the camera through the lattice and
 * counter-rotates the rows, so the grid opens up as you move down the page.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const ACCENT = "#0066cc";

type Slab = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  drift: number;
  spin: number;
};

function useSlabs(count: number): Slab[] {
  return useMemo(() => {
    // Deterministic pseudo-random so server and client agree and the layout
    // is stable between renders.
    let seed = 20260729;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const slabs: Slab[] = [];
    for (let i = 0; i < count; i++) {
      const col = (i % 5) - 2;
      const row = Math.floor(i / 5) - 2;
      slabs.push({
        position: [
          col * 2.4 + (rand() - 0.5) * 0.8,
          row * 2.2 + (rand() - 0.5) * 0.6,
          (rand() - 0.5) * 6,
        ],
        rotation: [
          (rand() - 0.5) * 0.5,
          (rand() - 0.5) * 0.9,
          (rand() - 0.5) * 0.3,
        ],
        scale: [0.62, 1.28, 0.055],
        drift: 0.25 + rand() * 0.6,
        spin: (rand() - 0.5) * 0.35,
      });
    }
    return slabs;
  }, [count]);
}

/** A rounded slab, shaped roughly like a phone seen edge-on. */
function slabGeometry() {
  const shape = new THREE.Shape();
  const w = 1, h = 1, r = 0.22;
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return new THREE.ShapeGeometry(shape, 8);
}

function Lattice({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useSlabs(25);
  const geo = useMemo(() => slabGeometry(), []);
  const { camera } = useThree();

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;

    // Dolly through the lattice and ease the camera off-axis as you scroll.
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 - p * 7.5, 0.06);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p * 1.6, 0.06);
    camera.lookAt(0, 0, 0);

    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -0.35 + p * 0.9,
      0.05
    );

    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = slabs[i];
      if (!s) return;
      child.position.y = s.position[1] + Math.sin(t * s.drift + i) * 0.28;
      child.rotation.z = s.rotation[2] + Math.sin(t * 0.3 + i) * 0.06;
      child.rotation.y = s.rotation[1] + t * s.spin * 0.12;
    });

    void delta;
  });

  return (
    <group ref={group}>
      {slabs.map((s, i) => (
        <mesh
          key={i}
          geometry={geo}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        >
          <meshBasicMaterial
            color={ACCENT}
            transparent
            opacity={0.07 + (i % 4) * 0.018}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Thin outlines echoing the slabs, for a bit of structure on white. */
function Edges({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useSlabs(25);

  useFrame((state) => {
    if (!group.current) return;
    const p = progress.current ?? 0;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -0.35 + p * 0.9,
      0.05
    );
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = slabs[i];
      if (!s) return;
      child.position.y = s.position[1] + Math.sin(t * s.drift + i) * 0.28;
      child.rotation.y = s.rotation[1] + t * s.spin * 0.12;
    });
  });

  return (
    <group ref={group}>
      {slabs.map((s, i) =>
        i % 3 === 0 ? (
          <lineSegments key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1, 1)]} />
            <lineBasicMaterial color={ACCENT} transparent opacity={0.18} />
          </lineSegments>
        ) : null
      )}
    </group>
  );
}

export default function ShopScene({
  progress,
}: {
  progress: RefObject<number>;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced && window.innerWidth >= 768);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "low-power", alpha: true }}
        style={{ background: "transparent" }}
      >
        <Lattice progress={progress} />
        <Edges progress={progress} />
      </Canvas>
    </div>
  );
}

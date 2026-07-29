"use client";

/**
 * About page 3D.
 *
 * A third distinct scene. Three wireframe rings, one per business line, orbit a
 * small core on different axes. Scrolling through the three sections promotes
 * the matching ring: it swells, brightens and squares up to the camera while
 * the other two recede. The whole armature also counter-rotates with scroll.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#0066cc");
const DIM = new THREE.Color("#8fb8e0");

type RingSpec = {
  radius: number;
  tube: number;
  rest: [number, number, number];
  focus: [number, number, number];
  speed: number;
};

const RINGS: RingSpec[] = [
  { radius: 1.75, tube: 0.012, rest: [1.15, 0.2, 0], focus: [0, 0, 0], speed: 0.16 },
  { radius: 2.25, tube: 0.012, rest: [0.35, 1.2, 0.4], focus: [0, 0, 0], speed: -0.12 },
  { radius: 2.75, tube: 0.012, rest: [-0.6, 0.5, 1.1], focus: [0, 0, 0], speed: 0.09 },
];

function Ring({
  spec,
  index,
  active,
}: {
  spec: RingSpec;
  index: number;
  active: RefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (!mesh.current || !mat.current) return;

    // How close the scroll position is to this ring's section.
    const distance = Math.abs((active.current ?? 0) - index);
    const focus = Math.max(0, 1 - distance);

    const targetScale = 1 + focus * 0.16;
    mesh.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.06
    );

    const [rx, ry, rz] = spec.rest;
    const [fx, fy, fz] = spec.focus;
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      THREE.MathUtils.lerp(rx, fx, focus),
      0.05
    );
    mesh.current.rotation.z = THREE.MathUtils.lerp(
      mesh.current.rotation.z,
      THREE.MathUtils.lerp(rz, fz, focus),
      0.05
    );
    mesh.current.rotation.y += delta * spec.speed;

    mat.current.color.lerpColors(DIM, ACCENT, focus);
    mat.current.opacity = THREE.MathUtils.lerp(
      mat.current.opacity,
      0.22 + focus * 0.5,
      0.06
    );

    void state;
  });

  return (
    <mesh ref={mesh} rotation={spec.rest}>
      <torusGeometry args={[spec.radius, spec.tube, 8, 128]} />
      <meshBasicMaterial ref={mat} color={DIM} transparent opacity={0.25} />
    </mesh>
  );
}

/** Small node that sits on each ring, marking the active section. */
function Markers({ active }: { active: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const spec = RINGS[i];
      const distance = Math.abs((active.current ?? 0) - i);
      const focus = Math.max(0, 1 - distance);
      const angle = t * spec.speed * 2 + i * 2.1;
      child.position.set(
        Math.cos(angle) * spec.radius,
        Math.sin(angle) * spec.radius * 0.45,
        Math.sin(angle) * spec.radius * 0.3
      );
      const s = 0.05 + focus * 0.07;
      child.scale.setScalar(s);
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.3 + focus * 0.7;
    });
  });

  return (
    <group ref={group}>
      {RINGS.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.1;
    mesh.current.rotation.y += delta * 0.14;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
    mesh.current.scale.setScalar(pulse);
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.62, 1]} />
      <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

function Rig({ active }: { active: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const a = active.current ?? 0;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      a * 0.5,
      0.04
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      a * -0.18,
      0.04
    );
  });

  return (
    <group ref={group}>
      <Core />
      <Markers active={active} />
      {RINGS.map((spec, i) => (
        <Ring key={i} spec={spec} index={i} active={active} />
      ))}
    </group>
  );
}

export default function AboutScene({ active }: { active: RefObject<number> }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // The column this sits in is `hidden lg:block`, but a hidden element still
    // mounts, so guard on width too. Otherwise phones pay for a WebGL context
    // and the three.js runtime to render nothing.
    const check = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(!reduced && window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dpr = useMemo<[number, number]>(() => [1, 1.5], []);

  if (!enabled) {
    return (
      <div
        aria-hidden="true"
        className="h-full w-full rounded-full border border-accent/20 bg-accent/[0.04]"
      />
    );
  }

  return (
    <div className="pointer-events-none h-full w-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        dpr={dpr}
        gl={{ antialias: true, powerPreference: "low-power", alpha: true }}
        style={{ background: "transparent" }}
      >
        <Rig active={active} />
      </Canvas>
    </div>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useIoTStore } from '@/core/store/useIoTStore';

export type CameraPreset = 'default' | 'overview';

interface CameraRigProps {
  viewPreset?: CameraPreset;
  presetTrigger?: number;
}

const DEFAULT_POS = new THREE.Vector3(6.8, 5.2, 7.2);
const DEFAULT_TARGET = new THREE.Vector3(0, 1.2, 0);

const OVERVIEW_POS = new THREE.Vector3(0.01, 11.2, 4.2);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0.2, 0);

export function CameraRig({ viewPreset = 'default', presetTrigger = 0 }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isAutoRotate = useIoTStore((s) => s.isAutoRotate);
  const { camera } = useThree();

  const isTransitioningRef = useRef(false);
  const destPosRef = useRef(new THREE.Vector3().copy(DEFAULT_POS));
  const destTargetRef = useRef(new THREE.Vector3().copy(DEFAULT_TARGET));

  useEffect(() => {
    if (viewPreset === 'overview') {
      destPosRef.current.copy(OVERVIEW_POS);
      destTargetRef.current.copy(OVERVIEW_TARGET);
    } else {
      destPosRef.current.copy(DEFAULT_POS);
      destTargetRef.current.copy(DEFAULT_TARGET);
    }
    isTransitioningRef.current = true;
  }, [viewPreset, presetTrigger]);

  useFrame((_, delta) => {
    if (isTransitioningRef.current && controlsRef.current) {
      const step = Math.min(1, delta * 4.5);
      camera.position.lerp(destPosRef.current, step);
      controlsRef.current.target.lerp(destTargetRef.current, step);
      controlsRef.current.update();

      const posDist = camera.position.distanceTo(destPosRef.current);
      const targetDist = controlsRef.current.target.distanceTo(destTargetRef.current);
      if (posDist < 0.04 && targetDist < 0.04) {
        camera.position.copy(destPosRef.current);
        controlsRef.current.target.copy(destTargetRef.current);
        controlsRef.current.update();
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      autoRotate={isAutoRotate}
      autoRotateSpeed={0.8}
      minDistance={3.5}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={[0, 1.2, 0]}
    />
  );
}


# CONTEXT_3D_SCENE_GUIDE: 3D 가상 공간 및 R3F 컴포넌트 개발 가이드

이 문서는 AI에게 React Three Fiber (R3F) 씬 구성 및 3D 오브젝트 조작 규칙을 제공하는 Context 문서입니다.

## 1. 3D 씬 계층 구조
3D 씬은 `src/components/3d/SceneCanvas.tsx` 내부의 `<Canvas>` 컴포넌트 안에 렌더링됩니다.

```tsx
<Canvas shadows camera={{ position: [7, 6, 8], fov: 45 }}>
  {/* 조명 및 환경 */}
  <ambientLight intensity={ambientIntensity} />
  <directionalLight position={[10, 15, 10]} castShadow />
  
  {/* 카메라 컨트롤러 */}
  <OrbitControls enableDamping maxPolarAngle={Math.PI / 2 - 0.05} />
  
  {/* 스마트홈 메인 룸 */}
  <SmartHomeRoom>
    <DoorObject />       {/* SG90 서보모터 연동 */}
    <LightObject />      {/* RGB LED 연동 */}
    <DhtSensorBadge />   {/* DHT11 온습도 연동 */}
    <CdsSensorNode />    {/* Cds 조도센서 연동 */}
  </SmartHomeRoom>
</Canvas>
```

## 2. 하드웨어-3D 오브젝트 연동 구현 패턴

### 2.1 SG90 스마트 도어 (`DoorObject.tsx`)
- 서보모터 각도(`0° ~ 180°`)에 따라 Y축 회전값을 부드럽게 보간(Lerp)합니다.
```tsx
const targetRotationY = (reportedAngle * Math.PI) / 180;
useFrame((_, delta) => {
  if (doorRef.current) {
    doorRef.current.rotation.y = THREE.MathUtils.damp(
      doorRef.current.rotation.y,
      targetRotationY,
      8,
      delta
    );
  }
});
```

### 2.2 RGB LED 스마트 조명 (`LightObject.tsx`)
- 스토어의 `rgb_color` (예: `#FF5500`)와 `rgb_state`('ON'/'OFF')에 따라:
  - `<pointLight color={color} intensity={isOn ? 2.5 : 0} />`
  - 전등갓 매쉬의 `emissive` 색상과 `emissiveIntensity`를 실시간 갱신합니다.

### 2.3 Cds 조도 센서 (`CdsSensorNode.tsx`)
- 센서값(`light_adc`: 0 ~ 65535)을 0.1 ~ 0.9 범위의 `ambientIntensity`로 정규화하여 씬 전체 밝기에 동적으로 반영합니다.

### 2.4 DHT11 온습도 플로팅 배지 (`DhtSensorBadge.tsx`)
- `@react-three/drei`의 `<Html center distanceFactor={10}>` 컴포넌트를 사용하여 3D 방 벽면이나 가구 위에 실시간 온도와 습도를 미려한 반투명 카드 배지로 띄웁니다.

## 3. 새로운 3D 오브젝트 추가 규칙 (AI 안내)
- 외부 GLTF/GLB 모델을 사용할 경우: `useGLTF('/models/파일명.glb')`를 사용하세요.
- 기본 프리미티브(Box, Cylinder, Sphere)로 조합할 때는 메쉬 그룹(`group`)으로 묶고, 그림자(`castShadow`, `receiveShadow`)를 활성화하세요.
- 오브젝트 클릭 시 해당 장치가 선택되도록 `onClick={(e) => { e.stopPropagation(); setSelectedDevice(id); }}`를 설정하세요.

"use client"

import { useRef, useEffect, useState, ReactNode, forwardRef, useImperativeHandle, CSSProperties } from 'react';



type SpringConfig = {
  stiffness      ?:  number;
  damping        ?:  number;
  mass           ?:  number;
  stopThreshold  ?:  number;
};

type Bounds = {
  left    ?:  number;
  top     ?:  number;
  right   ?:  number;
  bottom  ?:  number;
};

type DragState = {
  x   :  number;
  y   :  number;
  vx  :  number;
  vy  :  number;
};

type DraggableProps = {
  children        ?:  ReactNode;
  className       ?:  string;
  style           ?:  CSSProperties;
  initial         ?:  { x?: number; y?: number };
  bounds          ?:  Bounds;
  spring          ?:  SpringConfig;
  onDrag          ?:  (state: { x: number; y: number; vx: number; vy: number; dragging: boolean }) => void;
  useTranslate3d  ?:  boolean;
};

// -----------------------------------------------------
// DraggableComponent
// -----------------------------------------------------
export const DraggableComponent = forwardRef(function DraggableComponent(
  {
    children,
    className,
    style,
    initial = { x: 0, y: 0 },
    bounds,
    spring,
    onDrag,
    useTranslate3d = true,
  }: DraggableProps,
  ref
) {
  const elRef         =  useRef<HTMLDivElement | null>(null);
  const frameRef      =  useRef<number | null>(null);
  const draggingRef   =  useRef(false);
  const pointerIdRef  =  useRef<number | null>(null);
  const stateRef      =  useRef<DragState>({ x: initial.x || 0, y: initial.y || 0, vx: 0, vy: 0 });
  const targetRef     =  useRef<{ x: number; y: number }>({ x: initial.x || 0, y: initial.y || 0 });

  const historyRef    =  useRef<Array<{ t: number; x: number; y: number }>>([]);

  const cfg: Required<SpringConfig> = {
    stiffness      :  spring?.stiffness ?? 180,
    damping        :  spring?.damping ?? 24,
    mass           :  spring?.mass ?? 1,
    stopThreshold  :  spring?.stopThreshold ?? 0.02,
  };

  const [, setTick] = useState(0);

  const now = () => performance.now();

  function applyStyle(x: number, y: number) {
    const el = elRef.current;
    if (!el) return;
    const transform = useTranslate3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;
    el.style.transform = transform;
  }

  function clampToBounds(x: number, y: number) {
    if (!bounds) return { x, y };
    return {
      x: Math.max(bounds.left ?? -Infinity, Math.min(x, bounds.right ?? Infinity)),
      y: Math.max(bounds.top ?? -Infinity, Math.min(y, bounds.bottom ?? Infinity)),
    };
  }

  function estimateVelocity() {
    const h = historyRef.current;
    if (h.length < 2) return { vx: 0, vy: 0 };
    const last = h[h.length - 1];
    const threshold = 50;
    let idx = h.length - 2;
    while (idx > 0 && last.t - h[idx].t < threshold) idx--;
    const prev = h[idx];
    const dt = Math.max(1, last.t - prev.t);
    return {
      vx: (last.x - prev.x) / (dt / 1000),
      vy: (last.y - prev.y) / (dt / 1000),
    };
  }

  function cancelFrame() {
    if (frameRef.current != null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }

  function startSpringAnimation(initVX = 0, initVY = 0) {
    cancelFrame();

    const mass  =  cfg.mass;
    const k     =  cfg.stiffness;
    const c     =  cfg.damping;

    stateRef.current.vx = initVX;
    stateRef.current.vy = initVY;

    let lastTime = now();

    function step() {
      const t = now();
      const dt = Math.min(32, t - lastTime) / 1000;
      lastTime = t;

      const sx = stateRef.current.x;
      const sy = stateRef.current.y;
      const vx = stateRef.current.vx;
      const vy = stateRef.current.vy;
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;

      const ax = (-c * vx - k * (sx - tx)) / mass;
      const ay = (-c * vy - k * (sy - ty)) / mass;

      const nvx = vx + ax * dt;
      const nvy = vy + ay * dt;
      const nx = sx + nvx * dt;
      const ny = sy + nvy * dt;

      stateRef.current.x = nx;
      stateRef.current.y = ny;
      stateRef.current.vx = nvx;
      stateRef.current.vy = nvy;

      applyStyle(nx, ny);
      onDrag?.({ x: nx, y: ny, vx: nvx, vy: nvy, dragging: false });

      const disp = Math.hypot(nx - tx, ny - ty);
      const vel = Math.hypot(nvx, nvy);

      if (disp < cfg.stopThreshold && vel < cfg.stopThreshold) {
        stateRef.current.x = tx;
        stateRef.current.y = ty;
        stateRef.current.vx = 0;
        stateRef.current.vy = 0;
        applyStyle(tx, ty);
        onDrag?.({ x: tx, y: ty, vx: 0, vy: 0, dragging: false });
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
  }

  // -------------------------------------------------------------------
  // Expose API ke parent: setTarget & setPositionImmediate
  // -------------------------------------------------------------------
  useImperativeHandle(ref, () => ({
    setTarget(pos: { x: number; y: number }) {
      targetRef.current.x = pos.x;
      targetRef.current.y = pos.y;
      startSpringAnimation(0, 0);
    },

    setPosition(pos: { x: number; y: number }) {
      stateRef.current.x = pos.x;
      stateRef.current.y = pos.y;
      targetRef.current.x = pos.x;
      targetRef.current.y = pos.y;
      applyStyle(pos.x, pos.y);
    },
  }));

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    function onDown(e: PointerEvent) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      (e.target as Element).setPointerCapture?.(e.pointerId);
      pointerIdRef.current = e.pointerId;
      draggingRef.current = true;
      cancelFrame();

      historyRef.current = [{ t: now(), x: stateRef.current.x, y: stateRef.current.y }];

      (el as any).__dragBase = {
        px: e.clientX,
        py: e.clientY,
        startX: stateRef.current.x,
        startY: stateRef.current.y,
      };

      onDrag?.({
        x: stateRef.current.x,
        y: stateRef.current.y,
        vx: 0,
        vy: 0,
        dragging: true,
      });
    }

    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

      const base = (el as any).__dragBase;
      if (!base) return;

      let nx = base.startX + (e.clientX - base.px);
      let ny = base.startY + (e.clientY - base.py);

      ({ x: nx, y: ny } = clampToBounds(nx, ny));

      historyRef.current.push({ t: now(), x: nx, y: ny });
      if (historyRef.current.length > 8) historyRef.current.shift();

      stateRef.current.x = nx;
      stateRef.current.y = ny;
      stateRef.current.vx = 0;
      stateRef.current.vy = 0;

      applyStyle(nx, ny);
      onDrag?.({ x: nx, y: ny, vx: 0, vy: 0, dragging: true });

      setTick(t => t + 1);
    }

    function onUp(e: PointerEvent) {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

      (e.target as Element).releasePointerCapture?.(e.pointerId);
      draggingRef.current = false;
      pointerIdRef.current = null;

      const { vx, vy } = estimateVelocity();

      let tx = stateRef.current.x;
      let ty = stateRef.current.y;
      ({ x: tx, y: ty } = clampToBounds(tx, ty));

      targetRef.current.x = tx;
      targetRef.current.y = ty;

      startSpringAnimation(vx, vy);
    }

    el.addEventListener('pointerdown', onDown as EventListener);
    window.addEventListener('pointermove', onMove as EventListener);
    window.addEventListener('pointerup', onUp as EventListener);
    window.addEventListener('pointercancel', onUp as EventListener);

    return () => {
      el.removeEventListener('pointerdown', onDown as EventListener);
      window.removeEventListener('pointermove', onMove as EventListener);
      window.removeEventListener('pointerup', onUp as EventListener);
      window.removeEventListener('pointercancel', onUp as EventListener);
      cancelFrame();
    };
  }, [bounds]);

  // initial pos
  useEffect(() => {
    stateRef.current.x = initial.x || 0;
    stateRef.current.y = initial.y || 0;
    applyStyle(initial.x || 0, initial.y || 0);
  }, []);

  return (
    <div
      ref={elRef}
      className={className}
      style={{
        touchAction: 'none',
        cursor: 'grab',
        display: 'inline-block',
        ...style,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
});

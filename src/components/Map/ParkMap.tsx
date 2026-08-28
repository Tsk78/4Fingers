import { useCallback, useRef, useState } from 'react';
import { Plus, Minus, MapPin } from 'lucide-react';
import {
  HABITAT_NODES,
  CURRENT_LOCATION,
  PATH_TO_FRAGILE_FOREST,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  MAP_BACKGROUND_URL,
  type HabitatId,
} from '@/data/map';
import { AnimatedPath } from './AnimatedPath';
import { CrowdOverlay } from './CrowdOverlay';

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MIN_W = VIEWBOX_WIDTH * 0.35; // most zoomed-in
const MAX_W = VIEWBOX_WIDTH; // fully zoomed-out (can't see less than full map)
const ZOOM_STEP = 0.8; // button zoom factor per click

// Open one "+" click zoomed in (design tweak): width one ZOOM_STEP below full,
// centered on the map. Equivalent to the initial full view then a single zoom-in.
const INITIAL_W = VIEWBOX_WIDTH * ZOOM_STEP;
const INITIAL_VIEWBOX: ViewBox = {
  x: (VIEWBOX_WIDTH - INITIAL_W) / 2,
  y: (VIEWBOX_HEIGHT - INITIAL_W) / 2,
  w: INITIAL_W,
  h: INITIAL_W,
};

function clampViewBox(vb: ViewBox): ViewBox {
  // keep aspect ratio square and within [MIN_W, MAX_W]
  const w = Math.min(MAX_W, Math.max(MIN_W, vb.w));
  const h = w; // square viewBox
  const x = Math.min(VIEWBOX_WIDTH - w, Math.max(0, vb.x));
  const y = Math.min(VIEWBOX_HEIGHT - h, Math.max(0, vb.y));
  return { x, y, w, h };
}

interface ParkMapProps {
  /** node currently in a crowded/heat state (e.g. Orangutan during peak traffic). */
  crowdedNodeId: HabitatId | null;
  /** when true, draw the navigation path + pulse the Fragile Forest destination. */
  showRoute: boolean;
  onNodeTap: (id: HabitatId) => void;
}

export function ParkMap({ crowdedNodeId, showRoute, onNodeTap }: ParkMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [viewBox, setViewBox] = useState<ViewBox>(INITIAL_VIEWBOX);

  // --- Pan (single-pointer drag) & pinch (two-pointer) state ---
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const panStart = useRef<{ px: number; py: number; vb: ViewBox } | null>(null);
  const pinchStart = useRef<{ dist: number; vb: ViewBox } | null>(null);

  // Convert a client px delta to viewBox user-space units.
  const pxToUnits = useCallback(
    (dpx: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      const scale = rect ? viewBox.w / rect.width : 1;
      return dpx * scale;
    },
    [viewBox.w],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1) {
        panStart.current = { px: e.clientX, py: e.clientY, vb: viewBox };
        pinchStart.current = null;
      } else if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        pinchStart.current = { dist, vb: viewBox };
        panStart.current = null;
      }
    },
    [viewBox],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Pinch zoom (two pointers)
      if (pointers.current.size === 2 && pinchStart.current) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 0) {
          const ratio = pinchStart.current.dist / dist; // >1 = zoom out
          const base = pinchStart.current.vb;
          const newW = base.w * ratio;
          // zoom toward the viewBox center
          const cx = base.x + base.w / 2;
          const cy = base.y + base.h / 2;
          const next = clampViewBox({
            x: cx - newW / 2,
            y: cy - newW / 2,
            w: newW,
            h: newW,
          });
          setViewBox(next);
        }
        return;
      }

      // Pan (single pointer)
      if (pointers.current.size === 1 && panStart.current) {
        const dx = pxToUnits(e.clientX - panStart.current.px);
        const dy = pxToUnits(e.clientY - panStart.current.py);
        const base = panStart.current.vb;
        setViewBox(clampViewBox({ ...base, x: base.x - dx, y: base.y - dy }));
      }
    },
    [pxToUnits],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
  }, []);

  const zoomByFactor = useCallback((factor: number) => {
    setViewBox((vb) => {
      const cx = vb.x + vb.w / 2;
      const cy = vb.y + vb.h / 2;
      const newW = vb.w * factor;
      return clampViewBox({ x: cx - newW / 2, y: cy - newW / 2, w: newW, h: newW });
    });
  }, []);

  const fragileForest = HABITAT_NODES.find((n) => n.id === 'fragile-forest')!;

  return (
    <div className="relative w-full overflow-hidden rounded-card border border-white/10 bg-jungle-dark">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="block aspect-square w-full touch-none select-none"
        role="img"
        aria-label="Park habitat map. Tap a habitat node for details."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <image
          href={MAP_BACKGROUND_URL}
          x={0}
          y={0}
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Navigation route to Fragile Forest */}
        {showRoute && <AnimatedPath points={PATH_TO_FRAGILE_FOREST} />}
        {showRoute && (
          <CrowdOverlay x={fragileForest.x} y={fragileForest.y} variant="destination" />
        )}

        {/* Crowd heat zone */}
        {crowdedNodeId &&
          (() => {
            const node = HABITAT_NODES.find((n) => n.id === crowdedNodeId);
            return node ? <CrowdOverlay x={node.x} y={node.y} variant="heat" /> : null;
          })()}

        {/* Current-location indicator */}
        <g pointerEvents="none">
          <circle cx={CURRENT_LOCATION.x} cy={CURRENT_LOCATION.y} r={12} fill="#f4b740" />
          <circle
            cx={CURRENT_LOCATION.x}
            cy={CURRENT_LOCATION.y}
            r={12}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
          />
        </g>

        {/* Habitat nodes (tappable) */}
        {HABITAT_NODES.map((node) => {
          const isCrowded = node.id === crowdedNodeId;
          return (
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${node.name}${isCrowded ? ' (crowded)' : ''}`}
              className="cursor-pointer focus:outline-none"
              onClick={() => onNodeTap(node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNodeTap(node.id);
                }
              }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={26}
                fill={isCrowded ? '#e2413b' : '#0f3d2e'}
                stroke={isCrowded ? '#ff6b63' : '#3fae6b'}
                strokeWidth={5}
              />
              <text
                x={node.x}
                y={node.y + 52}
                textAnchor="middle"
                className="fill-mist text-[26px] font-semibold"
                style={{ paintOrder: 'stroke', stroke: '#082018', strokeWidth: 6 }}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Zoom controls (Requirement 3.6). 44x44 min touch target (Req 8.4). */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => zoomByFactor(ZOOM_STEP)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-jungle-light/90 text-mist shadow-glass backdrop-blur-glass"
        >
          <Plus size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => zoomByFactor(1 / ZOOM_STEP)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-jungle-light/90 text-mist shadow-glass backdrop-blur-glass"
        >
          <Minus size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Legend / current-location hint */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-jungle-dark/80 px-3 py-1 text-xs text-mist/90 backdrop-blur-glass">
        <MapPin size={14} className="text-amber" aria-hidden="true" />
        You are here
      </div>
    </div>
  );
}

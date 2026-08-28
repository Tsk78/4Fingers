import { GlassCard } from '@/components/GlassCard';

// Placeholder — full SVG map, crowd overlay, and peak-traffic flow land in Phase 2.
export function MapTab() {
  return (
    <section aria-labelledby="map-heading" className="space-y-4">
      <h1 id="map-heading" className="text-2xl font-bold text-mist">
        Park Map
      </h1>
      <GlassCard>
        <p className="text-mist/80">
          Interactive habitat map coming in Phase 2 (Orangutan, Fragile Forest,
          Night Trail).
        </p>
      </GlassCard>
    </section>
  );
}

import { GlassCard } from '@/components/GlassCard';
import { useAppState } from '@/hooks/useAppState';

// Placeholder — live camera, scan flow, and result card land in Phase 3.
export function CameraTab() {
  const { state } = useAppState();
  return (
    <section aria-labelledby="camera-heading" className="space-y-4">
      <h1 id="camera-heading" className="text-2xl font-bold text-mist">
        WildDex Camera
      </h1>
      <GlassCard>
        <p className="text-mist/80">
          AR scanner coming in Phase 3. Species unlocked so far:{' '}
          <strong>{state.unlockedSpecies.length}</strong>.
        </p>
      </GlassCard>
    </section>
  );
}

import { CameraOff } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { DemoSpeciesButtons } from './DemoSpeciesButtons';

interface CameraPermissionFallbackProps {
  onPick: (speciesId: string) => void;
  disabled?: boolean;
}

/**
 * Shown when camera permission is denied or the browser is unsupported
 * (Requirement 4.2, design.md §5.1). The four demo buttons become the only
 * scan trigger. Friendly, non-technical message (design.md §9).
 */
export function CameraPermissionFallback({
  onPick,
  disabled,
}: CameraPermissionFallbackProps) {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3 text-mist">
        <CameraOff size={22} className="text-amber" aria-hidden="true" />
        <p className="text-sm">
          No camera here — no problem. Pick a species below to run a demo scan.
        </p>
      </div>
      <DemoSpeciesButtons onPick={onPick} disabled={disabled} />
    </GlassCard>
  );
}

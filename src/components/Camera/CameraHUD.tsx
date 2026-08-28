import { forwardRef } from 'react';
import { ScanLine } from 'lucide-react';
import { JungleButton } from '@/components/JungleButton';
import { ScannerAnimation } from './ScannerAnimation';
import { DemoSpeciesButtons } from './DemoSpeciesButtons';

interface CameraHUDProps {
  scanning: boolean;
  onCapture: () => void;
  onPickDemo: (speciesId: string) => void;
}

/**
 * Live camera viewport with the scanner overlay + capture control.
 * The four demo buttons remain available even with a live feed so a scan can
 * always be triggered during the demo.
 */
export const CameraHUD = forwardRef<HTMLVideoElement, CameraHUDProps>(
  function CameraHUD({ scanning, onCapture, onPickDemo }, videoRef) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-card border border-white/10 bg-jungle-dark">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {scanning && <ScannerAnimation />}
        </div>

        <JungleButton
          onClick={onCapture}
          disabled={scanning}
          className="w-full"
        >
          <ScanLine size={18} aria-hidden="true" />
          {scanning ? 'Scanning…' : 'Scan what you see'}
        </JungleButton>

        <div className="space-y-2">
          <p className="text-center text-xs uppercase tracking-wide text-mist/50">
            or try a demo species
          </p>
          <DemoSpeciesButtons onPick={onPickDemo} disabled={scanning} />
        </div>
      </div>
    );
  },
);

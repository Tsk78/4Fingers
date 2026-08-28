import { useCallback, useState } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { JungleButton } from '@/components/JungleButton';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/useToast';
import { useCamera } from '@/hooks/useCamera';
import { aiAnalyzer } from '@/services/aiDemo';
import { sound } from '@/services/sound';
import type { SpeciesResult } from '@/types';
import { CameraHUD } from './CameraHUD';
import { CameraPermissionFallback } from './CameraPermissionFallback';
import { SpeciesResultCard } from './SpeciesResultCard';

export function CameraTab() {
  const { state, dispatch } = useAppState();
  const { enqueue } = useToast();
  const camera = useCamera();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SpeciesResult | null>(null);
  const [isNewUnlock, setIsNewUnlock] = useState(false);
  // Transient captured frame — LOCAL ONLY, never written to UserState (Req 4.6),
  // and discarded when the result is dismissed / on navigation away.
  const [, setCapturedFrame] = useState<string | null>(null);

  const runScan = useCallback(
    async (speciesId: string, imageDataUrl?: string) => {
      if (scanning) return;
      setScanning(true);
      try {
        const scanned = await aiAnalyzer.analyze({ speciesId, imageDataUrl });
        const alreadyUnlocked = state.unlockedSpecies.includes(scanned.id);

        dispatch({ type: 'SPECIES_UNLOCKED', payload: scanned });

        if (state.settings.sound) {
          sound.playScanChime();
          if (!alreadyUnlocked) sound.playXpTick();
        }
        if (!alreadyUnlocked) {
          enqueue(`New species unlocked: ${scanned.commonName}!`);
        }

        setIsNewUnlock(!alreadyUnlocked);
        setResult(scanned);
      } catch {
        enqueue('Scan failed — try another species.');
      } finally {
        setScanning(false);
        setCapturedFrame(null); // discard any transient frame
      }
    },
    [scanning, state.unlockedSpecies, state.settings.sound, dispatch, enqueue],
  );

  const handleCapture = useCallback(() => {
    // Grab a frame for a transient preview only, then run a demo scan.
    // In demo mode there is no classifier, so we can't derive a species from
    // the pixels — capture proves the camera path works; the scan resolves via
    // a demo species. We use the first not-yet-unlocked species, else the first.
    const frame = camera.captureFrame();
    setCapturedFrame(frame);
    const next =
      // pick something the user hasn't unlocked yet for a satisfying demo
      ['bornean-orangutan', 'malayan-tapir', 'clouded-leopard', 'two-toed-sloth'].find(
        (id) => !state.unlockedSpecies.includes(id),
      ) ?? 'bornean-orangutan';
    void runScan(next, frame ?? undefined);
  }, [camera, runScan, state.unlockedSpecies]);

  const dismissResult = useCallback(() => {
    setResult(null);
    setCapturedFrame(null);
  }, []);

  return (
    <section aria-labelledby="camera-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 id="camera-heading" className="text-2xl font-bold text-mist">
          WildDex Camera
        </h1>
        <span className="text-sm text-mist/60">
          {state.unlockedSpecies.length}/4 found
        </span>
      </div>

      {result ? (
        <SpeciesResultCard
          result={result}
          isNewUnlock={isNewUnlock}
          onDismiss={dismissResult}
        />
      ) : camera.isFallback ? (
        <CameraPermissionFallback onPick={(id) => void runScan(id)} disabled={scanning} />
      ) : camera.state === 'granted' ? (
        <CameraHUD
          ref={camera.videoRef}
          scanning={scanning}
          onCapture={handleCapture}
          onPickDemo={(id) => void runScan(id)}
        />
      ) : (
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3 text-mist">
            <CameraIcon size={22} className="text-leaf-light" aria-hidden="true" />
            <p className="text-sm">
              Point your camera at wildlife to identify it, or run a demo scan.
            </p>
          </div>
          <JungleButton
            onClick={() => void camera.requestCamera()}
            disabled={camera.state === 'requesting'}
            className="w-full"
          >
            {camera.state === 'requesting' ? 'Requesting camera…' : 'Enable camera'}
          </JungleButton>
        </GlassCard>
      )}
    </section>
  );
}

// Two synthesized audio cues (design.md §4): a scan-success chime and an
// XP-gain tick. Uses the Web Audio API so no audio asset files are needed and
// nothing is fetched over the network. Callers gate on settings.sound.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext ?? (window as unknown as {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    // Browsers suspend the context until a user gesture; resume best-effort.
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(freq: number, startOffset: number, durationSec: number, peakGain: number): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + startOffset;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, start);

  // Quick attack, smooth decay — avoids clicks.
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peakGain, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + durationSec + 0.02);
}

export const sound = {
  /** Two-note rising chime on a successful scan (Requirement 4.7). */
  playScanChime(): void {
    tone(660, 0, 0.18, 0.18); // E5
    tone(988, 0.12, 0.22, 0.18); // B5
  },

  /** Short high tick for an XP gain. */
  playXpTick(): void {
    tone(1320, 0, 0.08, 0.12);
  },
};

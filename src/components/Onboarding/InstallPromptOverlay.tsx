import { Share, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppState } from '@/hooks/useAppState';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { JungleButton } from '@/components/JungleButton';

/**
 * True when the app is already running as an installed PWA (launched from the
 * Home Screen), so the "how to install" prompt is pointless. Covers iOS Safari
 * (`navigator.standalone`) and the standard `display-mode: standalone` query.
 */
function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const displayStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  return iosStandalone || displayStandalone;
}

/**
 * iOS "Add to Home Screen" explainer (Requirement 7.1). Shown once, gated on
 * state.hasSeenInstallPrompt; dismissal is persisted via INSTALL_PROMPT_DISMISSED
 * (Requirement 7.2). Also suppressed entirely when the app is already installed
 * (running in standalone mode). Non-blocking of the underlying app when dismissed.
 */
export function InstallPromptOverlay() {
  const { state, dispatch } = useAppState();
  const reducedMotion = useReducedMotion();

  // Don't nag if already dismissed OR already installed/standalone.
  if (state.hasSeenInstallPrompt || isRunningStandalone()) return null;

  const dismiss = () => dispatch({ type: 'INSTALL_PROMPT_DISMISSED' });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-sm rounded-card border border-white/15 bg-jungle-light p-6 shadow-glass"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install instructions"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-mist/70 hover:text-mist"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <h2 id="install-title" className="pr-8 text-lg font-bold text-mist">
          Install WildDex on your iPhone
        </h2>
        <p className="mt-2 text-sm text-mist/80">
          Add WildDex to your Home Screen to use it full-screen and offline
          inside the park.
        </p>

        <ol className="mt-4 space-y-3 text-sm text-mist/90">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Share size={16} aria-hidden="true" />
            </span>
            Tap the <strong>Share</strong> button in Safari's toolbar.
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Plus size={16} aria-hidden="true" />
            </span>
            Choose <strong>Add to Home Screen</strong>.
          </li>
        </ol>

        <JungleButton onClick={dismiss} className="mt-6 w-full">
          Got it
        </JungleButton>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

/**
 * Compact settings popover: sound + reduced-motion toggles (Requirements 4.7,
 * 8.1). Both persist through shared state -> storage service.
 */
export function SettingsMenu() {
  const { state, dispatch } = useAppState();
  const [open, setOpen] = useState(false);

  const toggle = (key: 'sound' | 'reducedMotion') =>
    dispatch({ type: 'SETTINGS_CHANGED', payload: { [key]: !state.settings[key] } });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full text-mist/70 hover:text-mist"
      >
        <SettingsIcon size={22} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-56 space-y-1 rounded-card border border-white/15 bg-jungle-light p-2 shadow-glass"
        >
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={state.settings.sound}
            onClick={() => toggle('sound')}
            className="flex min-h-[44px] w-full items-center justify-between rounded-2xl px-3 py-2 text-sm text-mist hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              {state.settings.sound ? (
                <Volume2 size={18} aria-hidden="true" />
              ) : (
                <VolumeX size={18} aria-hidden="true" />
              )}
              Sound
            </span>
            <span className="text-xs text-mist/60">
              {state.settings.sound ? 'On' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={state.settings.reducedMotion}
            onClick={() => toggle('reducedMotion')}
            className="flex min-h-[44px] w-full items-center justify-between rounded-2xl px-3 py-2 text-sm text-mist hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              {state.settings.reducedMotion ? (
                <ZapOff size={18} aria-hidden="true" />
              ) : (
                <Zap size={18} aria-hidden="true" />
              )}
              Reduced motion
            </span>
            <span className="text-xs text-mist/60">
              {state.settings.reducedMotion ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

interface ProgressBarProps {
  /** 0..1 */
  ratio: number;
  label?: string;
  valueText?: string;
}

/**
 * Accessible progress bar (Requirement 8.3 ARIA, 8.5 high contrast).
 */
export function ProgressBar({ ratio, label, valueText }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm text-mist/80">
          <span>{label}</span>
          {valueText && <span>{valueText}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="h-3 w-full overflow-hidden rounded-full bg-jungle-dark/60"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-leaf to-amber transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

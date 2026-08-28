import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import type { SpeciesResult } from '@/types';
import { GlassCard } from '@/components/GlassCard';
import { JungleButton } from '@/components/JungleButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SpeciesResultCardProps {
  result: SpeciesResult;
  /** True if this scan just unlocked a new species (vs. a repeat). */
  isNewUnlock: boolean;
  onDismiss: () => void;
}

/**
 * "Species Verified" card (Requirement 4.4): photo, common + scientific name,
 * fun facts, IUCN status, and XP earned.
 */
export function SpeciesResultCard({
  result,
  isNewUnlock,
  onDismiss,
}: SpeciesResultCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
    >
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 text-leaf-light">
          <BadgeCheck size={20} aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Species Verified
          </span>
        </div>

        <img
          src={result.photoUrl}
          alt={result.commonName}
          className="h-44 w-full rounded-2xl object-cover"
        />

        <div>
          <h2 className="text-xl font-bold text-mist">{result.commonName}</h2>
          <p className="text-sm italic text-mist/70">{result.scientificName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-heat/20 px-3 py-1 text-xs font-medium text-heat-glow">
            {result.conservationStatus}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">
            <Sparkles size={14} aria-hidden="true" />
            {isNewUnlock ? `+${result.xpAwarded} XP` : 'Already discovered'}
          </span>
        </div>

        <div>
          <h3 className="mb-1 text-sm font-semibold text-mist">Fun facts</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-mist/80">
            {result.funFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>

        <JungleButton onClick={onDismiss} className="w-full">
          Keep exploring
        </JungleButton>
      </GlassCard>
    </motion.div>
  );
}

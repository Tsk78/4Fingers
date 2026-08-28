import { JungleButton } from '@/components/JungleButton';
import { SPECIES } from '@/data/species';

interface DemoSpeciesButtonsProps {
  onPick: (speciesId: string) => void;
  disabled?: boolean;
}

/**
 * The four demo species buttons (Requirement 4.2). Shared by the permission
 * fallback and the live HUD so the markup isn't duplicated (design.md §10).
 */
export function DemoSpeciesButtons({ onPick, disabled }: DemoSpeciesButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SPECIES.map((species) => (
        <JungleButton
          key={species.id}
          variant="secondary"
          disabled={disabled}
          onClick={() => onPick(species.id)}
          className="w-full text-sm"
        >
          {species.commonName}
        </JungleButton>
      ))}
    </div>
  );
}

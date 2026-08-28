import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { JungleButton } from '@/components/JungleButton';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/useToast';
import { ParkMap } from './ParkMap';
import { HABITAT_NODES, DOUBLE_XP_QUEST_ID, type HabitatId } from '@/data/map';

// Exact toast text mandated by Requirement 3.3 — do not paraphrase.
const PEAK_TRAFFIC_TOAST =
  'Heavy crowd at Orangutan exhibit! Double XP Quest unlocked at Fragile Forest.';

export function MapTab() {
  const { dispatch } = useAppState();
  const { enqueue } = useToast();

  // Local, non-persisted UI state (design.md §5.2).
  const [crowdedNodeId, setCrowdedNodeId] = useState<HabitatId | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [selectedNode, setSelectedNode] = useState<HabitatId | null>(null);

  const handleNodeTap = (id: HabitatId) => {
    setSelectedNode(id);
    const node = HABITAT_NODES.find((n) => n.id === id);
    if (node) {
      dispatch({ type: 'EXHIBIT_VISITED', payload: { exhibitId: node.exhibitId } });
    }
  };

  const handleSimulatePeakTraffic = () => {
    // Orangutan turns red (heat zone), route animates to Fragile Forest,
    // destination pulses — all local UI state.
    setCrowdedNodeId('orangutan');
    setShowRoute(true);
    // Toast (queued, one at a time) + persist the unlocked quest to shared state.
    enqueue(PEAK_TRAFFIC_TOAST);
    dispatch({ type: 'QUEST_UNLOCKED', payload: { questId: DOUBLE_XP_QUEST_ID } });
  };

  const selected = selectedNode
    ? HABITAT_NODES.find((n) => n.id === selectedNode)
    : null;

  return (
    <section aria-labelledby="map-heading" className="space-y-4">
      <h1 id="map-heading" className="text-2xl font-bold text-mist">
        Park Map
      </h1>

      <ParkMap
        crowdedNodeId={crowdedNodeId}
        showRoute={showRoute}
        onNodeTap={handleNodeTap}
      />

      {selected && (
        <GlassCard>
          <h2 className="text-lg font-semibold text-mist">{selected.name}</h2>
          <p className="mt-1 text-sm text-mist/80">{selected.blurb}</p>
        </GlassCard>
      )}

      <JungleButton
        variant="danger"
        onClick={handleSimulatePeakTraffic}
        className="w-full"
      >
        Simulate Peak Traffic
      </JungleButton>
    </section>
  );
}

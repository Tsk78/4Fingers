import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppStateProvider } from '@/context/AppStateContext';
import { ToastProvider } from '@/components/Toast';
import { BottomNavigation, type TabId } from '@/components/BottomNavigation';
import { MapTab } from '@/components/Map/MapTab';
import { CameraTab } from '@/components/Camera/CameraTab';
import { QuestsTab } from '@/components/Quests/QuestsTab';
import { JournalTab } from '@/components/Journal/JournalTab';

function CurrentTab({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'map':
      return <MapTab />;
    case 'camera':
      return <CameraTab />;
    case 'quests':
      return <QuestsTab />;
    case 'journal':
      return <JournalTab />;
    default:
      return null;
  }
}

function AppContent() {
  // Local tab-switch state — no router (design.md §2).
  const [activeTab, setActiveTab] = useState<TabId>('map');

  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle to-jungle-dark text-mist">
      <main className="mx-auto max-w-md px-4 pb-28 pt-6">
        <CurrentTab tab={activeTab} />
      </main>
      <BottomNavigation active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppStateProvider>
    </ErrorBoundary>
  );
}

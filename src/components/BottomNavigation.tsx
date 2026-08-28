import { Map, Camera, Trophy, BookOpen, type LucideIcon } from 'lucide-react';

export type TabId = 'map' | 'camera' | 'quests' | 'journal';

interface TabDef {
  id: TabId;
  label: string;
  Icon: LucideIcon;
}

const TABS: readonly TabDef[] = [
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'camera', label: 'Camera', Icon: Camera },
  { id: 'quests', label: 'Quests', Icon: Trophy },
  { id: 'journal', label: 'Journal', Icon: BookOpen },
] as const;

interface BottomNavigationProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-jungle-dark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-glass"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                className={`flex min-h-[56px] w-full flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-leaf-light' : 'text-mist/60 hover:text-mist'
                }`}
              >
                <Icon size={22} aria-hidden="true" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ViewMode = 'simple' | 'advanced';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  defaultNetuid: number;
  defaultHotkey: string;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  
  // Default values for simple mode
  const defaultNetuid = 10;
  const defaultHotkey = "5FyUNRQ26cvNwCPGobiNiabcVsRksczDE8mKxHvQSebNEBcD";

  return (
    <ViewModeContext.Provider value={{
      viewMode,
      setViewMode,
      defaultNetuid,
      defaultHotkey
    }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};

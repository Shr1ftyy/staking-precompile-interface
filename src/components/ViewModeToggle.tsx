import React from 'react';
import { Settings, Zap } from 'lucide-react';
import { useViewMode } from '../contexts/ViewModeContext';

export const ViewModeToggle: React.FC = () => {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-neutral-900 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
      <button
        onClick={() => setViewMode('simple')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'simple'
            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <Zap size={16} className="mr-2" />
        Simple
      </button>
      <button
        onClick={() => setViewMode('advanced')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'advanced'
            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
      >
        <Settings size={16} className="mr-2" />
        Advanced
      </button>
    </div>
  );
};

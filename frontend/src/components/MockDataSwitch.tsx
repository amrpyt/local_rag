import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

const MockDataSwitch = () => {
  const { useMockData, toggleMockData } = useProject();

  return (
    <div className="flex items-center space-x-2 bg-card p-3 rounded-lg border">
      <Switch
        id="mock-data-mode"
        checked={useMockData}
        onCheckedChange={toggleMockData}
      />
      <Label htmlFor="mock-data-mode" className="font-semibold">
        {useMockData ? 'Mock Data On' : 'Live Data'}
      </Label>
    </div>
  );
};

export default MockDataSwitch; 
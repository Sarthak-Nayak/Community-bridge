import React, { createContext, useContext, useState, useCallback } from 'react';
import { NeedReport, Volunteer, NGO, mockNeeds, mockVolunteers, mockNGOs } from '@/lib/mockData';
 
interface AppState {
  needs: NeedReport[];
  volunteers: Volunteer[];
  ngos: NGO[];
  isOnline: boolean;
  syncingCount: number;
  addNeed: (need: Omit<NeedReport, 'id' | 'createdAt' | 'status'>) => void;
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'tasksCompleted' | 'avatar'>) => void;
  addNGO: (ngo: Omit<NGO, 'id' | 'logo'>) => void;
  toggleOnline: () => void;
  acceptNeed: (needId: string, ngoName: string) => void;
  resolveNeed: (needId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [needs, setNeeds] = useState<NeedReport[]>(mockNeeds);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [ngos, setNGOs] = useState<NGO[]>(mockNGOs);
  const [isOnline, setIsOnline] = useState(true);
  const [syncingCount, setSyncingCount] = useState(0);

  const addNeed = useCallback((need: Omit<NeedReport, 'id' | 'createdAt' | 'status'>) => {
    const newNeed: NeedReport = {
      ...need,
      id: `n${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setNeeds(prev => [newNeed, ...prev]);
  }, []);

  const addVolunteer = useCallback((vol: Omit<Volunteer, 'id' | 'tasksCompleted' | 'avatar'>) => {
    const newVol: Volunteer = {
      ...vol,
      id: `v${Date.now()}`,
      tasksCompleted: 0,
      avatar: vol.name.split(' ').map(n => n[0]).join('').slice(0, 2),
    };
    setVolunteers(prev => [...prev, newVol]);
  }, []);

  const addNGO = useCallback((ngo: Omit<NGO, 'id' | 'logo'>) => {
    const newNGO: NGO = {
      ...ngo,
      id: `ngo${Date.now()}`,
      logo: ngo.name.slice(0, 2).toUpperCase(),
    };
    setNGOs(prev => [...prev, newNGO]);
  }, []);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      if (!prev) {
        // Going online - sync pending
        const pendingCount = needs.filter(n => n.syncStatus === 'pending').length;
        if (pendingCount > 0) {
          setSyncingCount(pendingCount);
          setTimeout(() => {
            setNeeds(prevNeeds => prevNeeds.map(n => n.syncStatus === 'pending' ? { ...n, syncStatus: 'synced' as const } : n));
            setSyncingCount(0);
          }, 2500);
        }
      }
      return !prev;
    });
  }, [needs]);

  const acceptNeed = useCallback((needId: string, ngoName: string) => {
    setNeeds(prev => prev.map(n => n.id === needId ? { ...n, acceptedBy: ngoName, status: 'assigned' as const } : n));
  }, []);

  const resolveNeed = useCallback((needId: string) => {
    setNeeds(prev => prev.map(n => n.id === needId ? { ...n, status: 'resolved' as const } : n));
  }, []);

  return (
    <AppContext.Provider value={{ needs, volunteers, ngos, isOnline, syncingCount, addNeed, addVolunteer, addNGO, toggleOnline, acceptNeed, resolveNeed }}>
      {children}
    </AppContext.Provider>
  );
};

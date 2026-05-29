// CarLine — in-memory pub/sub store
// Provides shared reactive state between parent and staff views.
// Replace the transport layer here to point at a real backend WebSocket.

import { create } from 'zustand';
import type { QueueEntry, PickupRequest, PickupStatus } from '../models';
import { dataSource } from '../data/provider';

interface CarLineStore {
  // Shared queue state (parent + staff see the same data)
  queue: QueueEntry[];
  setQueue: (queue: QueueEntry[]) => void;

  // Active parent requests (keyed by requestId)
  activeRequests: PickupRequest[];
  addRequest: (req: PickupRequest) => void;
  updateRequestStatus: (requestId: string, status: PickupStatus) => void;

  // Staff: advance a queue entry
  advanceQueueEntry: (requestId: string) => Promise<void>;

  // Bootstrap: subscribe to data source real-time updates
  subscribeToQueue: () => () => void;
}

export const useStore = create<CarLineStore>((set, get) => ({
  queue: [],
  activeRequests: [],

  setQueue: (queue) => set({ queue }),

  addRequest: (req) =>
    set(state => ({ activeRequests: [...state.activeRequests, req] })),

  updateRequestStatus: (requestId, status) =>
    set(state => ({
      activeRequests: state.activeRequests.map(r =>
        r.id === requestId ? { ...r, status } : r
      ),
    })),

  advanceQueueEntry: async (requestId) => {
    await dataSource.advanceRequestStatus(requestId);
    // Real-time update arrives via subscribeToQueue callback
  },

  subscribeToQueue: () => {
    const unsub = dataSource.subscribeToQueueChanges(queue => {
      set({ queue });
    });
    return unsub;
  },
}));

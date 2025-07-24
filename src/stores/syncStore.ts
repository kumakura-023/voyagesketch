import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { SyncState, SyncOperation, MemoState } from '@/types/sync';

interface SyncStoreState extends SyncState {
  // メモの状態管理（場所ID -> メモ状態）
  memoStates: Record<string, MemoState>;
}

interface SyncStoreActions {
  // 基本操作
  setOnlineStatus: (isOnline: boolean) => void;
  addPendingOperation: (operation: SyncOperation) => void;
  completePendingOperation: (operationId: string) => void;
  clearPendingOperations: () => void;
  
  // メモ状態管理
  setLocalMemo: (placeId: string, value: string) => void;
  setSyncedMemo: (placeId: string, value: string) => void;
  setMemoSyncing: (placeId: string, isSyncing: boolean) => void;
  getMemoState: (placeId: string) => MemoState | undefined;
}

export const useSyncStore = create<SyncStoreState & SyncStoreActions>()(
  immer((set, get) => ({
    // State
    isOnline: navigator.onLine,
    pendingOperations: [],
    lastSyncTime: 0,
    conflictResolution: 'local_wins',
    memoStates: {},

    // Actions
    setOnlineStatus: (isOnline) => set((state) => {
      state.isOnline = isOnline;
    }),

    addPendingOperation: (operation) => set((state) => {
      state.pendingOperations.push(operation);
    }),

    completePendingOperation: (operationId) => set((state) => {
      state.pendingOperations = state.pendingOperations.filter(
        op => op.id !== operationId
      );
    }),

    clearPendingOperations: () => set((state) => {
      state.pendingOperations = [];
    }),

    // メモ状態管理
    setLocalMemo: (placeId, value) => set((state) => {
      if (!state.memoStates[placeId]) {
        state.memoStates[placeId] = {
          localValue: value,
          syncedValue: '',
          lastLocalUpdate: Date.now(),
          lastSyncUpdate: 0,
          isLocalDirty: true,
          isSyncing: false,
        };
      } else {
        state.memoStates[placeId].localValue = value;
        state.memoStates[placeId].lastLocalUpdate = Date.now();
        state.memoStates[placeId].isLocalDirty = true;
      }
    }),

    setSyncedMemo: (placeId, value) => set((state) => {
      if (!state.memoStates[placeId]) {
        state.memoStates[placeId] = {
          localValue: value,
          syncedValue: value,
          lastLocalUpdate: 0,
          lastSyncUpdate: Date.now(),
          isLocalDirty: false,
          isSyncing: false,
        };
      } else {
        state.memoStates[placeId].syncedValue = value;
        state.memoStates[placeId].lastSyncUpdate = Date.now();
        state.memoStates[placeId].isLocalDirty = false;
        state.memoStates[placeId].isSyncing = false;
      }
    }),

    setMemoSyncing: (placeId, isSyncing) => set((state) => {
      if (state.memoStates[placeId]) {
        state.memoStates[placeId].isSyncing = isSyncing;
      }
    }),

    getMemoState: (placeId) => {
      return get().memoStates[placeId];
    },
  }))
);
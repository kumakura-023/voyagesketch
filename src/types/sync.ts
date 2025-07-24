// 新しい同期システムの型定義（問題解決版）
export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  userId: string;
  timestamp: number;
  planId: string;
  data: any;
  status: 'pending' | 'completed' | 'failed';
}

export type SyncOperationType = 
  | 'memo_update'
  | 'place_add'
  | 'place_update'
  | 'place_delete'
  | 'plan_update'
  | 'route_update';

export interface SyncState {
  isOnline: boolean;
  pendingOperations: SyncOperation[];
  lastSyncTime: number;
  conflictResolution: 'local_wins' | 'remote_wins' | 'merge';
}

// UI状態とクラウド状態の分離
export interface MemoState {
  // UI状態（即座反映）
  localValue: string;
  // 同期状態
  syncedValue: string;
  // メタデータ
  lastLocalUpdate: number;
  lastSyncUpdate: number;
  isLocalDirty: boolean;
  isSyncing: boolean;
}
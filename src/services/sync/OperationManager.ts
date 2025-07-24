import { v4 as uuidv4 } from 'uuid';
import type { SyncOperation, SyncOperationType } from '@/types/sync';

class OperationManager {
  private pendingOperations = new Map<string, SyncOperation>();
  private recentOperations = new Map<string, number>(); // operationId -> timestamp
  private currentUserId: string | null = null;

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  createOperation(
    type: SyncOperationType,
    planId: string,
    data: any
  ): SyncOperation {
    const operation: SyncOperation = {
      id: uuidv4(),
      type,
      userId: this.currentUserId || 'anonymous',
      timestamp: Date.now(),
      planId,
      data,
      status: 'pending',
    };

    this.pendingOperations.set(operation.id, operation);
    this.recentOperations.set(operation.id, operation.timestamp);

    // 古い操作履歴をクリーンアップ（10分以上前）
    this.cleanupOldOperations();

    return operation;
  }

  markOperationCompleted(operationId: string) {
    const operation = this.pendingOperations.get(operationId);
    if (operation) {
      operation.status = 'completed';
      this.pendingOperations.delete(operationId);
    }
  }

  markOperationFailed(operationId: string) {
    const operation = this.pendingOperations.get(operationId);
    if (operation) {
      operation.status = 'failed';
      // 失敗した操作も一旦削除（リトライ機能は後で追加）
      this.pendingOperations.delete(operationId);
    }
  }

  // 操作が自分のものかどうかを判定
  isOwnOperation(operationId: string, userId: string): boolean {
    return this.recentOperations.has(operationId) && 
           this.currentUserId === userId;
  }

  // 最近の操作かどうかを判定（Firebase通知遅延を考慮）
  isRecentOperation(operationId: string): boolean {
    const timestamp = this.recentOperations.get(operationId);
    if (!timestamp) return false;

    const now = Date.now();
    return (now - timestamp) < 15000; // 15秒以内なら最近の操作
  }

  getPendingOperations(): SyncOperation[] {
    return Array.from(this.pendingOperations.values());
  }

  private cleanupOldOperations() {
    const now = Date.now();
    const cutoff = 10 * 60 * 1000; // 10分

    for (const [operationId, timestamp] of this.recentOperations.entries()) {
      if (now - timestamp > cutoff) {
        this.recentOperations.delete(operationId);
      }
    }
  }
}

export const operationManager = new OperationManager();
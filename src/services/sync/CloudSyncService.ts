import { 
  doc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { operationManager } from './OperationManager';
import type { Plan } from '@/types/core';
import type { SyncOperation } from '@/types/sync';

class CloudSyncService {
  private listeners = new Map<string, Unsubscribe>();

  async syncPlanToCloud(plan: Plan, operation: SyncOperation): Promise<void> {
    try {
      const planRef = doc(db, 'plans', plan.id);
      
      // Firestoreに保存するデータ（操作メタデータ付き）
      const firestoreData = {
        ...plan,
        updatedAt: serverTimestamp(),
        lastOperationId: operation.id,
        lastOperatorId: operation.userId,
        lastOperationType: operation.type,
        // 日付オブジェクトをTimestampに変換
        startDate: plan.startDate ? plan.startDate : null,
        endDate: plan.endDate ? plan.endDate : null,
        places: plan.places.map(place => ({
          ...place,
          createdAt: place.createdAt,
          updatedAt: place.updatedAt,
        })),
      };

      await updateDoc(planRef, firestoreData);
      
      // 操作を完了としてマーク
      operationManager.markOperationCompleted(operation.id);
      
      console.log(`Plan synced to cloud with operation ${operation.id}`);
    } catch (error) {
      console.error('Cloud sync failed:', error);
      operationManager.markOperationFailed(operation.id);
      throw error;
    }
  }

  subscribeToRealtimeUpdates(
    planId: string,
    onUpdate: (plan: Plan, isOwnOperation: boolean) => void
  ): Unsubscribe {
    // 既存のリスナーがあれば削除
    this.unsubscribeFromPlan(planId);

    const planRef = doc(db, 'plans', planId);
    
    const unsubscribe = onSnapshot(planRef, (doc) => {
      if (!doc.exists()) {
        console.warn(`Plan ${planId} does not exist`);
        return;
      }

      const data = doc.data();
      
      // 操作メタデータを使用した自己更新判定
      const lastOperationId = data.lastOperationId;
      const lastOperatorId = data.lastOperatorId;
      
      const isOwnOperation = this.isOwnOperation(lastOperationId, lastOperatorId);
      
      if (isOwnOperation) {
        console.log('Self-update detected via operation metadata, skipping');
        return;
      }

      // FirestoreデータをPlan型に変換
      const plan: Plan = {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        isPublic: data.isPublic || false,
        members: data.members || [],
        createdBy: data.createdBy || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        places: data.places?.map((place: any) => ({
          ...place,
          createdAt: place.createdAt?.toDate() || new Date(),
          updatedAt: place.updatedAt?.toDate() || new Date(),
        })) || [],
        lastOperationId: data.lastOperationId,
        lastOperatorId: data.lastOperatorId,
      };

      onUpdate(plan, false);
    }, (error) => {
      console.error('Realtime listener error:', error);
    });

    this.listeners.set(planId, unsubscribe);
    return unsubscribe;
  }

  private isOwnOperation(operationId?: string, operatorId?: string): boolean {
    if (!operationId || !operatorId) {
      return false;
    }

    // 操作IDとユーザーIDの両方で判定
    return operationManager.isOwnOperation(operationId, operatorId) ||
           operationManager.isRecentOperation(operationId);
  }

  unsubscribeFromPlan(planId: string) {
    const listener = this.listeners.get(planId);
    if (listener) {
      listener();
      this.listeners.delete(planId);
    }
  }

  unsubscribeAll() {
    this.listeners.forEach(listener => listener());
    this.listeners.clear();
  }
}

export const cloudSyncService = new CloudSyncService();
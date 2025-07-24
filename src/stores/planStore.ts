import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Plan, Place } from '@/types/core';

interface PlanState {
  currentPlan: Plan | null;
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

interface PlanActions {
  setCurrentPlan: (plan: Plan | null) => void;
  setPlans: (plans: Plan[]) => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (planId: string, updates: Partial<Plan>) => void;
  deletePlan: (planId: string) => void;
  
  // 場所関連
  addPlace: (planId: string, place: Place) => void;
  updatePlace: (planId: string, placeId: string, updates: Partial<Place>) => void;
  deletePlace: (planId: string, placeId: string) => void;
  
  // ユーティリティ
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePlanStore = create<PlanState & PlanActions>()(
  immer((set, get) => ({
    // State
    currentPlan: null,
    plans: [],
    isLoading: false,
    error: null,

    // Actions
    setCurrentPlan: (plan) => set((state) => {
      state.currentPlan = plan;
    }),

    setPlans: (plans) => set((state) => {
      state.plans = plans;
    }),

    addPlan: (plan) => set((state) => {
      state.plans.push(plan);
    }),

    updatePlan: (planId, updates) => set((state) => {
      const index = state.plans.findIndex(p => p.id === planId);
      if (index !== -1) {
        Object.assign(state.plans[index], updates);
      }
      if (state.currentPlan?.id === planId) {
        Object.assign(state.currentPlan, updates);
      }
    }),

    deletePlan: (planId) => set((state) => {
      state.plans = state.plans.filter(p => p.id !== planId);
      if (state.currentPlan?.id === planId) {
        state.currentPlan = null;
      }
    }),

    // 場所関連
    addPlace: (planId, place) => set((state) => {
      const plan = state.plans.find(p => p.id === planId);
      if (plan) {
        plan.places.push(place);
        plan.updatedAt = new Date();
      }
      if (state.currentPlan?.id === planId) {
        state.currentPlan.places.push(place);
        state.currentPlan.updatedAt = new Date();
      }
    }),

    updatePlace: (planId, placeId, updates) => set((state) => {
      const plan = state.plans.find(p => p.id === planId);
      if (plan) {
        const placeIndex = plan.places.findIndex(p => p.id === placeId);
        if (placeIndex !== -1) {
          Object.assign(plan.places[placeIndex], updates);
          plan.updatedAt = new Date();
        }
      }
      if (state.currentPlan?.id === planId) {
        const placeIndex = state.currentPlan.places.findIndex(p => p.id === placeId);
        if (placeIndex !== -1) {
          Object.assign(state.currentPlan.places[placeIndex], updates);
          state.currentPlan.updatedAt = new Date();
        }
      }
    }),

    deletePlace: (planId, placeId) => set((state) => {
      const plan = state.plans.find(p => p.id === planId);
      if (plan) {
        plan.places = plan.places.filter(p => p.id !== placeId);
        plan.updatedAt = new Date();
      }
      if (state.currentPlan?.id === planId) {
        state.currentPlan.places = state.currentPlan.places.filter(p => p.id !== placeId);
        state.currentPlan.updatedAt = new Date();
      }
    }),

    // ユーティリティ
    setLoading: (loading) => set((state) => {
      state.isLoading = loading;
    }),

    setError: (error) => set((state) => {
      state.error = error;
    }),

    clearError: () => set((state) => {
      state.error = null;
    }),
  }))
);
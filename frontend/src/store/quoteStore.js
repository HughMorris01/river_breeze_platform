import { create } from 'zustand';

export const useQuoteStore = create((set) => ({
  // Initial state
  serviceType: null,
  propertyDetails: {
    squareFootage: 2000,
    bedrooms: 3,
    bathrooms: 2,
  },
  
  // Actions to update the state
  setServiceType: (type) => set({ serviceType: type }),
  
  setPropertyDetails: (details) => set((state) => ({ 
    propertyDetails: { ...state.propertyDetails, ...details } 
  })),
}));
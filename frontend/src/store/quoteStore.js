import { create } from 'zustand';

export const useQuoteStore = create((set) => ({
  serviceType: null,
  propertyDetails: {
    squareFootage: 2000,
    bedrooms: 3,
    bathrooms: 2,
    additionalRooms: 0,
    hasPets: false,
  },
  // Contact State
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  addOns: [],

  setServiceType: (type) => set({ serviceType: type }),
  setPropertyDetails: (details) => set((state) => ({ 
    propertyDetails: { ...state.propertyDetails, ...details } 
  })),
  // New Contact Action
  setContactInfo: (info) => set((state) => ({
    contactInfo: { ...state.contactInfo, ...info }
  })),

  toggleAddOn: (addOn) => set((state) => {
    const currentAddOns = state.addOns;
    if (currentAddOns.includes(addOn)) {
      return { addOns: currentAddOns.filter(item => item !== addOn) };
    } else {
      return { addOns: [...currentAddOns, addOn] };
    }
  }),
}));
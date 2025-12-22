import create from 'zustand';

const useTraceabilityStore = create((set) => ({
  lots: [],
  selectedLot: null,
  isLoading: false,

  setLots: (lots) => set({ lots }),
  setSelectedLot: (lot) => set({ selectedLot: lot }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useTraceabilityStore;

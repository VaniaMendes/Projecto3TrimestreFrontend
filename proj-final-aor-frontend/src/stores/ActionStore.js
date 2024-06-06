import { create } from "zustand";

export const useActionsStore = create((set) => ({
    isModalOpen : false,
    updateIsModalOpen : (isModalOpen) => set({isModalOpen}),    
    
    isSliderOpen : false,
    updateIsSliderOpen : (isSliderOpen) => set({isSliderOpen}),

    resetUseActionsStore: () => set({ isModalOpen : false, isModalOpen : false}),

}));
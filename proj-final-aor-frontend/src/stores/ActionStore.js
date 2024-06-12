import { create } from "zustand";

export const useActionsStore = create((set) => ({
    isModalOpen : false,
    updateIsModalOpen : (isModalOpen) => set({isModalOpen}),    
    
    isSliderOpen : false,
    updateIsSliderOpen : (isSliderOpen) => set({isSliderOpen}),

    stateId: 1,
    updateStateId: (stateId) => set({ stateId }),

    sortBy: 'desc',
    updateSortBy: (sortBy) => set({ sortBy }),

    vacancies: false,
    updateVacancies: (vacancies) => set({ vacancies }),

    areProjectsFromKeyword: false,
    updateAreProjectsFromKeyword: (areProjectsFromKeyword) => set({ areProjectsFromKeyword }),

    resetUseActionsStore: () => set({ isModalOpen : false, 
                                        isSliderOpen : false, 
                                        stateId: 1, 
                                        sortBy: 'desc', 
                                        vacancies: false, 
                                        areProjectsFromKeyword: false}),

}));
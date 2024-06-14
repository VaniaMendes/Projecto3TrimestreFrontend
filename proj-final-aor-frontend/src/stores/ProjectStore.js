import { create } from "zustand";

export const useProjectStore = create((set) => ({
    projectData : [],
    updateProjectData : (projectData) => set({projectData}),    
    
    resetUseActionsStore: () => set({ projectData : []}),

}));
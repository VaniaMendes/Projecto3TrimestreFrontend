import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const userStore = create (
    persist (
        (set) => ({
            token:'', //state variable
            updateToken : (token) => set({token}),

            name:'',
            updateName : (name) => set({name}),

            userData:[],
            updateUserData: (newUserData) => set({ userData: newUserData }),

            locale:"en",
            updateLocale : (locale) => set({ locale }),

            userId: null, 
            updateUserId: (userId) => set({ userId }),

            photo:'',
            updatePhoto : (photo) => set({ photo }),
            
            typeUser:'',
            updateTypeUser : (typeUser) => set({ typeUser }),

            resetUserStore: () => set({ token: '', userData: [], locale: 'en', userId: null, name: '', photo:''}),
        }),
        {
            name: 'userStore',
            storage: createJSONStorage(() => sessionStorage),
        }

    )
);
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export const userStore = create (
    persist (
        (set) => ({
            token:'', //state variable
            updateToken : (token) => set({token}),
            resetUserStore: () => set({ token: '', userData: [], locale: 'en'}),    

            userData:[],
            updateUserData: (newUserData) => set({ userData: newUserData }),

            locale:"en",
            updateLocale : (locale) => set({ locale }),


            userId: null, 
            updateUserId: (userId) => set({ userId })
        }),
        {
            name: 'userStore',
            storage: createJSONStorage(() => sessionStorage),
        }

    )
);
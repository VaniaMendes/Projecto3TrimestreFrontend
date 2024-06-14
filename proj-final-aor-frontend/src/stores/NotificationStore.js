import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const notificationStore = create(
    persist(
        (set) => ({
       
            notifications: [], 
            updateNotifications: (notifications) => set({ notifications }), 
            addNotification: (newNotification) => set((state) => ({ notifications: [...state.notifications, newNotification] })),
            clearNotifications: () => set({ notifications: [] }),
            setNotifications: (newNotifications) => set({ notifications: newNotifications }),

        }),
        {
            name: 'mystore',
            storage: createJSONStorage(() => localStorage)
        }
    )
);




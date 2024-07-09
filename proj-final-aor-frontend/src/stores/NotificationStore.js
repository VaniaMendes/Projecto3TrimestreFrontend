import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const notificationStore = create(
    persist(
        (set) => ({
            notifications: 0, 
            updateNotifications: (notifications) => set({ notifications }),
            incrementNotification: () => set((state) => ({ notifications: state.notifications + 1 })), // Incrementa notifications
            clearNotifications: () => set({ notifications: 0 }), 
            setNotifications: (newNotifications) => set({ notifications: newNotifications }),



           
        }),
        {
            name: 'mystore',
            storage: createJSONStorage(() => localStorage),
        }
    )
);


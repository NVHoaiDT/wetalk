import { create } from 'zustand';

type MessagesStore = {
  isOpen: boolean;
  selectedConversationId: number | null;
  unreadCount: number;

  openMessages: () => void;
  closeMessages: () => void;
  toggleMessages: () => void;
  selectConversation: (id: number | null) => void;
  setUnreadCount: (count: number) => void;
};

export const useMessages = create<MessagesStore>((set) => ({
  isOpen: false,
  selectedConversationId: null,
  unreadCount: 0,

  openMessages: () => set({ isOpen: true }),
  closeMessages: () => set({ isOpen: false, selectedConversationId: null }),
  toggleMessages: () => set((state) => ({ isOpen: !state.isOpen })),
  selectConversation: (id) => set({ selectedConversationId: id }),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

import { create } from 'zustand';

type MessagesStore = {
  isOpen: boolean;
  selectedConversationId: number | null;
  selectedRecipient: {
    id: number;
    username: string;
    avatar: string;
  } | null;
  unreadCount: number;

  openMessages: () => void;
  closeMessages: () => void;
  toggleMessages: () => void;
  selectConversation: (id: number | null) => void;
  selectRecipient: (recipient: {
    id: number;
    username: string;
    avatar: string;
  }) => void;
  setUnreadCount: (count: number) => void;
};

export const useMessages = create<MessagesStore>((set) => ({
  isOpen: false,
  selectedConversationId: null,
  selectedRecipient: null,
  unreadCount: 0,

  openMessages: () => set({ isOpen: true }),
  closeMessages: () => set({ isOpen: false, selectedConversationId: null }),
  toggleMessages: () => set((state) => ({ isOpen: !state.isOpen })),
  selectConversation: (id) => set({ selectedConversationId: id }),
  selectRecipient: (recipient) => set({ selectedRecipient: recipient }),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

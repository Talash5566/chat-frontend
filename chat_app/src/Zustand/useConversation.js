
import { create } from 'zustand';

const useConversation = create((set) => ({

  selectedConversation: null,


  setselectedConversation: (user) => set({ selectedConversation: user }),


  clearSelectedConversation: () => set({ selectedConversation: null }),


  messages: [],

 
  setmessages: (messages) => {
    const uniqueMessages = Array.from(
      new Map(messages.map((msg) => [msg._id, msg])).values()
    );
    set({ messages: uniqueMessages });
  },


  addMessage: (message) =>
    set((state) => {
      const alreadyExists = state.messages.some((m) => m._id === message._id);
      if (!alreadyExists) {
        return { messages: [...state.messages, message] };
      }
      return {};
    }),

  conversations: [],

  setConversations: (conversations) => set({ conversations }),


  updateConversationPreview: (id, lastMessage) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === id
          ? { ...conv, lastMessage, updatedAt: new Date() }
          : conv
      ),
    })),
}));

export default useConversation;

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/AuthContext';
import useConversation from '../Zustand/useConversation';
import { FiSend, FiImage, FiSmile } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSocketContext } from '../Context/SocketContext';

const RightSide = () => {
  const [initialLoadDone, setInitialLoadDone] = useState(false);


  const { socket } = useSocketContext();
  const {
    messages,
    setmessages,
    selectedConversation,
    addMessage,
    updateConversationPreview,
  } = useConversation();
  const { authUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!socket) return;
  
    const handleNewMessage = (incomingMessage) => {
      const isRelated =
        incomingMessage.senderId === selectedConversation?._id ||
        incomingMessage.reciverId === selectedConversation?._id;
  
      if (isRelated) {
        addMessage(incomingMessage);
  
       
        if (initialLoadDone) {
          scrollToBottom();
        }
      }
    };
  
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, selectedConversation, initialLoadDone]);
  

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;

      try {
        const token = JSON.parse(localStorage.getItem('chat-app'))?.token;
        const res = await axios.get(
          `${BASE_URL}/message/${selectedConversation._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
          },
         
        );
  
        
        if (Array.isArray(res.data)) {
          setmessages(res.data);
          setInitialLoadDone(true);
          return;
        }
  
       
        toast.error('Something went wrong while loading messages.');
      } catch (err) {
        
        if (err.response?.status === 404 || err.response?.data === '') {
          setmessages([]);
          return;
        }
        
      }
    };
  
    fetchMessages();
  }, [selectedConversation]);
  
  
  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const token = JSON.parse(localStorage.getItem('chat-app'))?.token;
      const res = await axios.post(
        `${BASE_URL}/message/send/${selectedConversation._id}`,
        { message: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );

      addMessage(res.data);
      setNewMessage('');
      updateConversationPreview(selectedConversation._id, res.data.message);
      window.dispatchEvent(new Event('messageSent'));
      scrollToBottom();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full w-full text-center">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-indigo-600"
        >
          Select a conversation to chat 🚀
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.length > 0 ? (
          messages.map((msg) => (
            <Message key={msg._id} message={msg} isMe={msg.senderId === authUser._id} />
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 text-gray-500">
            <FiSmile />
          </button>
          <button className="p-2 text-gray-500">
            <FiImage />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 mx-2 py-2 px-4 text-black rounded-full border border-gray-300"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${newMessage.trim() ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

const Message = ({ message, isMe }) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`px-4 py-2 rounded-2xl shadow ${
          isMe
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        } max-w-xs`}
      >
        <p className="text-sm">{message.message}</p>
        <p className="text-xs text-right mt-1 opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default RightSide;

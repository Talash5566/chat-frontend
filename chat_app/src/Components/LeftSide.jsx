import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../Zustand/useConversation';
import { useSocketContext } from '../Context/SocketContext';
import { useAuth } from '../Context/AuthContext'; 

const LeftSide = () => {
  const { onlineUsers } = useSocketContext();
  const { setselectedConversation } = useConversation();
  const { authUser } = useAuth(); 

  const [searchuser, setSearchuser] = useState([]);
  const [conversdata, setConversdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [inputnames, setInputnames] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const conversationData = async () => {
    const token = JSON.parse(localStorage.getItem('chat-app'))?.token;
    if (!token) return;

    setConversationLoading(true);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${BASE_URL}/user/currentchatters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true 
      });

      setConversdata(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load conversations');
    } finally {
      setConversationLoading(false);
    }
  };

  useEffect(() => {
    conversationData();
    const handleMessageSent = () => conversationData();
    window.addEventListener("messageSent", handleMessageSent);
    return () => window.removeEventListener("messageSent", handleMessageSent);
  }, []);

  const searchfunction = async (e) => {
    e.preventDefault();
    if (!inputnames.trim()) return toast.info('Enter a name to search');

    setLoading(true);
    const token = JSON.parse(localStorage.getItem("chat-app"))?.token;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await axios.get(`${BASE_URL}/user/search?search=${inputnames}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true 
      });

      setSearchuser(res.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (user) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const token = JSON.parse(localStorage.getItem('chat-app'))?.token;

      const res = await axios.post(
        `${BASE_URL}/user/conversation/start/${user._id}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true 
        }
      );

      setselectedConversation(res.data);
      setSelectedUserId(user._id);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to start chat');
    }
  };

  return (
    <div className="w-full h-full flex flex-col border-r border-gray-200 bg-white">

      {/*  Search + Login */}
      <div className="p-4 border-b border-gray-200">
  <div className="flex items-center justify-between gap-2">
    {/* Search Bar */}
    <form onSubmit={searchfunction} className="flex flex-grow items-center max-w-[75%]">
      <input
        value={inputnames}
        onChange={(e) => setInputnames(e.target.value)}
        type="text"
        placeholder="Search users..."
        className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={loading || !inputnames.trim()}
        className={`px-3 py-2 text-sm bg-indigo-600 text-white rounded-r-md ${
          loading || !inputnames.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
      >
        {loading ? '...' : 'Go'}
      </button>
    </form>

    {/* Login Button */}
    <button
      onClick={() => {
        if (authUser=== null) {
          window.location.href = '/login';
        } else {
          toast.info('You are already logged in');
        }
      }}
      className="px-4 py-2 text-sm border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
    >
      Login
    </button>
  </div>
</div>



      {/*  Conversation List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Chats</h3>
        {conversationLoading ? (
          <div className="text-center text-gray-500">Loading chats...</div>
        ) : conversdata.length === 0 ? (
          <div className="text-center text-gray-400">No recent chats yet</div>
        ) : (
          <ul className="space-y-2">
            {conversdata.map((user) => {
              const isOnline = onlineUsers?.includes(user._id);
              return (
                <li
                  key={user._id}
                  onClick={() => handleStartChat(user)}
                  className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md transition 
                    ${selectedUserId === user._id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium overflow-hidden">
                      {user.profilepic ? (
                        <img
                          src={user.profilepic}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span>{user.fullname?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800">
                      {user.fullname}
                      {isOnline && <span className="ml-2 text-xs text-green-500">• online</span>}
                    </p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/*  Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Search Results</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✖
              </button>
            </div>
            {searchuser.length === 0 ? (
              <p className="text-center text-gray-500">No users found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {searchuser.map((user) => (
                  <li key={user._id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {user.profilepic ? (
                          <img
                            src={user.profilepic}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.fullname?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.fullname}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartChat(user)}
                      className="text-sm px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                      Message
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSide;

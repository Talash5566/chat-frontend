import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import useConversation from '../Zustand/useConversation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronDown, FiChevronUp, FiLogOut, FiUser, FiUpload, FiMessageSquare } from 'react-icons/fi';
import { HiCog } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSocketContext } from '../Context/SocketContext';

const TopNavWithProfile = () => {
  const { selectedConversation } = useConversation();
  const { authUser, setAuthUser } = useAuth();
  const { onlineUsers } = useSocketContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

  const isOnline = selectedConversation?._id
    ? onlineUsers?.includes(selectedConversation._id)
    : false;

  useEffect(() => {
    setIsModalOpen(false);
    setIsProfileModalOpen(false);
  }, [selectedConversation]);

  if (!selectedConversation) return null;

  const handleLogout = () => {
    localStorage.removeItem('chat-app');
    setAuthUser(null);
    window.location.reload();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };


  return (
    <>
      {/*  Top Navigation Bar */}
      <motion.div
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 shadow-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white overflow-hidden ring-2 ring-white cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={selectedConversation.profilepic || '/default-avatar.png'}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </motion.div>

            <div>
              <motion.p
                className="font-semibold text-white cursor-pointer text-sm md:text-base"
                whileHover={{ x: 2 }}
                onClick={() => setIsModalOpen(true)}
              >
                {selectedConversation.username}
              </motion.p>
              <motion.p
                className="text-xs text-indigo-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isOnline ? 'Online' : 'Offline'}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <HiCog className="text-white text-lg md:text-xl" />
              </motion.button>

              {/* Settings Dropdown */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg z-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsSettingsOpen(false);
                        }}
                      >
                        <FiUser className="mr-2" />
                        My Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                        onClick={handleLogout}
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other User Profile Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:items-center modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-white to-gray-50 w-full max-w-md rounded-2xl shadow-2xl overflow-y-auto mx-2 modal-content"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{ maxHeight: '90vh' }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-gray-200 transition-colors shadow-md"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="text-gray-800 text-lg" />
              </motion.button>

              {/* Profile Header */}
              <div className="relative h-32 md:h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
                <motion.div
                  className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-xl">
                    <img
                      src={selectedConversation.profilepic || '/default-avatar.png'}
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Profile Content */}
              <div className="pt-12 md:pt-16 pb-4 md:pb-6 px-4 md:px-6">
                <div className="text-center mb-4 md:mb-6">
                  <motion.h2
                    className="text-xl md:text-2xl font-bold text-gray-800"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedConversation.fullname || selectedConversation.username}
                  </motion.h2>
                  <motion.p
                    className="text-indigo-600 font-medium text-sm md:text-base"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    @{selectedConversation.username}
                  </motion.p>
                </div>

                {/* Bio Section */}
                {selectedConversation.bio && (
                  <motion.div
                    className="mb-4 md:mb-6 bg-gray-50 rounded-lg p-3 md:p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">About</h3>
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        {showFullBio ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                    <p className={`text-gray-700 text-sm md:text-base ${showFullBio ? '' : 'line-clamp-3'}`}>
                      {selectedConversation.bio}
                    </p>
                  </motion.div>
                )}

                {/* Details Grid */}
                <motion.div
                  className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-indigo-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs text-indigo-500 font-medium">Age</p>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                      {selectedConversation.age || 'Not specified'}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs text-indigo-500 font-medium">Gender</p>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                      {selectedConversation.gender || 'Not specified'}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs text-indigo-500 font-medium">Status</p>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs text-indigo-500 font-medium">Joined</p>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                      {new Date(selectedConversation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:items-center modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsProfileModalOpen(false);
              setProfilePic(null);
              setPreviewImage('');
            }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-white to-gray-50 w-full max-w-md rounded-2xl shadow-2xl overflow-y-auto mx-2 modal-content"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{ maxHeight: '90vh' }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setProfilePic(null);
                  setPreviewImage('');
                }}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-gray-200 transition-colors shadow-md"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="text-gray-800 text-lg" />
              </motion.button>

              {/* Profile Header */}
              <div className="relative h-32 md:h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
                <motion.div
                  className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-xl cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <img
                      src={previewImage || authUser?.profilepic || '/default-avatar.png'}
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiUpload className="text-white text-lg" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Profile Content */}
              <div className="pt-12 md:pt-16 pb-4 md:pb-6 px-4 md:px-6">
                <div className="text-center mb-4 md:mb-6">
                  <motion.h2
                    className="text-xl md:text-2xl font-bold text-gray-800"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {authUser?.name || authUser?.username}
                  </motion.h2>
                  <motion.p
                    className="text-indigo-600 font-medium text-sm md:text-base"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    @{authUser?.username}
                  </motion.p>
                </div>

                {/* Details Grid */}
                <motion.div
                  className="mb-4 md:mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-indigo-50 p-3 rounded-lg w-full">
                    <p className="text-xs text-indigo-500 font-medium">Email</p>
                    <p className="text-gray-800 font-medium text-sm md:text-base">
                      {authUser?.email || 'Not specified'}
                    </p>
                  </div>
                </motion.div>

                {/* Upload Button */}
                {previewImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors text-sm md:text-base"
                    >
                      Save Profile Picture
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNavWithProfile;
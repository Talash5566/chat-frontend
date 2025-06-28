import React from 'react';
import LeftSide from '../Components/LeftSide';
import RightSide from '../Components/RightSide';
import TopNavWithProfile from './TopNavWithProfile';
import useConversation from '../Zustand/useConversation';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { selectedConversation, clearSelectedConversation } = useConversation();
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* DESKTOP VIEW - Both panels  */}
      <div className="hidden md:flex w-full">
        {/* Left panel */}
        <div className="w-[25%] min-w-[280px] border-r border-gray-300 shadow-md bg-white/70 backdrop-blur-lg">
          <LeftSide />
        </div>

        {/* Right panel */}
        <div className="flex-1 gap-20 flex flex-col gap-4 bg-white/60 backdrop-blur-xl">
          {/* Top Nav */}
          <div className="sticky top-0 z-30">
            <TopNavWithProfile />
          </div>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto">
            <RightSide />
          </div>
        </div>
      </div>

      {/* MOBILE VIEW  */}
      <div className="flex md:hidden w-full h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedConversation && (
            <motion.div
              key="mobile-left"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full h-full z-10 bg-white/70 backdrop-blur-lg overflow-y-auto"
            >
              <LeftSide />
            </motion.div>
          )}

          {selectedConversation && (
            <motion.div
              key="mobile-right"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full h-full z-20 bg-white/60 backdrop-blur-xl flex flex-col overflow-y-auto"
            >
              {/* Top Nav  */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white/70 backdrop-blur-lg sticky top-0 z-10">
                <button
                  onClick={clearSelectedConversation}
                  className="text-sm px-3 py-1 bg-indigo-200 text-indigo-700 rounded hover:bg-indigo-300"
                >
                  ← Back
                </button>
                <TopNavWithProfile />
              </div>

              {/* Chat */}
              <div className="flex-1 overflow-y-auto">
                <RightSide />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
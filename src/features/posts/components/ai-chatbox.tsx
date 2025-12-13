import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useSummaryPost } from '../api/get-summary-post';

interface AiChatboxProps {
  content: string;
}

export const AiChatbox = ({ content }: AiChatboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Only fetch summary when chatbox is opened
  const summaryPostQuery = useSummaryPost(
    { text: content },
    { enabled: isOpen && !!content },
  );

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Trigger summary animation after opening
      setTimeout(() => setShowFullSummary(true), 300);
    } else {
      setShowFullSummary(false);
      setTimeout(() => setIsOpen(false), 200);
    }
  };

  // Reset showFullSummary when summary data arrives
  useEffect(() => {
    if (summaryPostQuery.data?.summary && isOpen) {
      setShowFullSummary(true);
    }
  }, [summaryPostQuery.data, isOpen]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Floating Button with Speech Bubble
          <motion.div
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-end gap-3"
          >
            {/* AI Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggle}
              className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg transition-all hover:shadow-xl"
            >
              {/* Sparkle animation */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="size-6" />
              </motion.div>

              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.1, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.button>

            {/* Speech Bubble */}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-2"
            >
              <div className="rounded-2xl bg-white px-4 py-2 text-gray-800 shadow-md">
                <p className="text-sm font-medium">WetalkAI can help you</p>
                <p className="text-sm font-medium">summarize this post!</p>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute -left-1 bottom-3 size-3 rotate-45 bg-white" />
            </motion.div>
          </motion.div>
        ) : (
          // Expanded Chatbox
          <motion.div
            key="chatbox"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-96 overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="size-5" />
                <span className="font-semibold">WeTalk AI Summary</span>
              </div>
              <button
                onClick={handleToggle}
                className="rounded-full p-1 transition-colors hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto p-4">
              {summaryPostQuery.isLoading || summaryPostQuery.isFetching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {/* Greeting placeholder */}
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-blue-100"></div>
                  </div>

                  {/* Summary loading */}
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500">
                        Generating summary...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                </motion.div>
              ) : summaryPostQuery.data?.summary ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {/* Greeting message */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-lg bg-blue-50 p-3"
                  >
                    <p className="text-sm text-gray-700">
                      👋 Hey there! I&apos;ve read through this post and
                      here&apos;s what it&apos;s all about:
                    </p>
                  </motion.div>

                  {/* Summary with typing animation */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    {showFullSummary ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-sm leading-relaxed text-gray-800"
                      >
                        {summaryPostQuery.data.summary}
                      </motion.p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-blue-500" />
                        <span className="text-xs text-gray-500">
                          Generating summary...
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {showFullSummary && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center gap-1 text-xs text-gray-500"
                    >
                      <Sparkles className="size-3" />
                      <span>Powered by WeTalk AI</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No summary available for this post.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

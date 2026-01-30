import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { MDPreview } from '@/components/ui/md-preview';

import { useChatbotResponse } from '../api/get-response';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type SuggestionType = {
  id: string;
  text: string;
  icon: React.ReactNode;
};

const suggestions: SuggestionType[] = [
  {
    id: 'summary',
    text: 'Summarize posts',
    icon: <Lightbulb className="size-4" />,
  },
  {
    id: 'analytics',
    text: 'Analyze community',
    icon: <TrendingUp className="size-4" />,
  },
];

export const AiChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingContentRef = useRef('');

  const chatbotMutation = useChatbotResponse({
    callbacks: {
      onConnected: () => {
        setIsStreaming(true);
        setStreamingContent('');
        streamingContentRef.current = '';
      },
      onChunk: (chunk) => {
        streamingContentRef.current += chunk.content;
        setStreamingContent(streamingContentRef.current);
      },
      onComplete: () => {
        // Add the complete message FIRST
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: streamingContentRef.current,
            timestamp: new Date(),
          },
        ]);

        // Then clear streaming state
        // Use a small timeout to ensure the message render has started
        setTimeout(() => {
          setIsStreaming(false);
          setStreamingContent('');
          streamingContentRef.current = '';
        }, 0);
      },

      onError: (error) => {
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Sorry, something went wrong: ${error}`,
            timestamp: new Date(),
          },
        ]);
        setStreamingContent('');
        streamingContentRef.current = '';
      },
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || chatbotMutation.isPending) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Send to API
    chatbotMutation.mutate({
      data: {
        message: trimmedInput,
        temperature: 0.7,
        maxTokens: 2000,
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionType) => {
    // For now, just set the text in the input
    setInputValue(suggestion.text);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Floating Button
          <motion.button
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transition-all hover:shadow-xl"
          >
            {/* Bot Icon with animation */}
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Bot className="size-7" />
            </motion.div>

            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Notification badge */}
            <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              AI
            </div>
          </motion.button>
        ) : (
          // Expanded Chatbox
          <motion.div
            key="chatbox"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex h-[600px] w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">WeTalk AI Assistant</h3>
                  <p className="text-xs text-white/80">
                    Always here to help you
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="rounded-full p-1.5 transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
              {messages.length === 0 && !isStreaming ? (
                // Welcome message
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 p-6">
                      <Sparkles className="size-12 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-2 text-lg font-semibold text-gray-800">
                      Welcome to WeTalk AI! 👋
                    </h4>
                    <p className="text-sm text-gray-600">
                      I&apos;m here to help you with summaries, analytics, and
                      more. What would you like to know?
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">
                      Try these suggestions:
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex w-full items-center gap-3 rounded-xl border border-purple-200 bg-white p-3 text-left text-sm text-gray-700 transition-all hover:border-purple-400 hover:bg-purple-50"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            {suggestion.icon}
                          </div>
                          <span>{suggestion.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="mb-1 flex items-center gap-2">
                            <Bot className="size-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">
                              AI Assistant
                            </span>
                          </div>
                        )}

                        <MDPreview value={message.content} />
                      </div>
                    </motion.div>
                  ))}

                  {/* Streaming response */}
                  {isStreaming && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 text-gray-800 shadow-sm">
                        <div className="mb-1 flex items-center gap-2">
                          <Bot className="size-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">
                            AI Assistant
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {/* {streamingContent} */}

                          <MDPreview value={streamingContent} />
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="ml-1 inline-block h-4 w-0.5 bg-purple-600"
                          />
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Loading indicator */}
                  {chatbotMutation.isPending && !isStreaming && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <Loader2 className="size-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600">
                          Thinking...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={chatbotMutation.isPending}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-10 text-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {inputValue && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Sparkles className="size-4 text-purple-500" />
                    </motion.div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatbotMutation.isPending}
                  className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                >
                  {chatbotMutation.isPending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Send className="size-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

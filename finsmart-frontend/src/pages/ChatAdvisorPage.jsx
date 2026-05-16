import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import client from '../api/client';

import ChatWindow from '../components/ChatWindow.jsx';
import ChatInput from '../components/ChatInput.jsx';

export default function ChatAdvisorPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      text: userText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await client.post('/chat', {
        message: userText.trim(),
      });

      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        text: response.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const text =
        error.response?.status === 401
          ? 'Your session expired. Please sign in again.'
          : error.response?.data?.error ||
            'Something went wrong. Please retry in a moment.';

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          text,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[900px] overflow-hidden rounded-xl border border-white/[0.07] shadow-card bg-[#050c16]/85">
      <header className="flex-shrink-0 px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <span
            className="relative flex h-2.5 w-2.5"
            aria-hidden
          >
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-teal-400"
            />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
          </span>
          <div>
            <h1 className="font-display text-lg text-white">AI Financial Advisor</h1>
            <p className="text-xs text-[#8A9BB0] font-body">
              Ask concise questions—we’ll weave in your context when helpful.
            </p>
          </div>
        </div>
      </header>

      <ChatWindow messages={messages} isLoading={isLoading} onPromptClick={sendMessage} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

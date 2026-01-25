import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { FaTimes } from 'react-icons/fa';
import api from '../lib/api';
import chatbotAnimation from '../assets/animations/chatbot.json';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hi 👋 How can I help you today?'
};

// Floating chatbot that talks to the backend Groq proxy
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: trimmed });
      const aiReply = response.data?.content || 'Sorry, I could not process that right now.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('Chatbot error:', error.response?.data || error.message);
      // Try to get meaningful error message from backend
      const errorContent = error.response?.data?.content || 
                          error.response?.data?.error || 
                          '⚠️ Server error. Please try again.';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorContent }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 top-3 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-80 sm:w-96 overflow-hidden rounded-2xl border border-gray-800 bg-[#0b1220] text-gray-100 shadow-2xl backdrop-blur mt-12">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                <Lottie
                  animationData={chatbotAnimation}
                  loop
                  className="h-10 w-10"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-xs text-gray-400">Ask about products or orders</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 leading-relaxed shadow-sm ${isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-900 text-gray-100 border border-gray-800'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-gray-800 bg-[#0c1424] px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? 'Awaiting response...' : 'Type your message...'}
                className="h-11 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 min-w-[64px] items-center justify-center rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 bg-[#0b1220] text-indigo-300 shadow-lg transition hover:-translate-y-0.5 hover:bg-[#111a2d] hover:border-primary/60 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <FaTimes className="h-4 w-4" />
        ) : (
          <Lottie animationData={chatbotAnimation} loop className="h-10 w-10" />
        )}
      </button>
    </div>
  );
};

export default Chatbot;

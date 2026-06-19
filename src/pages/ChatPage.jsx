import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../store/authContext';
import { io } from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const loadChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadChats();

    socketRef.current = io('http://localhost:5001');

    socketRef.current.on('message_received', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    socketRef.current.on('typing', (data) => {
      if (data.senderName !== user.name) {
        setTypingUser(data.senderName);
        setTyping(true);
        setTimeout(() => setTyping(false), 3000);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    try {
      const res = await api.get(`/chats/${chat._id}/messages`);
      setMessages(res.data);
      socketRef.current.emit('join_chat', chat._id);
    } catch (err) {
      console.warn('Failed to load message history', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post(`/chats/${activeChat._id}/messages`, { text });
      setText('');
      loadChats();
    } catch (err) {
      alert('Message failed to send');
    }
  };

  const handleKeyPress = () => {
    if (activeChat) {
      socketRef.current.emit('typing', { chatId: activeChat._id, senderName: user.name });
    }
  };

  const getPartnerName = (chat) => {
    const partner = chat.participants.find(p => p._id !== user._id);
    return partner ? partner.name : 'Unknown User';
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 overflow-hidden h-[calc(100vh-4rem)]">
        <div className="w-80 border border-neutral-200 bg-white rounded-2xl p-4 flex flex-col h-full">
          <h3 className="text-base font-bold text-neutral-800 mb-4 border-b border-neutral-100 pb-3 flex items-center space-x-2">
            <MessageSquare size={18} className="text-brand-500" />
            <span>Chat Channels</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400">No active chat threads yet</div>
            ) : (
              chats.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleSelectChat(c)}
                  className={`w-full text-left rounded-xl p-3 text-sm transition-all border ${activeChat?._id === c._id ? 'border-brand-500 bg-brand-50/30' : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50'}`}
                >
                  <p className="font-semibold text-neutral-800">{getPartnerName(c)}</p>
                  <p className="text-xs text-neutral-400 mt-1 truncate">{c.lastMessage?.text || 'Start conversation...'}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 border border-neutral-200 bg-white rounded-2xl flex flex-col h-full overflow-hidden">
          {activeChat ? (
            <>
              <div className="border-b border-neutral-200 p-4 bg-neutral-50/50 flex justify-between items-center">
                <h3 className="font-bold text-neutral-800">{getPartnerName(activeChat)}</h3>
                {typing && (
                  <span className="text-[10px] text-brand-500 font-semibold italic animate-pulse">{typingUser} is typing...</span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isOwn = m.sender._id === user._id;
                  return (
                    <div key={m._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isOwn ? 'bg-brand-600 text-white rounded-br-none' : 'bg-neutral-200 text-neutral-800 rounded-bl-none border border-neutral-300'}`}>
                        <p>{m.text}</p>
                        <span className={`block text-[9px] mt-1.5 ${isOwn ? 'text-brand-100 text-right' : 'text-neutral-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-neutral-200 p-4 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    handleKeyPress();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-neutral-200 py-2.5 px-4 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-4 py-2.5 text-white hover:bg-brand-700 transition-colors flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
              <MessageSquare size={48} className="mb-4 text-neutral-300" />
              <h3 className="font-bold text-neutral-700">Select a Chat Channel</h3>
              <p className="text-xs text-neutral-400 mt-1">Pick a conversation thread from the sidebar to chat with creators.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

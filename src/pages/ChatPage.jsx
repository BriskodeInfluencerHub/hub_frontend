import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../store/authContext';
import { io } from 'socket.io-client';
import { Send, MessageSquare, Paperclip, ExternalLink, FileText, Plus, X, Search } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data);

      if (location.state?.activeChatId) {
        const found = res.data.find(c => c._id === location.state.activeChatId);
        if (found) {
          handleSelectChat(found);
          window.history.replaceState({}, document.title);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadChats();

    socketRef.current = io('http://localhost:5002');

    socketRef.current.on('message_received', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      loadChats();
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

  useEffect(() => {
    if (location.state?.activeChatId && chats.length > 0) {
      const found = chats.find(c => c._id === location.state.activeChatId);
      if (found && !activeChat) {
        handleSelectChat(found);
        window.history.replaceState({}, document.title);
      }
    }
  }, [chats]);

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    try {
      const res = await api.get(`/chats/${chat._id}/messages`);
      setMessages(res.data);
      socketRef.current.emit('join_chat', chat._id);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.warn('Failed to load message history', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post(`/chats/${activeChat._id}/messages`, { text });
      setMessages((prev) => [...prev, res.data]);
      setText('');
      loadChats();
    } catch (err) {
      alert('Message failed to send');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/users/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const msgRes = await api.post(`/chats/${activeChat._id}/messages`, {
        text: `Shared a file: ${file.name}`,
        fileUrl: uploadRes.data.fileUrl,
      });
      setMessages((prev) => [...prev, msgRes.data]);
      loadChats();
    } catch (err) {
      alert('File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  const getPartnerRole = (chat) => {
    const partner = chat.participants.find(p => p._id !== user._id);
    return partner ? partner.role : '';
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    setUserSearch('');
    setLoadingUsers(true);
    try {
      const res = await api.get('/users/influencers');
      const contacts = user.role === 'brand' || user.role === 'admin'
        ? res.data
        : [];
      setAvailableUsers(contacts);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartChat = async (participantId) => {
    try {
      const res = await api.post('/chats', { participantId });
      setShowNewChat(false);
      loadChats();
      const found = (await api.get('/chats')).data.find(c => c._id === res.data._id);
      if (found) handleSelectChat(found);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start chat');
    }
  };

  const filteredUsers = availableUsers.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.handle?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 overflow-hidden h-[calc(100vh-4rem)]">
        <div className="w-80 border border-neutral-200 bg-white rounded-2xl p-4 flex flex-col h-full">
          <div className="border-b border-neutral-100 pb-3 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800 flex items-center space-x-2">
                <MessageSquare size={18} className="text-brand-500" />
                <span>Chat Channels</span>
              </h3>
              <button
                onClick={openNewChat}
                className="rounded-lg bg-brand-600 p-1.5 text-white hover:bg-brand-700 transition-colors"
                title="New Message"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
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
                  <p className="text-xs text-neutral-400 mt-1 truncate">
                    {c.campaign ? `${c.campaign.title} — ` : ''}
                    {c.lastMessage?.text || 'Start conversation...'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 border border-neutral-200 bg-white rounded-2xl flex flex-col h-full overflow-hidden">
          {activeChat ? (
            <>
              <div className="border-b border-neutral-200 p-4 bg-neutral-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-neutral-800">{getPartnerName(activeChat)}</h3>
                  <p className="text-[10px] text-neutral-400 capitalize">{getPartnerRole(activeChat)}</p>
                  {activeChat.campaign && (
                    <p className="text-[10px] text-brand-600 font-semibold mt-0.5">
                      Campaign: {activeChat.campaign.title}
                    </p>
                  )}
                </div>
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
                        {m.text && <p>{m.text}</p>}
                        {m.fileUrl && (
                          <a
                            href={`http://localhost:5001${m.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 mt-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold underline ${isOwn ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}
                          >
                            <FileText size={12} />
                            <span>View File</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
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
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.zip"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-500 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    handleKeyPress();
                  }}
                  placeholder={uploading ? 'Uploading file...' : 'Type a message...'}
                  className="flex-1 rounded-xl border border-neutral-200 py-2.5 px-4 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  disabled={uploading}
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
              <p className="text-xs text-neutral-400 mt-1">Pick a conversation from the sidebar or click <strong>+</strong> to start a new message.</p>
            </div>
          )}
        </div>
      </main>

      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-800">New Message</h3>
              <button onClick={() => setShowNewChat(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search influencers..."
                className="w-full rounded-xl border border-neutral-200 py-2.5 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loadingUsers ? (
                <div className="text-center py-8 text-xs text-neutral-400">Loading...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400">No users found</div>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleStartChat(u.userId)}
                    className="w-full text-left rounded-xl border border-neutral-100 p-3 hover:bg-neutral-50 transition-colors flex items-center space-x-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center font-semibold text-brand-600 text-xs">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{u.name}</p>
                      <p className="text-[10px] text-neutral-400">{u.categories?.join(', ') || 'Influencer'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
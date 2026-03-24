import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, User, Bell, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { auth, db } from "../firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc,
  addDoc,
  setDoc
} from "firebase/firestore";

interface Message {
  id: string;
  text: string;
  sender: "visitor" | "admin";
  timestamp: any;
}

interface ChatSession {
  id: string;
  messages: Message[];
  unreadAdmin: number;
  lastMessage?: string;
  lastTimestamp?: any;
  status?: string;
}

export const AdminChat = () => {
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Map<string, ChatSession>>(new Map());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || user.email !== "lazerlit.me@gmail.com") return;

    // Track admin online status
    const statusRef = doc(db, "status", "admin");
    setDoc(statusRef, { online: true }, { merge: true });

    // Listen for all chats
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("lastTimestamp", "desc"));
    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      const newChats = new Map<string, ChatSession>();
      snapshot.docs.forEach(doc => {
        newChats.set(doc.id, { id: doc.id, ...doc.data(), messages: [] } as ChatSession);
      });
      setChats(newChats);
    });

    return () => {
      unsubscribeChats();
      updateDoc(statusRef, { online: false }).catch(console.error);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !activeChatId) {
      setActiveMessages([]);
      return;
    }

    const messagesRef = collection(db, "chats", activeChatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setActiveMessages(msgs);
    });

    return () => unsubscribeMessages();
  }, [user, activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSelectChat = async (id: string) => {
    setActiveChatId(id);
    const chatRef = doc(db, "chats", id);
    await updateDoc(chatRef, { unreadAdmin: 0 });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeChatId) return;

    const text = input;
    setInput("");

    try {
      const chatRef = doc(db, "chats", activeChatId);
      const messagesRef = collection(db, "chats", activeChatId, "messages");

      await addDoc(messagesRef, {
        text,
        sender: "admin",
        timestamp: serverTimestamp()
      });

      await updateDoc(chatRef, {
        lastMessage: text,
        lastTimestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div className="fixed inset-0 bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user || user.email !== "lazerlit.me@gmail.com") {
    return (
      <div className="fixed inset-0 z-[60] bg-dark flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-card border border-white/10 p-8 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
              <Bell size={32} />
            </div>
            <h2 className="text-2xl font-display tracking-wider text-white uppercase">Admin Portal</h2>
            <p className="text-gray-400 text-sm mt-2">
              {user ? "Access Denied. Please use the admin account." : "Please sign in to access the chat dashboard"}
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-lg"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>

          {user && (
            <button 
              onClick={handleLogout}
              className="w-full mt-4 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold"
            >
              Sign Out
            </button>
          )}

          <div className="text-center mt-6">
            <a href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Back to Website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-card border-r border-white/10 flex flex-col h-1/3 md:h-full">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">Admin Chat</h2>
            <p className="text-xs text-gray-400">Manage live conversations</p>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-auto text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {Array.from(chats.values()).map((chat: ChatSession) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between ${
                activeChatId === chat.id
                  ? "bg-primary/20 border border-primary/50"
                  : "bg-white/5 border border-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 shrink-0">
                  <User size={16} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">Visitor {chat.id.slice(0, 4)}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.lastMessage || "New visitor"}
                  </p>
                </div>
              </div>
              {chat.unreadAdmin > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
                  {chat.unreadAdmin}
                </span>
              )}
            </button>
          ))}
          {chats.size === 0 && (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No active visitors
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full bg-dark/50">
        {activeChatId && chats.get(activeChatId) ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Visitor {activeChatId.slice(0, 4)}</h3>
                <p className={`text-xs flex items-center gap-1 ${chats.get(activeChatId)?.status === 'online' ? 'text-green-400' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${chats.get(activeChatId)?.status === 'online' ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                  {chats.get(activeChatId)?.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center space-y-2">
                  <MessageCircle size={48} className="opacity-20" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                        msg.sender === "admin"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-card border border-white/10 text-gray-200 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-[10px] opacity-60 mt-2 block">
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "..."}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-6 bg-card border-t border-white/10">
              <div className="relative max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full bg-dark border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
            <MessageCircle size={64} className="opacity-20 mb-4" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

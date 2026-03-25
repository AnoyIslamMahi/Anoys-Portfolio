import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "../firebase";
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  setDoc, 
  updateDoc,
  increment,
  getDoc
} from "firebase/firestore";
import { getAIResponse } from "../services/aiService";

interface Message {
  id: string;
  text: string;
  sender: "visitor" | "admin";
  timestamp: any;
}

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [visitorName, setVisitorName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (error: any) {
          if (error.code === 'auth/admin-restricted-operation') {
            console.error("Firebase Anonymous Auth is disabled. Please enable it in the Firebase Console (Authentication > Sign-in method).");
          } else {
            console.error("Error signing in anonymously:", error);
          }
        }
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Ensure chat document exists
    const chatRef = doc(db, "chats", user.uid);
    const initializeChat = async () => {
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        await setDoc(chatRef, {
          id: user.uid,
          lastTimestamp: serverTimestamp(),
          unreadAdmin: 0,
          status: 'online'
        });
      } else {
        const data = chatDoc.data();
        if (data?.visitorName) {
          setVisitorName(data.visitorName);
          setHasName(true);
        }
        await updateDoc(chatRef, { status: 'online' });
      }
    };
    initializeChat();

    // Listen for messages
    const messagesRef = collection(db, "chats", user.uid, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    // Listen for admin status (optional: could be a global status doc)
    // For now, let's assume admin status is tracked via a special doc
    const statusRef = doc(db, "status", "admin");
    const unsubscribeStatus = onSnapshot(statusRef, (doc) => {
      if (doc.exists()) {
        setIsAdminOnline(doc.data().online);
        setIsAiEnabled(doc.data().aiEnabled !== false);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
      updateDoc(chatRef, { status: 'offline' }).catch(console.error);
    };
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !hasName) return;

    const text = input;
    setInput("");

    try {
      const chatRef = doc(db, "chats", user.uid);
      const messagesRef = collection(db, "chats", user.uid, "messages");

      await addDoc(messagesRef, {
        text,
        sender: "visitor",
        timestamp: serverTimestamp()
      });

      await setDoc(chatRef, {
        id: user.uid,
        lastMessage: text,
        lastTimestamp: serverTimestamp(),
        unreadAdmin: increment(1),
        status: "online",
        visitorName: visitorName
      }, { merge: true });

      // Trigger email notification via API route
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, visitorId: user.uid })
      }).catch(console.error);

      // Trigger AI Response
      if (isAiEnabled) {
        const currentHistory = messages.map(m => ({ role: m.sender, text: m.text }));
        setTimeout(async () => {
          const aiText = await getAIResponse(text, currentHistory);
          if (aiText) {
            await addDoc(messagesRef, {
              text: aiText,
              sender: "admin",
              timestamp: serverTimestamp()
            });

            await updateDoc(chatRef, {
              lastMessage: aiText,
              lastTimestamp: serverTimestamp(),
              unreadAdmin: 0 
            });
          }
        }, 2000);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !user) return;

    setIsSubmittingName(true);
    try {
      const chatRef = doc(db, "chats", user.uid);
      await setDoc(chatRef, {
        visitorName: visitorName.trim(),
        lastTimestamp: serverTimestamp()
      }, { merge: true });
      setHasName(true);
    } catch (error) {
      console.error("Error saving name:", error);
    } finally {
      setIsSubmittingName(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "500px", maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="bg-dark p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark ${isAdminOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Live Chat</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {isAdminOnline ? 'Online - Ready to chat' : "Offline - We'll reply soon"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-dark/50">
              {!hasName ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                    <User size={32} />
                  </div>
                  <h4 className="text-white font-bold mb-2">Welcome!</h4>
                  <p className="text-sm text-gray-400 mb-6">Please enter your name to start chatting with us.</p>
                  <form onSubmit={handleNameSubmit} className="w-full space-y-3">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!visitorName.trim() || isSubmittingName}
                      className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingName ? "Joining..." : "Start Chat"}
                    </button>
                  </form>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center space-y-2">
                  <MessageCircle size={32} className="opacity-50" />
                  <p className="text-sm">Send us a message and we'll get back to you shortly.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "visitor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === "visitor"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-white/10 text-gray-200 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-[10px] opacity-60 mt-1 block">
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
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
            <form onSubmit={sendMessage} className="p-4 bg-dark border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

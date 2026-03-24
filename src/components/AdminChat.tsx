import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MessageCircle, Send, User, Bell } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "visitor" | "admin";
  timestamp: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  unreadAdmin: number;
}

export const AdminChat = () => {
  const [chats, setChats] = useState<Map<string, ChatSession>>(new Map());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_admin");
    });

    newSocket.on("all_chats", (data: [string, ChatSession][]) => {
      setChats(new Map(data));
    });

    newSocket.on("visitor_joined", ({ id }: { id: string }) => {
      setChats((prev: Map<string, ChatSession>) => {
        const next = new Map(prev);
        if (!next.has(id)) {
          next.set(id, { id, messages: [], unreadAdmin: 0 });
        }
        return next;
      });
    });

    newSocket.on("new_message", ({ visitorId, message }: { visitorId: string, message: Message }) => {
      setChats((prev: Map<string, ChatSession>) => {
        const next = new Map(prev);
        const chat = next.get(visitorId);
        if (chat) {
          chat.messages.push(message);
          if (activeChatId !== visitorId && message.sender === "visitor") {
            chat.unreadAdmin += 1;
          }
          next.set(visitorId, chat);
        }
        return next;
      });
    });

    newSocket.on("chat_updated", ({ visitorId, chat }: { visitorId: string, chat: ChatSession }) => {
      setChats((prev: Map<string, ChatSession>) => {
        const next = new Map(prev);
        next.set(visitorId, chat);
        return next;
      });
    });

    newSocket.on("visitor_left", ({ id }) => {
      // Optional: mark visitor as offline
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, activeChatId]);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    if (socket) {
      socket.emit("mark_read", id);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !activeChatId) return;

    socket.emit("send_message", {
      text: input,
      sender: "admin",
      to: activeChatId,
    });

    setInput("");
  };

  const activeChat = activeChatId ? chats.get(activeChatId) : null;

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
                    {chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].text
                      : "New visitor"}
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
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Visitor {activeChat.id.slice(0, 4)}</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeChat.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center space-y-2">
                  <MessageCircle size={48} className="opacity-20" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                activeChat.messages.map((msg) => (
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
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

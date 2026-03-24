import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Store active chats in memory
  // In a real app, you'd use a database like Redis or Postgres
  const activeChats = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_admin", () => {
      socket.join("admin");
      console.log("Admin joined");
      // Send all active chats to the admin
      socket.emit("all_chats", Array.from(activeChats.entries()));
    });

    socket.on("join_visitor", () => {
      socket.join(`visitor_${socket.id}`);
      if (!activeChats.has(socket.id)) {
        activeChats.set(socket.id, {
          id: socket.id,
          messages: [],
          unreadAdmin: 0,
        });
      }
      console.log("Visitor joined:", socket.id);
      // Notify admin about new visitor
      io.to("admin").emit("visitor_joined", { id: socket.id });
    });

    socket.on("send_message", (data) => {
      const { text, sender, to } = data;
      const message = {
        id: Date.now().toString(),
        text,
        sender,
        timestamp: new Date().toISOString(),
      };

      if (sender === "visitor") {
        const chat = activeChats.get(socket.id);
        if (chat) {
          chat.messages.push(message);
          chat.unreadAdmin += 1;
          activeChats.set(socket.id, chat);
          
          // Send to admin
          io.to("admin").emit("new_message", { visitorId: socket.id, message });
          // Send back to visitor
          socket.emit("new_message", { message });
        }
      } else if (sender === "admin") {
        const chat = activeChats.get(to);
        if (chat) {
          chat.messages.push(message);
          activeChats.set(to, chat);
          
          // Send to visitor
          io.to(`visitor_${to}`).emit("new_message", { message });
          // Send back to admin
          socket.emit("new_message", { visitorId: to, message });
        }
      }
    });

    socket.on("mark_read", (visitorId) => {
      const chat = activeChats.get(visitorId);
      if (chat) {
        chat.unreadAdmin = 0;
        activeChats.set(visitorId, chat);
        io.to("admin").emit("chat_updated", { visitorId, chat });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // We don't delete the chat immediately so admin can still read history
      // But we could notify admin that visitor left
      io.to("admin").emit("visitor_left", { id: socket.id });
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

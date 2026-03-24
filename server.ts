import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import nodemailer from "nodemailer";

// Configure nodemailer
// Note: To actually send emails, you need to provide real SMTP credentials in your environment variables.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "lazerlit.me@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
});

async function sendEmailNotification(text: string, visitorId: string) {
  try {
    if (!process.env.SMTP_PASS) {
      console.log("Email not sent: SMTP_PASS environment variable is not set.");
      return;
    }
    await transporter.sendMail({
      from: process.env.SMTP_USER || "lazerlit.me@gmail.com",
      to: "lazerlit.me@gmail.com",
      subject: `New Live Chat Message from Visitor ${visitorId.slice(0, 4)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Chat Message</h2>
          <p style="color: #666; font-size: 14px;"><strong>Visitor ID:</strong> ${visitorId}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.5;">${text}</p>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">You can reply to this visitor from your <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin/chat">Admin Dashboard</a>.</p>
        </div>
      `,
    });
    console.log("Email notification sent.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

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
  const activeChats = new Map();
  let adminOnline = false;
  let adminSocketId: string | null = null;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_admin", () => {
      socket.join("admin");
      adminOnline = true;
      adminSocketId = socket.id;
      console.log("Admin joined");
      // Send all active chats to the admin
      socket.emit("all_chats", Array.from(activeChats.entries()));
      // Broadcast admin status to all visitors
      io.emit("admin_status", adminOnline);
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
      // Send current admin status to the new visitor
      socket.emit("admin_status", adminOnline);
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
          const isFirstMessage = chat.messages.length === 0;
          
          chat.messages.push(message);
          chat.unreadAdmin += 1;
          activeChats.set(socket.id, chat);
          
          // Send to admin
          io.to("admin").emit("new_message", { visitorId: socket.id, message });
          // Send back to visitor
          socket.emit("new_message", { message });

          // Send email notification
          sendEmailNotification(text, socket.id);

          // Automated reply on first message
          if (isFirstMessage) {
            setTimeout(() => {
              const autoReply = {
                id: (Date.now() + 1).toString(),
                text: "Thanks for reaching out! I will reply as soon as I'm available.",
                sender: "admin",
                timestamp: new Date().toISOString(),
              };
              
              const updatedChat = activeChats.get(socket.id);
              if (updatedChat) {
                updatedChat.messages.push(autoReply);
                activeChats.set(socket.id, updatedChat);
                
                // Send auto-reply to visitor
                io.to(`visitor_${socket.id}`).emit("new_message", { message: autoReply });
                // Update admin's view
                io.to("admin").emit("new_message", { visitorId: socket.id, message: autoReply });
              }
            }, 1000);
          }
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
      if (socket.id === adminSocketId) {
        adminOnline = false;
        adminSocketId = null;
        io.emit("admin_status", adminOnline);
      } else {
        io.to("admin").emit("visitor_left", { id: socket.id });
      }
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

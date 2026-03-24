import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import nodemailer from "nodemailer";

// Configure nodemailer
// Note: To actually send emails, you need to provide real SMTP credentials in your environment variables.
let transporter: any = null;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER || "lazerlit.me@gmail.com",
      pass: process.env.SMTP_PASS || "your-app-password",
    },
  });
} catch (err) {
  console.error("Failed to create nodemailer transporter:", err);
}

async function sendEmailNotification(text: string, visitorId: string) {
  try {
    if (!transporter || !process.env.SMTP_PASS) {
      console.log("Email not sent: SMTP_PASS environment variable is not set or transporter failed to initialize.");
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
  try {
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

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join_admin", async () => {
        try {
          socket.join("admin");
          console.log("Admin joined");
          
          // Send all active chats to the admin
          socket.emit("all_chats", Array.from(activeChats.entries()));
          
          // Broadcast admin status to all visitors
          const adminSockets = await io.in("admin").fetchSockets();
          io.emit("admin_status", adminSockets.length > 0);
        } catch (err) {
          console.error("Error in join_admin:", err);
        }
      });

      socket.on("join_visitor", ({ visitorId }: { visitorId: string }) => {
        try {
          socket.join(`visitor_${visitorId}`);
          
          let chat = activeChats.get(visitorId);
          if (!chat) {
            chat = {
              id: visitorId,
              messages: [],
              unreadAdmin: 0,
            };
            activeChats.set(visitorId, chat);
          }
          
          console.log("Visitor joined:", visitorId);
          
          // Send current chat history to the visitor
          socket.emit("chat_history", chat.messages);
          
          // Send current admin status to the new visitor
          io.in("admin").fetchSockets().then(sockets => {
            socket.emit("admin_status", sockets.length > 0);
          }).catch(err => console.error("Error fetching sockets in join_visitor:", err));
          
          // Notify admin about new/returning visitor
          io.to("admin").emit("visitor_joined", { id: visitorId });
        } catch (err) {
          console.error("Error in join_visitor:", err);
        }
      });

      socket.on("send_message", (data) => {
        try {
          const { text, sender, to, visitorId: vid } = data;
          const visitorId = sender === "visitor" ? vid : to;
          
          if (!visitorId) return;

          const message = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date().toISOString(),
          };

          const chat = activeChats.get(visitorId);
          if (chat) {
            const isFirstMessage = chat.messages.length === 0 && sender === "visitor";
            
            chat.messages.push(message);
            if (sender === "visitor") {
              chat.unreadAdmin += 1;
            }
            activeChats.set(visitorId, chat);
            
            // Send to all admin tabs
            io.to("admin").emit("new_message", { visitorId, message });
            
            // Send to visitor (all their tabs/windows)
            io.to(`visitor_${visitorId}`).emit("new_message", { message });

            if (sender === "visitor") {
              // Send email notification
              sendEmailNotification(text, visitorId);

              // Automated reply on first message
              if (isFirstMessage) {
                setTimeout(() => {
                  const autoReply = {
                    id: (Date.now() + 1).toString(),
                    text: "Thanks for reaching out! I will reply as soon as I'm available.",
                    sender: "admin",
                    timestamp: new Date().toISOString(),
                  };
                  
                  const updatedChat = activeChats.get(visitorId);
                  if (updatedChat) {
                    updatedChat.messages.push(autoReply);
                    activeChats.set(visitorId, updatedChat);
                    
                    // Send auto-reply to visitor
                    io.to(`visitor_${visitorId}`).emit("new_message", { message: autoReply });
                    // Update admin's view
                    io.to("admin").emit("new_message", { visitorId, message: autoReply });
                  }
                }, 1000);
              }
            }
          }
        } catch (err) {
          console.error("Error in send_message:", err);
        }
      });

      socket.on("mark_read", (visitorId) => {
        try {
          const chat = activeChats.get(visitorId);
          if (chat) {
            chat.unreadAdmin = 0;
            activeChats.set(visitorId, chat);
            io.to("admin").emit("chat_updated", { visitorId, chat });
          }
        } catch (err) {
          console.error("Error in mark_read:", err);
        }
      });

      socket.on("disconnect", async () => {
        try {
          console.log("User disconnected:", socket.id);
          
          const adminSockets = await io.in("admin").fetchSockets();
          io.emit("admin_status", adminSockets.length > 0);
          
          io.to("admin").emit("visitor_left", { id: socket.id });
        } catch (err) {
          console.error("Error in disconnect:", err);
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
  } catch (error) {
    console.error("Critical error starting server:", error);
  }
}

startServer();

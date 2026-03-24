import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Configure nodemailer
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
        if (!process.env.SMTP_PASS) {
          console.warn("Email notification skipped: SMTP_PASS environment variable is not set.");
          return;
        }

        if (!transporter) {
          console.error("Email notification failed: Transporter not initialized.");
          return;
        }

        const mailOptions = {
          from: `"Live Chat" <${process.env.SMTP_USER || "lazerlit.me@gmail.com"}>`,
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
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully:", info.messageId);
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    }

    // API Routes
    app.post("/api/notify", async (req, res) => {
      const { text, visitorId } = req.body;
      if (text && visitorId) {
        await sendEmailNotification(text, visitorId);
      }
      res.json({ status: "ok" });
    });

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Critical error starting server:", error);
  }
}

startServer();
